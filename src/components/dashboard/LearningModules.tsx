import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Clock, Play, CheckCircle, Video, FileText, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { learningModulesService, ModuleWithProgress, ModuleCategory } from '@/services/learningModulesService';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function LearningModules() {
  const { user } = useAuth();
  const [modules, setModules] = useState<ModuleWithProgress[]>([]);
  const [filteredModules, setFilteredModules] = useState<ModuleWithProgress[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<ModuleWithProgress | null>(null);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const { toast } = useToast();

  const categories: ModuleCategory[] = [
    'ICT Skills',
    'Business & Entrepreneurship',
    'Career Development',
    'Soft Skills',
    'Academic Support',
    'Technical Skills',
    'Life Skills'
  ];

  useEffect(() => {
    loadModules();
  }, [user]);

  useEffect(() => {
    filterModules();
  }, [modules, searchTerm, selectedCategory]);

  const loadModules = async () => {
    try {
      setLoading(true);
      if (user) {
        const data = await learningModulesService.getModulesWithProgress(user.id);
        setModules(data);
      } else {
        const data = await learningModulesService.getPublishedModules();
        setModules(data.map(m => ({ ...m, user_progress: undefined })));
      }
    } catch (error) {
      console.error('Error loading modules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load learning modules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterModules = () => {
    let filtered = modules.filter(
      (module) =>
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((module) => module.category === selectedCategory);
    }

    setFilteredModules(filtered);
  };

  const handleModuleClick = async (module: ModuleWithProgress) => {
    setSelectedModule(module);
    setShowModuleDialog(true);

    // Increment view count
    try {
      await learningModulesService.incrementViews(module.id);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const startModule = async (moduleId: string) => {
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
      loadModules(); // Refresh to show updated progress
      setShowModuleDialog(false);
    } catch (error) {
      console.error('Error starting module:', error);
      toast({
        title: 'Error',
        description: 'Failed to start module',
        variant: 'destructive',
      });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (progress?: any) => {
    if (!progress) return <Play className="h-4 w-4" />;
    if (progress.status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'pdf':
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'external_link':
        return <LinkIcon className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const renderModuleContent = () => {
    if (!selectedModule) return null;

    return (
      <div className="space-y-6">
        {/* Video Content */}
        {selectedModule.content_type === 'video' && selectedModule.video_url && (
          <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
            {selectedModule.video_url.includes('youtube.com') || selectedModule.video_url.includes('youtu.be') ? (
              <iframe
                className="w-full h-full"
                src={selectedModule.video_url.replace('watch?v=', 'embed/')}
                title={selectedModule.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video className="w-full h-full" controls>
                <source src={selectedModule.video_url} />
              </video>
            )}
          </div>
        )}

        {/* PDF/External Link */}
        {selectedModule.content_type === 'pdf' && selectedModule.pdf_url && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">PDF Document</p>
                <p className="text-sm text-muted-foreground">Click to view the learning material</p>
              </div>
            </div>
            <Button onClick={() => window.open(selectedModule.pdf_url, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open PDF
            </Button>
          </div>
        )}

        {selectedModule.content_type === 'external_link' && selectedModule.external_link && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LinkIcon className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium">External Resource</p>
                <p className="text-sm text-muted-foreground">Click to visit the external learning resource</p>
              </div>
            </div>
            <Button onClick={() => window.open(selectedModule.external_link, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Link
            </Button>
          </div>
        )}

        {/* Article Content */}
        {selectedModule.content && (
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-3">Content</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {selectedModule.content}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        {selectedModule.learning_objectives && selectedModule.learning_objectives.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">What you'll learn</h3>
            <ul className="space-y-2">
              {selectedModule.learning_objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prerequisites */}
        {selectedModule.prerequisites && selectedModule.prerequisites.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
            <ul className="space-y-2">
              {selectedModule.prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-start gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{prerequisite}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress */}
        {selectedModule.user_progress && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Your Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{selectedModule.user_progress.progress_percentage}%</span>
              </div>
              <Progress value={selectedModule.user_progress.progress_percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Status: {selectedModule.user_progress.status.replace('_', ' ')}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-3">
          <Button onClick={() => startModule(selectedModule.id)} className="flex-1" size="lg">
            {selectedModule.user_progress?.status === 'completed'
              ? 'Review Module'
              : selectedModule.user_progress?.status === 'in_progress'
              ? 'Continue Learning'
              : 'Start Module'}
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Learning Modules - Online Courses
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Explore our curated learning modules to develop new skills and advance your career
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <Card
            key={module.id}
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleModuleClick(module)}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getContentTypeIcon(module.content_type)}
                  <CardTitle className="text-lg line-clamp-2">{module.title}</CardTitle>
                </div>
                {getStatusIcon(module.user_progress)}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className={getDifficultyColor(module.difficulty_level)}>
                  {module.difficulty_level.charAt(0).toUpperCase() + module.difficulty_level.slice(1)}
                </Badge>
                <Badge variant="outline">{module.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{module.description}</p>

              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4 mr-1" />
                {module.duration_minutes} minutes
              </div>

              {module.user_progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{module.user_progress.progress_percentage}%</span>
                  </div>
                  <Progress value={module.user_progress.progress_percentage} className="h-2" />
                </div>
              )}

              <Button onClick={(e) => {
                e.stopPropagation();
                startModule(module.id);
              }} className="w-full" disabled={!user}>
                {module.user_progress?.status === 'completed'
                  ? 'Review'
                  : module.user_progress?.status === 'in_progress'
                  ? 'Continue'
                  : 'Start Module'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No modules found</h3>
            <p className="text-muted-foreground">
              {modules.length === 0
                ? 'No learning modules available yet. Check back soon!'
                : 'Try adjusting your search or filters'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Module Details Dialog */}
      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              {selectedModule && getContentTypeIcon(selectedModule.content_type)}
              {selectedModule?.title}
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getDifficultyColor(selectedModule?.difficulty_level || 'beginner')}>
                  {selectedModule?.difficulty_level.charAt(0).toUpperCase() +
                    selectedModule?.difficulty_level.slice(1)}
                </Badge>
                <Badge variant="outline">{selectedModule?.category}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedModule?.duration_minutes} minutes
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          {renderModuleContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
