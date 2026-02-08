import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Sparkles, BookOpen, Send, Loader2, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { learningModulesService, LearningModule, ModuleCategory } from '@/services/learningModulesService';
import { useToast } from '@/hooks/use-toast';

export default function SelfLearningHub() {
  const { user } = useAuth();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [recommendations, setRecommendations] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const { toast } = useToast();

  const availableTopics: ModuleCategory[] = [
    'ICT Skills',
    'Business & Entrepreneurship',
    'Career Development',
    'Soft Skills',
    'Academic Support',
    'Technical Skills',
    'Life Skills',
  ];

  useEffect(() => {
    if (selectedTopics.length > 0) {
      loadRecommendations();
    }
  }, [selectedTopics]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      // Get modules matching selected topics
      const allModules = await learningModulesService.getPublishedModules();
      const filtered = allModules.filter((module) =>
        selectedTopics.some((topic) => module.category.includes(topic))
      );
      setRecommendations(filtered);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !user) return;

    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    // AI Response (placeholder - you can integrate with actual AI API)
    const aiResponse = generateAIResponse(userMessage, selectedTopics, recommendations);

    newHistory.push({ role: 'assistant', content: aiResponse });

    setConversationHistory(newHistory);
    setUserMessage('');

    // Save to preferences
    try {
      await learningModulesService.addToConversationHistory({
        timestamp: new Date().toISOString(),
        user: userMessage,
        assistant: aiResponse,
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const generateAIResponse = (message: string, topics: string[], modules: LearningModule[]): string => {
    const lowerMessage = message.toLowerCase();

    // Simple AI logic - you can replace with actual AI API
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      if (modules.length > 0) {
        const topModules = modules.slice(0, 3);
        return `Based on your interests in ${topics.join(', ')}, I recommend starting with these modules:\n\n${topModules
          .map((m, i) => `${i + 1}. ${m.title} (${m.difficulty_level}) - ${m.duration_minutes} minutes`)
          .join('\n')}\n\nThese modules will help you build a strong foundation. Would you like to know more about any of these?`;
      }
      return `I'd love to help! Please select topics you're interested in from the options above, and I'll recommend personalized learning modules for you.`;
    }

    if (lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
      const beginnerModules = modules.filter((m) => m.difficulty_level === 'beginner');
      if (beginnerModules.length > 0) {
        return `Great! For beginners, I suggest starting with "${beginnerModules[0].title}". It's designed to give you a solid foundation in ${beginnerModules[0].category}. The module takes about ${beginnerModules[0].duration_minutes} minutes to complete.`;
      }
    }

    if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
      return `To advance your career, I recommend focusing on both technical skills and soft skills. From your selected topics, modules in ${topics[0] || 'Career Development'} would be particularly valuable. Would you like a personalized learning roadmap?`;
    }

    // Default response
    return `That's a great question! I'm here to help you learn and grow. Based on your interests in ${
      topics.length > 0 ? topics.join(', ') : 'various topics'
    }, I can recommend specific modules, create learning roadmaps, or answer questions about skills you want to develop. How can I help you today?`;
  };

  const handleStartModule = async (moduleId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to start learning modules',
        variant: 'destructive',
      });
      return;
    }

    try {
      await learningModulesService.enrollInModule(moduleId);
      toast({
        title: 'Success',
        description: 'Module started! Good luck with your learning.',
      });
    } catch (error) {
      console.error('Error starting module:', error);
      toast({
        title: 'Error',
        description: 'Failed to start module',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] space-y-6">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span>AI-Powered Self-Learning Hub</span>
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Get personalized learning recommendations based on your goals and interests. Our AI analyzes your
              preferences to suggest the perfect learning path for you.
            </p>
          </CardHeader>
        </Card>

        {/* Topic Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Select Your Learning Interests
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose topics you want to improve or learn. Our AI will personalize recommendations for you.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableTopics.map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopics.includes(topic) ? 'default' : 'outline'}
                  onClick={() => toggleTopic(topic)}
                  className="transition-all"
                >
                  {topic}
                  {selectedTopics.includes(topic) && (
                    <Sparkles className="h-3 w-3 ml-2" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Chat Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Chat with AI Learning Assistant
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ask me anything about your learning journey, and I'll provide personalized guidance!
            </p>
          </CardHeader>
          <CardContent>
            {/* Conversation History */}
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {conversationHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-3 text-purple-400" />
                  <p>Start a conversation! Ask me about learning recommendations, career advice, or skill development.</p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline">What should I learn first?</Badge>
                    <Badge variant="outline">Recommend beginner modules</Badge>
                    <Badge variant="outline">Help me advance my career</Badge>
                  </div>
                </div>
              )}

              {conversationHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.role === 'assistant' && (
                        <Brain className="h-5 w-5 flex-shrink-0 mt-0.5 text-purple-600" />
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask me anything about your learning journey..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={2}
                className="resize-none"
              />
              <Button onClick={handleSendMessage} disabled={!userMessage.trim() || loading || !user}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrollable Recommendations Area */}
      {selectedTopics.length > 0 && (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50 pr-2">
          <Card className="h-full">
            <CardHeader className="sticky top-0 bg-background z-10 border-b">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Personalized Recommendations
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on your selected interests: {selectedTopics.join(', ')}
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                  {recommendations.map((module) => (
                    <Card key={module.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{module.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {module.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{module.category}</Badge>
                          <Badge
                            className={
                              module.difficulty_level === 'beginner'
                                ? 'bg-green-100 text-green-800'
                                : module.difficulty_level === 'intermediate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {module.difficulty_level.charAt(0).toUpperCase() +
                              module.difficulty_level.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {module.duration_minutes} minutes
                          </span>
                          <Button size="sm" onClick={() => handleStartModule(module.id)}>
                            Start Learning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3" />
                  <p>No modules found for your selected topics. Try selecting different interests!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
