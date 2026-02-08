import { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Send,
  Plus,
  Image as ImageIcon,
  FileText,
  Mic,
  Copy,
  Check,
  History,
  Edit,
  Trash2,
  MoreVertical,
  Sparkles,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Code,
  X,
  MessageSquare,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  aiKnowledgeChatService,
  ChatSession,
  ChatMessage,
} from '@/services/aiKnowledgeChatService';

const MAX_MESSAGES_PER_SESSION = 500;
const DAILY_TOKEN_LIMIT = 100000;
const COOLDOWN_HOURS = 2;

// Interest categories with suggested prompts
const INTEREST_CATEGORIES = [
  {
    id: 'ict-skills',
    name: 'ICT Skills',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    prompts: [
      'Help me learn web development from scratch',
      'What programming language should I start with?',
      'Guide me on how to become a software engineer',
      'Explain cloud computing and its career opportunities',
    ],
  },
  {
    id: 'business',
    name: 'Business & Entrepreneurship',
    icon: Briefcase,
    color: 'from-purple-500 to-pink-500',
    prompts: [
      'How do I start a small business in Tanzania?',
      'What are the key skills for entrepreneurs?',
      'Help me create a business plan',
      'Guide me on digital marketing strategies',
    ],
  },
  {
    id: 'education',
    name: 'Academic Support',
    icon: GraduationCap,
    color: 'from-green-500 to-emerald-500',
    prompts: [
      'Help me improve my study habits',
      'What courses should I take for my career goals?',
      'Guide me on time management for students',
      'How do I prepare for university entrance exams?',
    ],
  },
  {
    id: 'career',
    name: 'Career Planning',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    prompts: [
      'Help me choose the right career path',
      'How do I prepare for job interviews?',
      'Review my CV and suggest improvements',
      'What skills are in demand in Tanzania?',
    ],
  },
];

// Group sessions by date for professional history display
function groupSessionsByDate(sessions: ChatSession[]) {
  const groups: { label: string; sessions: ChatSession[] }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const todaySessions: ChatSession[] = [];
  const yesterdaySessions: ChatSession[] = [];
  const lastWeekSessions: ChatSession[] = [];
  const lastMonthSessions: ChatSession[] = [];
  const olderSessions: ChatSession[] = [];

  for (const session of sessions) {
    const sessionDate = new Date(session.last_message_at || session.updated_at);
    sessionDate.setHours(0, 0, 0, 0);

    if (sessionDate >= today) {
      todaySessions.push(session);
    } else if (sessionDate >= yesterday) {
      yesterdaySessions.push(session);
    } else if (sessionDate >= lastWeek) {
      lastWeekSessions.push(session);
    } else if (sessionDate >= lastMonth) {
      lastMonthSessions.push(session);
    } else {
      olderSessions.push(session);
    }
  }

  if (todaySessions.length > 0) groups.push({ label: 'Today', sessions: todaySessions });
  if (yesterdaySessions.length > 0) groups.push({ label: 'Yesterday', sessions: yesterdaySessions });
  if (lastWeekSessions.length > 0) groups.push({ label: 'Last 7 Days', sessions: lastWeekSessions });
  if (lastMonthSessions.length > 0) groups.push({ label: 'Last 30 Days', sessions: lastMonthSessions });
  if (olderSessions.length > 0) groups.push({ label: 'Older', sessions: olderSessions });

  return groups;
}

