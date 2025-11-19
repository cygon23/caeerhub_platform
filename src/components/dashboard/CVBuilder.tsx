import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  FileText, Plus, Trash2, Download, Eye, Star, Zap, Award,
  CheckCircle, Sparkles, Target, TrendingUp, AlertCircle,
  Lightbulb, Copy, Check, ArrowRight, BarChart3, ChevronRight,
  Briefcase, GraduationCap, Code, MessageSquare, Trophy,
  Bot, Wand2, RefreshCw, FileCheck, Rocket, CalendarIcon, Lock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CVPreview from './CVPreview';

interface CVData {
  id?: string;
  title: string;
  personal_info: {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
}

interface CVAnalysis {
  overall_score: number;
  ats_score: number;
  content_quality: number;
  keyword_optimization: number;
  structure_score: number;
  strengths: Array<{
    category: string;
    description: string;
    impact: string;
  }>;
  improvements: Array<{
    category: string;
    issue: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
    example?: string;
  }>;
  keyword_suggestions: Array<{
    keyword: string;
    relevance: string;
    where_to_add: string;
  }>;
  ats_compatibility: {
    formatting_issues: string[];
    missing_sections: string[];
    keyword_density: string;
    recommendations: string[];
  };
  experience_analysis: Array<{
    position: string;
    company: string;
    strengths: string[];
    improvements: string[];
    rewritten_bullets: string[];
  }>;
  skills_analysis: {
    strong_areas: string[];
    gaps: string[];
    suggestions: string[];
  };
  summary: string;
}

export default function CVBuilder() {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<any[]>([]);
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const [activeSection, setActiveSection] = useState('personal');
  const [aiAnalysis, setAiAnalysis] = useState<CVAnalysis | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const [showPreview, setShowPreview] = useState(false);

  const defaultCV: CVData = {
    title: 'My Professional CV',
    personal_info: {
      full_name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: []
    },
    achievements: []
  };

  useEffect(() => {
    loadCVs();
  }, [user]);

  const loadCVs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCvs(data || []);

      if (data && data.length > 0) {
        setCurrentCV({
          id: data[0].id,
          title: data[0].title,
          personal_info: (data[0].personal_info as any) || defaultCV.personal_info,
          experience: (data[0].experience as any) || [],
          education: (data[0].education as any) || [],
          skills: (data[0].skills as any) || { technical: [], soft: [] },
          achievements: (data[0].achievements as any) || []
        });
      } else {
        setCurrentCV(defaultCV);
      }
    } catch (error) {
      console.error('Error loading CVs:', error);
    }
  };

  const saveCV = async () => {
    if (!user || !currentCV) return;

    setLoading(true);
    try {
      const cvData = {
        user_id: user.id,
        title: currentCV.title,
        personal_info: currentCV.personal_info,
        experience: currentCV.experience,
        education: currentCV.education,
        skills: currentCV.skills,
        achievements: currentCV.achievements
      };

      if (currentCV.id) {
        const { error } = await supabase
          .from('user_cvs')
          .update(cvData)
          .eq('id', currentCV.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('user_cvs')
          .insert(cvData)
          .select()
          .single();
        if (error) throw error;
        setCurrentCV(prev => prev ? { ...prev, id: data.id } : null);
      }

      toast.success('✅ CV saved successfully!');
      loadCVs();
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error('Failed to save CV');
    } finally {
      setLoading(false);
    }
  };

  const analyzeCV = async () => {
    if (!currentCV) return;

    // Save CV first
    await saveCV();

    setAnalyzing(true);
    setActiveTab('analysis');

    try {
      const { data, error } = await supabase.functions.invoke('analyze-cv', {
        body: {
          cv_id: currentCV.id,
          cv_data: {
            personal_info: currentCV.personal_info,
            experience: currentCV.experience,
            education: currentCV.education,
            skills: currentCV.skills,
            achievements: currentCV.achievements
          },
          target_role: targetRole || undefined,
          target_industry: targetIndustry || undefined
        }
      });

      if (error) throw error;

      if (data.success) {
        setAiAnalysis(data.data.analysis);
        toast.success(`🎉 Analysis complete! Overall score: ${data.data.analysis.overall_score}%`);
      } else {
        throw new Error(data.error?.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing CV:', error);
      toast.error('Failed to analyze CV. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const createNewCV = () => {
    setCurrentCV({ ...defaultCV, title: `CV ${cvs.length + 1}` });
    setAiAnalysis(null);
    setActiveTab('builder');
  };

  const optimizeWithAI = async () => {
    if (!currentCV || !aiAnalysis) {
      toast.error('Please run AI analysis first');
      return;
    }

    setOptimizing(true);
    try {
      const optimizedCV = { ...currentCV };

      // Apply keyword suggestions to summary
      if (aiAnalysis.keyword_suggestions.length > 0 && optimizedCV.personal_info.summary) {
        const keywords = aiAnalysis.keyword_suggestions.slice(0, 3).map(k => k.keyword).join(', ');
        if (!optimizedCV.personal_info.summary.toLowerCase().includes(keywords.toLowerCase())) {
          optimizedCV.personal_info.summary += ` Skilled in ${keywords}.`;
        }
      }

      // Add suggested skills
      if (aiAnalysis.skills_analysis.suggestions.length > 0) {
        aiAnalysis.skills_analysis.suggestions.forEach(skill => {
          if (!optimizedCV.skills.technical.includes(skill) && !optimizedCV.skills.soft.includes(skill)) {
            // Determine if technical or soft skill
            const technicalKeywords = ['programming', 'software', 'data', 'cloud', 'development', 'technical'];
            const isTechnical = technicalKeywords.some(kw => skill.toLowerCase().includes(kw));

            if (isTechnical && optimizedCV.skills.technical.length < 15) {
              optimizedCV.skills.technical.push(skill);
            } else if (!isTechnical && optimizedCV.skills.soft.length < 10) {
              optimizedCV.skills.soft.push(skill);
            }
          }
        });
      }

      // Apply experience improvements
      if (aiAnalysis.experience_analysis.length > 0) {
        aiAnalysis.experience_analysis.forEach((expAnalysis, index) => {
          if (optimizedCV.experience[index] && expAnalysis.rewritten_bullets.length > 0) {
            // Append improved bullets to description
            const currentDesc = optimizedCV.experience[index].description;
            const newBullets = expAnalysis.rewritten_bullets.slice(0, 2).join('\n');
            if (currentDesc && !currentDesc.includes(newBullets)) {
              optimizedCV.experience[index].description = currentDesc + '\n' + newBullets;
            }
          }
        });
      }

      setCurrentCV(optimizedCV);
      await saveCV();

      toast.success('🎉 CV optimized with AI suggestions!');

      // Re-analyze to show new scores
      setTimeout(() => {
        analyzeCV();
      }, 1000);
    } catch (error) {
      console.error('Error optimizing CV:', error);
      toast.error('Failed to optimize CV');
    } finally {
      setOptimizing(false);
    }
  };

  const handleDownload = () => {
    toast.error(
      '🔒 Export to PDF is available for Pro users',
      {
        description: 'Upgrade to Pro to download your CV as a professional PDF',
        duration: 5000,
      }
    );
  };

  const addExperience = () => {
    if (!currentCV) return;
    setCurrentCV({
      ...currentCV,
      experience: [...currentCV.experience, {
        company: '',
        position: '',
        start_date: '',
        end_date: '',
        description: '',
        current: false
      }]
    });
  };

  const removeExperience = (index: number) => {
    if (!currentCV) return;
    setCurrentCV({
      ...currentCV,
      experience: currentCV.experience.filter((_, i) => i !== index)
    });
  };

  const addEducation = () => {
    if (!currentCV) return;
    setCurrentCV({
      ...currentCV,
      education: [...currentCV.education, {
        institution: '',
        degree: '',
        field: '',
        start_date: '',
        end_date: '',
        gpa: ''
      }]
    });
  };

  const removeEducation = (index: number) => {
    if (!currentCV) return;
    setCurrentCV({
      ...currentCV,
      education: currentCV.education.filter((_, i) => i !== index)
    });
  };

  const addSkill = (type: 'technical' | 'soft', skill: string) => {
    if (!currentCV || !skill.trim()) return;
    setCurrentCV({
      ...currentCV,
      skills: {
        ...currentCV.skills,
        [type]: [...currentCV.skills[type], skill.trim()]
      }
    });
  };

  const removeSkill = (type: 'technical' | 'soft', index: number) => {
    if (!currentCV) return;
    setCurrentCV({
      ...currentCV,
      skills: {
        ...currentCV.skills,
        [type]: currentCV.skills[type].filter((_, i) => i !== index)
      }
    });
  };

  const addAchievement = () => {
    if (!currentCV) return;
    setCurrentCV({
      ...currentCV,
      achievements: [...currentCV.achievements, {
        title: '',
        description: '',
        date: ''
      }]
    });
  };

  const removeAchievement = (index: number) => {
    if (!currentCV) return;
    setCurrentCV({
      ...currentCV,
      achievements: currentCV.achievements.filter((_, i) => i !== index)
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({...copiedStates, [id]: true});
    setTimeout(() => {
      setCopiedStates({...copiedStates, [id]: false});
    }, 2000);
    toast.success('Copied to clipboard!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'destructive';
    if (priority === 'medium') return 'default';
    return 'secondary';
  };

  if (!currentCV) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Start Your Career Journey</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Build a professional, ATS-optimized CV with AI-powered suggestions that help you stand out
            </p>
            <Button onClick={createNewCV} size="lg" className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First CV
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Actions */}
      <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <Input
                  value={currentCV.title}
                  onChange={(e) => setCurrentCV({ ...currentCV, title: e.target.value })}
                  placeholder="CV Title"
                  className="text-lg font-semibold border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {currentCV.experience.length} experiences • {currentCV.education.length} education • {currentCV.skills.technical.length + currentCV.skills.soft.length} skills
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={createNewCV} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New CV
              </Button>
              <Button onClick={saveCV} disabled={loading} variant="outline" size="sm">
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <FileCheck className="h-4 w-4 mr-2" />}
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={optimizeWithAI}
                disabled={!aiAnalysis || optimizing}
                variant="outline"
                size="sm"
                className="border-secondary text-secondary hover:bg-secondary/10"
              >
                {optimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Optimize AI
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={analyzeCV}
                disabled={analyzing}
                className="bg-gradient-to-r from-primary to-secondary"
                size="sm"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    AI Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-auto p-1">
          <TabsTrigger value="builder" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            CV Builder
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            AI Analysis {aiAnalysis && `(${aiAnalysis.overall_score}%)`}
          </TabsTrigger>
        </TabsList>

        {/* CV Builder Tab */}
        <TabsContent value="builder" className="space-y-6">
          {/* Target Role & Industry */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Target Position (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Target Role</label>
                <Input
                  placeholder="e.g., Software Developer, Marketing Manager"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Target Industry</label>
                <Input
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 overflow-x-auto">
                {[
                  { id: 'personal', label: 'Personal Info', icon: FileText },
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                  { id: 'education', label: 'Education', icon: GraduationCap },
                  { id: 'skills', label: 'Skills', icon: Code },
                  { id: 'achievements', label: 'Achievements', icon: Trophy }
                ].map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? 'default' : 'outline'}
                    onClick={() => setActiveSection(section.id)}
                    className="flex-shrink-0"
                  >
                    <section.icon className="h-4 w-4 mr-2" />
                    {section.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personal Info Section */}
          {activeSection === 'personal' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={currentCV.personal_info.full_name}
                      onChange={(e) => setCurrentCV({
                        ...currentCV,
                        personal_info: { ...currentCV.personal_info, full_name: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email *</label>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      value={currentCV.personal_info.email}
                      onChange={(e) => setCurrentCV({
                        ...currentCV,
                        personal_info: { ...currentCV.personal_info, email: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone *</label>
                    <Input
                      placeholder="+255 123 456 789"
                      value={currentCV.personal_info.phone}
                      onChange={(e) => setCurrentCV({
                        ...currentCV,
                        personal_info: { ...currentCV.personal_info, phone: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location *</label>
                    <Input
                      placeholder="Dar es Salaam, Tanzania"
                      value={currentCV.personal_info.location}
                      onChange={(e) => setCurrentCV({
                        ...currentCV,
                        personal_info: { ...currentCV.personal_info, location: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Professional Summary *</label>
                  <Textarea
                    placeholder="Write a compelling 2-3 sentence summary highlighting your key strengths and career objectives..."
                    value={currentCV.personal_info.summary}
                    onChange={(e) => setCurrentCV({
                      ...currentCV,
                      personal_info: { ...currentCV.personal_info, summary: e.target.value }
                    })}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Tip: Focus on your unique value proposition and what makes you stand out
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    Work Experience
                  </CardTitle>
                  <Button onClick={addExperience} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCV.experience.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p>No experience added yet</p>
                    <p className="text-sm">Click "Add Experience" to get started</p>
                  </div>
                ) : (
                  currentCV.experience.map((exp, index) => (
                    <Card key={index} className="border-border">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-primary">Experience {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Company</label>
                            <Input
                              placeholder="Company Name"
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...currentCV.experience];
                                newExp[index] = { ...newExp[index], company: e.target.value };
                                setCurrentCV({ ...currentCV, experience: newExp });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Position</label>
                            <Input
                              placeholder="Job Title"
                              value={exp.position}
                              onChange={(e) => {
                                const newExp = [...currentCV.experience];
                                newExp[index] = { ...newExp[index], position: e.target.value };
                                setCurrentCV({ ...currentCV, experience: newExp });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Start Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !exp.start_date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {exp.start_date ? format(new Date(exp.start_date), "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={exp.start_date ? new Date(exp.start_date) : undefined}
                                  onSelect={(date) => {
                                    const newExp = [...currentCV.experience];
                                    newExp[index] = { ...newExp[index], start_date: date ? date.toISOString().split('T')[0] : '' };
                                    setCurrentCV({ ...currentCV, experience: newExp });
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">End Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !exp.end_date && "text-muted-foreground"
                                  )}
                                  disabled={exp.current}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {exp.end_date ? format(new Date(exp.end_date), "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={exp.end_date ? new Date(exp.end_date) : undefined}
                                  onSelect={(date) => {
                                    const newExp = [...currentCV.experience];
                                    newExp[index] = { ...newExp[index], end_date: date ? date.toISOString().split('T')[0] : '' };
                                    setCurrentCV({ ...currentCV, experience: newExp });
                                  }}
                                  initialFocus
                                  disabled={exp.current}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Job Description</label>
                          <Textarea
                            placeholder="• Achieved X by doing Y, resulting in Z&#10;• Led team of N people to accomplish...&#10;• Improved process by X% through..."
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...currentCV.experience];
                              newExp[index] = { ...newExp[index], description: e.target.value };
                              setCurrentCV({ ...currentCV, experience: newExp });
                            }}
                            rows={4}
                            className="resize-none"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            💡 Tip: Use action verbs and quantify achievements (numbers, percentages, results)
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                    Education
                  </CardTitle>
                  <Button onClick={addEducation} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCV.education.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <GraduationCap className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p>No education added yet</p>
                    <p className="text-sm">Click "Add Education" to get started</p>
                  </div>
                ) : (
                  currentCV.education.map((edu, index) => (
                    <Card key={index} className="border-border">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-primary">Education {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Institution</label>
                            <Input
                              placeholder="University Name"
                              value={edu.institution}
                              onChange={(e) => {
                                const newEdu = [...currentCV.education];
                                newEdu[index] = { ...newEdu[index], institution: e.target.value };
                                setCurrentCV({ ...currentCV, education: newEdu });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Degree</label>
                            <Input
                              placeholder="Bachelor's, Master's, etc."
                              value={edu.degree}
                              onChange={(e) => {
                                const newEdu = [...currentCV.education];
                                newEdu[index] = { ...newEdu[index], degree: e.target.value };
                                setCurrentCV({ ...currentCV, education: newEdu });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Field of Study</label>
                            <Input
                              placeholder="Computer Science, Business, etc."
                              value={edu.field}
                              onChange={(e) => {
                                const newEdu = [...currentCV.education];
                                newEdu[index] = { ...newEdu[index], field: e.target.value };
                                setCurrentCV({ ...currentCV, education: newEdu });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">GPA (Optional)</label>
                            <Input
                              placeholder="3.8/4.0"
                              value={edu.gpa}
                              onChange={(e) => {
                                const newEdu = [...currentCV.education];
                                newEdu[index] = { ...newEdu[index], gpa: e.target.value };
                                setCurrentCV({ ...currentCV, education: newEdu });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Start Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !edu.start_date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {edu.start_date ? format(new Date(edu.start_date), "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={edu.start_date ? new Date(edu.start_date) : undefined}
                                  onSelect={(date) => {
                                    const newEdu = [...currentCV.education];
                                    newEdu[index] = { ...newEdu[index], start_date: date ? date.toISOString().split('T')[0] : '' };
                                    setCurrentCV({ ...currentCV, education: newEdu });
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">End Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !edu.end_date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {edu.end_date ? format(new Date(edu.end_date), "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={edu.end_date ? new Date(edu.end_date) : undefined}
                                  onSelect={(date) => {
                                    const newEdu = [...currentCV.education];
                                    newEdu[index] = { ...newEdu[index], end_date: date ? date.toISOString().split('T')[0] : '' };
                                    setCurrentCV({ ...currentCV, education: newEdu });
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2 text-primary" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Technical Skills */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Technical Skills</h4>
                    <Badge variant="secondary">{currentCV.skills.technical.length} skills</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentCV.skills.technical.map((skill, index) => (
                      <Badge key={index} variant="default" className="flex items-center gap-2 px-3 py-1">
                        {skill}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => removeSkill('technical', index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add technical skill (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill('technical', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-primary font-medium mb-2">💡 Popular technical skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'Java'].map((skill) => (
                        <Button
                          key={skill}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 border-primary/20"
                          onClick={() => addSkill('technical', skill)}
                        >
                          + {skill}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Soft Skills</h4>
                    <Badge variant="secondary">{currentCV.skills.soft.length} skills</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentCV.skills.soft.map((skill, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-2 px-3 py-1">
                        {skill}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => removeSkill('soft', index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add soft skill (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill('soft', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                    <p className="text-sm text-secondary font-medium mb-2">💡 Essential soft skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity'].map((skill) => (
                        <Button
                          key={skill}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 border-secondary/20"
                          onClick={() => addSkill('soft', skill)}
                        >
                          + {skill}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements Section */}
          {activeSection === 'achievements' && (
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-primary" />
                    Achievements & Awards
                  </CardTitle>
                  <Button onClick={addAchievement} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Achievement
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCV.achievements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p>No achievements added yet</p>
                    <p className="text-sm">Click "Add Achievement" to get started</p>
                  </div>
                ) : (
                  currentCV.achievements.map((achievement, index) => (
                    <Card key={index} className="border-border">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-primary">Achievement {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAchievement(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Achievement Title</label>
                            <Input
                              placeholder="Award, Certification, Recognition"
                              value={achievement.title}
                              onChange={(e) => {
                                const newAchievements = [...currentCV.achievements];
                                newAchievements[index] = { ...newAchievements[index], title: e.target.value };
                                setCurrentCV({ ...currentCV, achievements: newAchievements });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Date</label>
                            <Input
                              placeholder="Date"
                              type="date"
                              value={achievement.date}
                              onChange={(e) => {
                                const newAchievements = [...currentCV.achievements];
                                newAchievements[index] = { ...newAchievements[index], date: e.target.value };
                                setCurrentCV({ ...currentCV, achievements: newAchievements });
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Description</label>
                          <Textarea
                            placeholder="Describe what you achieved and its impact..."
                            value={achievement.description}
                            onChange={(e) => {
                              const newAchievements = [...currentCV.achievements];
                              newAchievements[index] = { ...newAchievements[index], description: e.target.value };
                              setCurrentCV({ ...currentCV, achievements: newAchievements });
                            }}
                            rows={3}
                            className="resize-none"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {!aiAnalysis ? (
            <Card className="border-2 border-dashed border-primary/20">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Ready for AI Analysis?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Get instant feedback on your CV with AI-powered analysis. We'll check ATS compatibility, content quality, and provide actionable improvements.
                </p>
                <Button
                  onClick={analyzeCV}
                  disabled={analyzing}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing Your CV...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Start AI Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Score Overview */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Overall', score: aiAnalysis.overall_score, icon: Target },
                  { label: 'ATS Score', score: aiAnalysis.ats_score, icon: FileCheck },
                  { label: 'Content', score: aiAnalysis.content_quality, icon: FileText },
                  { label: 'Keywords', score: aiAnalysis.keyword_optimization, icon: Sparkles },
                  { label: 'Structure', score: aiAnalysis.structure_score, icon: BarChart3 }
                ].map((item) => (
                  <Card key={item.label} className={`${getScoreBgColor(item.score)} border-2`}>
                    <CardContent className="p-4 text-center">
                      <item.icon className={`h-6 w-6 mx-auto mb-2 ${getScoreColor(item.score)}`} />
                      <div className={`text-3xl font-bold ${getScoreColor(item.score)}`}>
                        {item.score}%
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <Card className="bg-gradient-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {aiAnalysis.summary}
                  </p>
                </CardContent>
              </Card>

              {/* Strengths */}
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Your Strengths ({aiAnalysis.strengths.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiAnalysis.strengths.map((strength, index) => (
                    <div key={index} className="p-4 bg-white border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="border-green-300 text-green-700">
                          {strength.category}
                        </Badge>
                      </div>
                      <p className="font-medium text-green-900 mb-1">{strength.description}</p>
                      <p className="text-sm text-green-700">{strength.impact}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Improvements */}
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-700">
                    <Wand2 className="h-5 w-5 mr-2" />
                    AI Improvement Suggestions ({aiAnalysis.improvements.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiAnalysis.improvements.map((improvement, index) => (
                    <div key={index} className="p-4 bg-white border border-orange-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={getPriorityColor(improvement.priority)}>
                          {improvement.priority} priority
                        </Badge>
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          {improvement.category}
                        </Badge>
                      </div>
                      <p className="font-medium text-orange-900 mb-1">❗ {improvement.issue}</p>
                      <p className="text-sm text-orange-700 mb-2">✅ {improvement.suggestion}</p>
                      {improvement.example && (
                        <div className="mt-3 p-3 bg-orange-100 border border-orange-200 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold text-orange-800">Example:</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => copyToClipboard(improvement.example!, `improvement-${index}`)}
                            >
                              {copiedStates[`improvement-${index}`] ? (
                                <Check className="h-3 w-3 mr-1" />
                              ) : (
                                <Copy className="h-3 w-3 mr-1" />
                              )}
                              {copiedStates[`improvement-${index}`] ? 'Copied!' : 'Copy'}
                            </Button>
                          </div>
                          <p className="text-sm text-orange-800 font-mono">{improvement.example}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Keyword Suggestions */}
              {aiAnalysis.keyword_suggestions.length > 0 && (
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-700">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Keyword Recommendations ({aiAnalysis.keyword_suggestions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aiAnalysis.keyword_suggestions.map((keyword, index) => (
                      <div key={index} className="p-4 bg-white border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="default" className="bg-blue-600">{keyword.keyword}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-blue-300"
                            onClick={() => copyToClipboard(keyword.keyword, `keyword-${index}`)}
                          >
                            {copiedStates[`keyword-${index}`] ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                            {copiedStates[`keyword-${index}`] ? 'Copied' : 'Copy'}
                          </Button>
                        </div>
                        <p className="text-sm text-blue-700 mb-1">{keyword.relevance}</p>
                        <p className="text-xs text-blue-600">📍 Add to: {keyword.where_to_add}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* ATS Compatibility */}
              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-700">
                    <FileCheck className="h-5 w-5 mr-2" />
                    ATS Compatibility Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">Keyword Density:</h4>
                    <p className="text-sm text-purple-700">{aiAnalysis.ats_compatibility.keyword_density}</p>
                  </div>

                  {aiAnalysis.ats_compatibility.formatting_issues.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">Formatting Issues:</h4>
                      <ul className="space-y-1">
                        {aiAnalysis.ats_compatibility.formatting_issues.map((issue, index) => (
                          <li key={index} className="text-sm text-purple-700 flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAnalysis.ats_compatibility.missing_sections.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">Missing Sections:</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.ats_compatibility.missing_sections.map((section, index) => (
                          <Badge key={index} variant="outline" className="border-purple-300 text-purple-700">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {aiAnalysis.ats_compatibility.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-purple-700 flex items-start">
                          <ChevronRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Re-analyze Button */}
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-6 text-center">
                  <Button
                    onClick={analyzeCV}
                    disabled={analyzing}
                    size="lg"
                    variant="outline"
                    className="border-primary"
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Re-analyzing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Re-analyze CV
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">
                    Made changes? Re-analyze to see your updated scores
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              CV Preview
            </DialogTitle>
            <DialogDescription>
              Preview how your professional CV will look
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <CVPreview cvData={currentCV} />
          </div>
          <div className="p-6 pt-0 flex justify-end gap-2 border-t">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button onClick={handleDownload} className="bg-gradient-to-r from-primary to-secondary">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
