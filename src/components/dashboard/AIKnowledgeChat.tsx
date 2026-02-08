import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Laptop,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Code,
  Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  aiKnowledgeChatService,
  ChatSession,
  ChatMessage,
} from '@/services/aiKnowledgeChatService';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSessions();
    loadUploadCounts();
  }, []);

  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

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

      // Update session if new
      if (!currentSession && response.sessionId) {
        await loadSessions();
        const newSession = sessions.find(s => s.id === response.sessionId);
        if (newSession) {
          setCurrentSession(newSession);
        }
      }

      // Reload messages to get accurate data
      if (response.sessionId) {
        await loadMessages(response.sessionId);
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
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
  };

  const handleNewChat = () => {
    setCurrentSession(null);
    setMessages([]);
    setSelectedCategory(null);
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

  return (
    <div className='h-full flex gap-4'>
      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col h-full'>
        {/* Header */}
        <Card className='border-b rounded-b-none'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20'>
                  <Sparkles className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <CardTitle className='text-xl'>AI Knowledge Chat</CardTitle>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Your personal career & education assistant
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowHistory(!showHistory)}>
                  <History className='h-4 w-4 mr-2' />
                  History
                </Button>
                <Button size='sm' onClick={handleNewChat}>
                  <Plus className='h-4 w-4 mr-2' />
                  New Chat
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

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
                      <div className='prose prose-sm dark:prose-invert max-w-none'>
                        {message.content}
                      </div>
                      {message.role === 'assistant' && (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity'
                          onClick={() => handleCopyMessage(message.content, message.id)}>
                          {copiedMessageId === message.id ? (
                            <Check className='h-3 w-3' />
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

        {/* Input Area */}
        <Card className='border-t rounded-t-none'>
          <CardContent className='p-4'>
            <div className='flex gap-2'>
              <input
                type='file'
                ref={fileInputRef}
                onChange={onFileSelect}
                className='hidden'
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <Plus className='h-4 w-4' />
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
              <Button variant='outline' size='icon' title='Voice chat (Coming soon)'>
                <Mic className='h-4 w-4' />
              </Button>
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder='Ask me anything about your career or education...'
                className='flex-1 min-h-[60px] max-h-[200px] resize-none'
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size='icon'
                className='h-[60px]'>
                <Send className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interest Categories Sidebar */}
      <div className='w-80 space-y-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Learning Interests</CardTitle>
            <p className='text-xs text-muted-foreground'>
              Choose topics to get tailored prompts
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
                      <span className='text-left flex-1'>{category.name}</span>
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
          <CardHeader>
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
      </div>

      {/* History Sidebar (overlay on mobile) */}
      {showHistory && (
        <Card className='w-80 absolute right-4 top-20 bottom-4 z-10 md:relative md:right-0 md:top-0 md:bottom-0'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-base'>Chat History</CardTitle>
            <Button variant='ghost' size='sm' onClick={() => setShowHistory(false)}>
              ✕
            </Button>
          </CardHeader>
          <CardContent className='p-0'>
            <ScrollArea className='h-[calc(100vh-200px)]'>
              <div className='p-4 space-y-2'>
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                      currentSession?.id === session.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setCurrentSession(session)}>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-sm truncate'>{session.title}</p>
                        <p className='text-xs text-muted-foreground'>
                          {session.message_count} messages
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100'>
                            <MoreVertical className='h-3 w-3' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              const newTitle = prompt('Enter new title:', session.title);
                              if (newTitle) handleRenameSession(session.id, newTitle);
                            }}>
                            <Edit className='h-4 w-4 mr-2' />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this chat?')) {
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
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