export default function AIKnowledgeChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadCounts, setUploadCounts] = useState({ pdfs: 0, images: 0 });
  const [dailyTokensUsed, setDailyTokensUsed] = useState(0);
  const [tokenLimitReached, setTokenLimitReached] = useState(false);
  const [cooldownEndTime, setCooldownEndTime] = useState<Date | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const groupedSessions = useMemo(() => groupSessionsByDate(sessions), [sessions]);

  const sessionMessageLimitReached = currentSession
    ? (currentSession.message_count || 0) >= MAX_MESSAGES_PER_SESSION
    : false;

  useEffect(() => {
    loadSessions();
    loadUploadCounts();
    loadDailyTokenUsage();
  }, []);

  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
      setShowHistory(false); // Close history when selecting a session
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cooldown timer
  useEffect(() => {
    if (!cooldownEndTime) return;
    const interval = setInterval(() => {
      if (new Date() >= cooldownEndTime) {
        setTokenLimitReached(false);
        setCooldownEndTime(null);
        setDailyTokensUsed(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownEndTime]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    try {
      const data = await aiKnowledgeChatService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const data = await aiKnowledgeChatService.getSessionMessages(sessionId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive',
      });
    }
  };

  const loadUploadCounts = async () => {
    try {
      const counts = await aiKnowledgeChatService.getTodaysUploads();
      setUploadCounts(counts);
    } catch (error) {
      console.error('Failed to load upload counts:', error);
    }
  };

  const loadDailyTokenUsage = async () => {
    try {
      const usage = await aiKnowledgeChatService.getDailyTokenUsage();
      setDailyTokensUsed(usage.tokensUsed);
      if (usage.tokensUsed >= DAILY_TOKEN_LIMIT) {
        setTokenLimitReached(true);
        setCooldownEndTime(usage.cooldownEndsAt ? new Date(usage.cooldownEndsAt) : null);
      }
    } catch (error) {
      console.error('Failed to load daily token usage:', error);
    }
  };

  const getCooldownRemaining = () => {
    if (!cooldownEndTime) return '';
    const now = new Date();
    const diff = cooldownEndTime.getTime() - now.getTime();
    if (diff <= 0) return '';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Check token limit
    if (tokenLimitReached) {
      toast({
        title: 'Daily Token Limit Reached',
        description: `You've used ${dailyTokensUsed.toLocaleString()} of ${DAILY_TOKEN_LIMIT.toLocaleString()} tokens today. Wait ${getCooldownRemaining()} or upgrade to Pro.`,
        variant: 'destructive',
      });
      return;
    }

    // Check session message limit
    if (sessionMessageLimitReached) {
      toast({
        title: 'Session Limit Reached',
        description: `This session has reached the ${MAX_MESSAGES_PER_SESSION} message limit. Please start a new chat.`,
        variant: 'destructive',
      });
      return;
    }

    const userMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Add user message optimistically
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: currentSession?.id || '',
      user_id: user?.id || '',
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const response = await aiKnowledgeChatService.sendMessage({
        sessionId: currentSession?.id,
        message: userMessage,
        category: selectedCategory || undefined,
      });

      // Track token usage from response
      if (response.usage) {
        const newTotal = dailyTokensUsed + (response.usage.total_tokens || 0);
        setDailyTokensUsed(newTotal);
        if (newTotal >= DAILY_TOKEN_LIMIT) {
          setTokenLimitReached(true);
          const cooldownEnd = new Date();
          cooldownEnd.setHours(cooldownEnd.getHours() + COOLDOWN_HOURS);
          setCooldownEndTime(cooldownEnd);
        }
      }

      // Update session if new
      if (!currentSession && response.sessionId) {
        await loadSessions();
        // Find newly created session from refreshed data
        const freshSessions = await aiKnowledgeChatService.getSessions();
        const newSession = freshSessions.find(s => s.id === response.sessionId);
        if (newSession) {
          setSessions(freshSessions);
          setCurrentSession(newSession);
        }
      } else {
        // Refresh sessions to update message counts
        await loadSessions();
      }

      // Reload messages to get accurate data
      if (response.sessionId) {
        await loadMessages(response.sessionId);
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);

      // Check if it's a token limit error from the server
      if (error.message?.includes('token limit') || error.message?.includes('rate limit')) {
        setTokenLimitReached(true);
        const cooldownEnd = new Date();
        cooldownEnd.setHours(cooldownEnd.getHours() + COOLDOWN_HOURS);
        setCooldownEndTime(cooldownEnd);
      }

      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });

      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      toast({
        title: 'Copied',
        description: 'Message copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy message',
        variant: 'destructive',
      });
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
    // Focus the textarea after setting the prompt
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleNewChat = () => {
    setCurrentSession(null);
    setMessages([]);
    setSelectedCategory(null);
  };

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSession(session);
    setShowHistory(false); // Close history panel when a session is selected
  };

  const handleRenameSession = async (sessionId: string, newTitle: string) => {
    try {
      await aiKnowledgeChatService.renameSession(sessionId, newTitle);
      await loadSessions();
      toast({
        title: 'Success',
        description: 'Chat renamed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to rename chat',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await aiKnowledgeChatService.deleteSession(sessionId);
      if (currentSession?.id === sessionId) {
        handleNewChat();
      }
      await loadSessions();
      toast({
        title: 'Success',
        description: 'Chat deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete chat',
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = async (type: 'pdf' | 'image') => {
    if (type === 'pdf' && uploadCounts.pdfs >= 2) {
      toast({
        title: 'Daily Limit Reached',
        description: 'You can only upload 2 PDFs per day',
        variant: 'destructive',
      });
      return;
    }

    if (type === 'image' && uploadCounts.images >= 2) {
      toast({
        title: 'Daily Limit Reached',
        description: 'You can only upload 2 images per day',
        variant: 'destructive',
      });
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'pdf' ? '.pdf' : 'image/*';
      fileInputRef.current.click();
    }
  };

  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await aiKnowledgeChatService.uploadKnowledgeFile(file, currentSession?.id);
      await loadUploadCounts();
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const tokenUsagePercent = Math.min((dailyTokensUsed / DAILY_TOKEN_LIMIT) * 100, 100);

  return (
    <div className='h-full flex gap-4'>
      {/* History Sidebar - slides in from left */}
      {showHistory && (
        <>
          {/* Backdrop overlay for clean dismissal */}
          <div
            className='fixed inset-0 bg-black/20 z-20 md:hidden'
            onClick={() => setShowHistory(false)}
          />
          <div className='w-80 flex-shrink-0 h-full fixed left-0 top-0 bottom-0 z-30 md:relative md:z-0 bg-background border-r md:border-r-0'>
            <div className='flex flex-col h-full'>
              <div className='flex items-center justify-between p-4 border-b'>
                <div className='flex items-center gap-2'>
                  <MessageSquare className='h-5 w-5 text-primary' />
                  <h2 className='font-semibold text-base'>Chat History</h2>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setShowHistory(false)}>
                  <X className='h-4 w-4' />
                </Button>
              </div>
              <div className='p-3'>
                <Button
                  size='sm'
                  className='w-full'
                  onClick={() => {
                    handleNewChat();
                    setShowHistory(false);
                  }}>
                  <Plus className='h-4 w-4 mr-2' />
                  New Chat
                </Button>
              </div>
              <ScrollArea className='flex-1'>
                <div className='px-3 pb-4'>
                  {groupedSessions.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground text-sm'>
                      No conversations yet
                    </div>
                  ) : (
                    groupedSessions.map((group) => (
                      <div key={group.label} className='mb-4'>
                        <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2'>
                          {group.label}
                        </p>
                        <div className='space-y-1'>
                          {group.sessions.map((session) => (
                            <div
                              key={session.id}
                              className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                                currentSession?.id === session.id ? 'bg-accent' : ''
                              }`}
                              onClick={() => handleSelectSession(session)}>
                              <MessageSquare className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                              <div className='flex-1 min-w-0'>
                                <p className='text-sm truncate'>{session.title}</p>
                                <p className='text-xs text-muted-foreground'>
                                  {session.message_count} messages
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100 flex-shrink-0'
                                    onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className='h-3 w-3' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newTitle = window.prompt('Enter new title:', session.title);
                                      if (newTitle) handleRenameSession(session.id, newTitle);
                                    }}>
                                    <Edit className='h-4 w-4 mr-2' />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm('Delete this chat?')) {
                                        handleDeleteSession(session.id);
                                      }
                                    }}
                                    className='text-destructive'>
                                    <Trash2 className='h-4 w-4 mr-2' />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              {/* Token usage indicator in history panel */}
              <div className='p-3 border-t'>
                <div className='text-xs text-muted-foreground mb-1 flex justify-between'>
                  <span>Daily tokens</span>
                  <span>{dailyTokensUsed.toLocaleString()} / {DAILY_TOKEN_LIMIT.toLocaleString()}</span>
                </div>
                <div className='w-full bg-muted rounded-full h-1.5'>
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      tokenUsagePercent >= 90 ? 'bg-destructive' : tokenUsagePercent >= 70 ? 'bg-yellow-500' : 'bg-primary'
                    }`}
                    style={{ width: `${tokenUsagePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col h-full min-w-0'>
        {/* Header */}
        <Card className='border-b rounded-b-none'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-9 w-9'
                  onClick={() => setShowHistory(!showHistory)}>
                  <History className='h-5 w-5' />
                </Button>
                <div className='p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20'>
                  <Sparkles className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <CardTitle className='text-xl'>AI Knowledge Chat</CardTitle>
                  <p className='text-sm text-muted-foreground mt-1'>
                    {currentSession ? currentSession.title : 'Your personal career & education assistant'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button size='sm' onClick={handleNewChat}>
                  <Plus className='h-4 w-4 mr-2' />
                  New Chat
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Token limit warning banner */}
        {tokenLimitReached && (
          <div className='bg-destructive/10 border-b border-destructive/20 px-4 py-3 flex items-center gap-3'>
            <AlertTriangle className='h-5 w-5 text-destructive flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-destructive'>Daily token limit reached</p>
              <p className='text-xs text-muted-foreground'>
                {cooldownEndTime
                  ? `You can continue in ${getCooldownRemaining()}. Or upgrade to Pro for unlimited access.`
                  : 'Please wait or upgrade to Pro for unlimited access.'}
              </p>
            </div>
            <Button size='sm' variant='outline' className='flex-shrink-0'>
              Upgrade to Pro
            </Button>
          </div>
        )}

        {/* Session message limit warning */}
        {sessionMessageLimitReached && (
          <div className='bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-3 flex items-center gap-3'>
            <AlertTriangle className='h-5 w-5 text-yellow-600 flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-yellow-700'>Session limit reached ({MAX_MESSAGES_PER_SESSION} messages)</p>
              <p className='text-xs text-muted-foreground'>
                Please start a new chat to continue your conversation.
              </p>
            </div>
            <Button size='sm' onClick={handleNewChat}>
              <Plus className='h-4 w-4 mr-2' />
              New Chat
            </Button>
          </div>
        )}

        {/* Messages Area */}
        <div className='flex-1 overflow-hidden bg-muted/30'>
          <ScrollArea className='h-full p-4'>
            {messages.length === 0 ? (
              <div className='flex items-center justify-center h-full'>
                <div className='text-center max-w-2xl'>
                  <div className='p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 w-20 h-20 mx-auto mb-4 flex items-center justify-center'>
                    <Sparkles className='h-10 w-10 text-primary' />
                  </div>
                  <h3 className='text-2xl font-bold mb-2'>Start a conversation</h3>
                  <p className='text-muted-foreground mb-6'>
                    Ask me anything about your career, education, or skills development!
                  </p>
                  {/* Quick prompt suggestions in empty state */}
                  <div className='grid grid-cols-2 gap-2 max-w-lg mx-auto'>
                    {INTEREST_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          className='flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left text-sm'
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setInputMessage(cat.prompts[0]);
                            textareaRef.current?.focus();
                          }}>
                          <div className={`p-1.5 rounded-md bg-gradient-to-br ${cat.color}`}>
                            <Icon className='h-3.5 w-3.5 text-white' />
                          </div>
                          <span className='text-muted-foreground'>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className='space-y-4 max-w-4xl mx-auto'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                    {message.role === 'assistant' && (
                      <div className='w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0'>
                        <Sparkles className='h-4 w-4 text-white' />
                      </div>
                    )}
                    <div
                      className={`group relative max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border'
                      }`}>
                      {message.role === 'assistant' ? (
                        <div className='prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:mt-3 prose-headings:mb-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-a:text-primary'>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className='whitespace-pre-wrap'>
                          {message.content}
                        </div>
                      )}
                      {message.role === 'assistant' && (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 bg-background border shadow-sm'
                          onClick={() => handleCopyMessage(message.content, message.id)}>
                          {copiedMessageId === message.id ? (
                            <Check className='h-3 w-3 text-green-500' />
                          ) : (
                            <Copy className='h-3 w-3' />
                          )}
                        </Button>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold flex-shrink-0'>
                        {user?.email?.[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className='flex gap-3 justify-start'>
                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0'>
                      <Sparkles className='h-4 w-4 text-white' />
                    </div>
                    <div className='bg-card border rounded-2xl px-4 py-3'>
                      <div className='flex gap-1'>
                        <div className='w-2 h-2 rounded-full bg-primary animate-bounce' style={{ animationDelay: '0ms' }} />
                        <div className='w-2 h-2 rounded-full bg-primary animate-bounce' style={{ animationDelay: '150ms' }} />
                        <div className='w-2 h-2 rounded-full bg-primary animate-bounce' style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Input Area - Professional design with send button inside */}
        <Card className='border-t rounded-t-none'>
          <CardContent className='p-4'>
            <input
              type='file'
              ref={fileInputRef}
              onChange={onFileSelect}
              className='hidden'
            />
            <div className='flex items-end gap-2'>
              {/* File upload button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-10 w-10 flex-shrink-0 rounded-full'>
                    <Plus className='h-5 w-5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleFileUpload('pdf')}>
                    <FileText className='h-4 w-4 mr-2' />
                    Upload PDF ({uploadCounts.pdfs}/2 today)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFileUpload('image')}>
                    <ImageIcon className='h-4 w-4 mr-2' />
                    Upload Image ({uploadCounts.images}/2 today)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Input container with send button inside */}
              <div className='flex-1 relative flex items-end border rounded-2xl bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-all'>
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder='Ask me anything about your career or education...'
                  className='flex-1 min-h-[44px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-12 py-3 bg-transparent'
                  disabled={tokenLimitReached || sessionMessageLimitReached}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || tokenLimitReached || sessionMessageLimitReached}
                  size='icon'
                  className='absolute right-2 bottom-2 h-8 w-8 rounded-full'>
                  <Send className='h-4 w-4' />
                </Button>
              </div>

              {/* Voice button */}
              <Button variant='ghost' size='icon' className='h-10 w-10 flex-shrink-0 rounded-full' title='Voice chat (Coming soon)'>
                <Mic className='h-5 w-5' />
              </Button>
            </div>
            <p className='text-xs text-muted-foreground text-center mt-2'>
              Ubongo may make mistakes. Verify important information.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interest Categories Sidebar - only show when no history panel and no active chat */}
      {!showHistory && (
        <div className='w-72 space-y-3 flex-shrink-0 hidden lg:block'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>Quick Topics</CardTitle>
              <p className='text-xs text-muted-foreground'>
                Pick a topic to get started
              </p>
            </CardHeader>
            <CardContent className='space-y-2'>
              {INTEREST_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <Dialog key={category.id}>
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full justify-start h-auto py-3'
                        onClick={() => setSelectedCategory(category.id)}>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} mr-3`}>
                          <Icon className='h-4 w-4 text-white' />
                        </div>
                        <span className='text-left flex-1 text-sm'>{category.name}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-md'>
                      <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                            <Icon className='h-5 w-5 text-white' />
                          </div>
                          {category.name}
                        </DialogTitle>
                        <DialogDescription>
                          Click a prompt to start a conversation
                        </DialogDescription>
                      </DialogHeader>
                      <div className='space-y-2 mt-4'>
                        {category.prompts.map((prompt, index) => (
                          <Button
                            key={index}
                            variant='outline'
                            className='w-full justify-start text-left h-auto py-3 px-4'
                            onClick={() => {
                              handlePromptClick(prompt);
                              document.querySelector('[data-state="open"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                            }}>
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </CardContent>
          </Card>

          {/* Upload Status */}
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm'>Today's Uploads</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>PDFs</span>
                <Badge variant={uploadCounts.pdfs >= 2 ? 'destructive' : 'secondary'}>
                  {uploadCounts.pdfs}/2
                </Badge>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Images</span>
                <Badge variant={uploadCounts.images >= 2 ? 'destructive' : 'secondary'}>
                  {uploadCounts.images}/2
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Token Usage Card */}
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                Daily Usage
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-xs text-muted-foreground flex justify-between'>
                <span>Tokens used</span>
                <span>{dailyTokensUsed.toLocaleString()} / {DAILY_TOKEN_LIMIT.toLocaleString()}</span>
              </div>
              <div className='w-full bg-muted rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all ${
                    tokenUsagePercent >= 90 ? 'bg-destructive' : tokenUsagePercent >= 70 ? 'bg-yellow-500' : 'bg-primary'
                  }`}
                  style={{ width: `${tokenUsagePercent}%` }}
                />
              </div>
              {tokenLimitReached && cooldownEndTime && (
                <p className='text-xs text-destructive flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
                  Resets in {getCooldownRemaining()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
