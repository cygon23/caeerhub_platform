import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Clock, Award, Play, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: number;
  estimated_duration: number;
  is_published: boolean;
  tags: string[];
  progress?: {
    progress_percentage: number;
    status: string;
    time_spent: number;
  };
}

export default function LearningModules() {
  const { user } = useAuth();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [filteredModules, setFilteredModules] = useState<LearningModule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['Technology', 'Business', 'Communication', 'Leadership', 'Finance'];
  const difficultyLabels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    filterModules();
  }, [modules, searchTerm, selectedCategory]);

  const loadModules = async () => {
    try {
      const { data: modulesData, error: modulesError } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (modulesError) throw modulesError;

      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_module_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError) throw progressError;

        const modulesWithProgress = modulesData.map(module => ({
          ...module,
          progress: progressData.find(p => p.module_id === module.id)
        }));

        setModules(modulesWithProgress);
      } else {
        setModules(modulesData);
      }
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterModules = () => {
    let filtered = modules.filter(module =>
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(module => module.category === selectedCategory);
    }

    setFilteredModules(filtered);
  };

  const startModule = async (moduleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_module_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          status: 'in_progress',
          started_at: new Date().toISOString(),
          last_accessed: new Date().toISOString()
        });

      if (error) throw error;
      loadModules(); // Refresh to show updated progress
    } catch (error) {
      console.error('Error starting module:', error);
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (progress?: any) => {
    if (!progress) return <Play className="h-4 w-4" />;
    if (progress.status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
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
            Learning Modules
          </CardTitle>
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
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                All
              </Button>
              {categories.map(category => (
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
          <Card key={module.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{module.title}</CardTitle>
                {getStatusIcon(module.progress)}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={getDifficultyColor(module.difficulty_level)}>
                  {difficultyLabels[module.difficulty_level - 1]}
                </Badge>
                <Badge variant="outline">{module.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {module.description}
              </p>
              
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4 mr-1" />
                {module.estimated_duration} minutes
              </div>

              {module.progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{module.progress.progress_percentage}%</span>
                  </div>
                  <Progress value={module.progress.progress_percentage} className="h-2" />
                </div>
              )}

              {module.tags && module.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {module.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {module.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{module.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <Button
                onClick={() => startModule(module.id)}
                className="w-full"
                disabled={!user}
              >
                {module.progress?.status === 'completed' ? 'Review' :
                 module.progress?.status === 'in_progress' ? 'Continue' : 'Start Module'}
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
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}