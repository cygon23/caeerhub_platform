import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Trash2, Download, Eye, Star, Zap, Award, CheckCircle, Sparkles, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

export default function CVBuilder() {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<any[]>([]);
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const defaultCV: CVData = {
    title: 'My CV',
    personal_info: {
      full_name: '',
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

      toast.success('CV saved successfully!');
      loadCVs();
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error('Failed to save CV');
    } finally {
      setLoading(false);
    }
  };

  const createNewCV = () => {
    setCurrentCV({ ...defaultCV, title: `CV ${cvs.length + 1}` });
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

  const analyzeCV = async () => {
    if (!currentCV) return;
    
    setLoading(true);
    try {
      // Simulate AI analysis (in real app, call AI service)
      const mockAnalysis = {
        overall_score: Math.floor(Math.random() * 30) + 70, // 70-100
        strengths: [
          'Strong technical skills section',
          'Well-structured experience descriptions',
          'Professional email format'
        ],
        improvements: [
          'Add more quantifiable achievements',
          'Include keywords from target job descriptions',
          'Consider adding a professional summary'
        ],
        ats_score: Math.floor(Math.random() * 20) + 80,
        industry_match: Math.floor(Math.random() * 25) + 75,
        keyword_optimization: Math.floor(Math.random() * 30) + 60
      };
      
      setAiAnalysis(mockAnalysis);
      toast.success('CV analysis completed!');
    } catch (error) {
      console.error('Error analyzing CV:', error);
      toast.error('Failed to analyze CV');
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    { id: 'professional', name: 'Professional', description: 'Clean and corporate design' },
    { id: 'modern', name: 'Modern', description: 'Contemporary layout with accent colors' },
    { id: 'creative', name: 'Creative', description: 'Eye-catching design for creative roles' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant layout' },
    { id: 'executive', name: 'Executive', description: 'Premium design for senior roles' }
  ];

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

  if (!currentCV) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Create Your First CV</h3>
            <p className="text-muted-foreground mb-4">Build a professional CV to showcase your skills and experience</p>
            <Button onClick={createNewCV}>
              <Plus className="h-4 w-4 mr-2" />
              Create New CV
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Smart CV Builder
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={createNewCV}>
                <Plus className="h-4 w-4 mr-2" />
                New CV
              </Button>
              <Button onClick={saveCV} disabled={loading}>
                {loading ? 'Saving...' : 'Save CV'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Input
              value={currentCV.title}
              onChange={(e) => setCurrentCV({ ...currentCV, title: e.target.value })}
              placeholder="CV Title"
              className="max-w-md"
            />
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={analyzeCV} disabled={loading}>
                <Zap className="h-4 w-4 mr-2" />
                {loading ? 'Analyzing...' : 'AI Analysis'}
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CV Builder Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-6">
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    Industry-Standard CV Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Choose from our professionally designed templates that are optimized for Applicant Tracking Systems (ATS) and loved by recruiters.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedTemplate === template.id ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-[3/4] bg-gradient-accent rounded-lg mb-3 flex items-center justify-center">
                            <FileText className="h-12 w-12 text-primary" />
                          </div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          {selectedTemplate === template.id && (
                            <div className="flex items-center mt-2">
                              <CheckCircle className="h-4 w-4 text-primary mr-1" />
                              <span className="text-sm text-primary font-medium">Selected</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {aiAnalysis && (
                    <Card className="mt-6 bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="flex items-center text-blue-900">
                          <Award className="h-5 w-5 mr-2" />
                          AI CV Analysis Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{aiAnalysis.overall_score}%</div>
                            <div className="text-sm text-muted-foreground">Overall Score</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{aiAnalysis.ats_score}%</div>
                            <div className="text-sm text-muted-foreground">ATS Compatible</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{aiAnalysis.industry_match}%</div>
                            <div className="text-sm text-muted-foreground">Industry Match</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">✅ Strengths</h4>
                            <ul className="space-y-1">
                              {aiAnalysis.strengths.map((strength: string, idx: number) => (
                                <li key={idx} className="text-sm text-green-700">• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-orange-700 mb-2">🔧 Improvements</h4>
                            <ul className="space-y-1">
                              {aiAnalysis.improvements.map((improvement: string, idx: number) => (
                                <li key={idx} className="text-sm text-orange-700">• {improvement}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name"
                  value={currentCV.personal_info.full_name}
                  onChange={(e) => setCurrentCV({
                    ...currentCV,
                    personal_info: { ...currentCV.personal_info, full_name: e.target.value }
                  })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={currentCV.personal_info.email}
                  onChange={(e) => setCurrentCV({
                    ...currentCV,
                    personal_info: { ...currentCV.personal_info, email: e.target.value }
                  })}
                />
                <Input
                  placeholder="Phone"
                  value={currentCV.personal_info.phone}
                  onChange={(e) => setCurrentCV({
                    ...currentCV,
                    personal_info: { ...currentCV.personal_info, phone: e.target.value }
                  })}
                />
                <Input
                  placeholder="Location"
                  value={currentCV.personal_info.location}
                  onChange={(e) => setCurrentCV({
                    ...currentCV,
                    personal_info: { ...currentCV.personal_info, location: e.target.value }
                  })}
                />
              </div>
              <Textarea
                placeholder="Professional Summary"
                value={currentCV.personal_info.summary}
                onChange={(e) => setCurrentCV({
                  ...currentCV,
                  personal_info: { ...currentCV.personal_info, summary: e.target.value }
                })}
                rows={4}
              />
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <Button onClick={addExperience} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
              
              {currentCV.experience.map((exp, index) => (
                <Card key={index}>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...currentCV.experience];
                          newExp[index] = { ...newExp[index], company: e.target.value };
                          setCurrentCV({ ...currentCV, experience: newExp });
                        }}
                      />
                      <Input
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => {
                          const newExp = [...currentCV.experience];
                          newExp[index] = { ...newExp[index], position: e.target.value };
                          setCurrentCV({ ...currentCV, experience: newExp });
                        }}
                      />
                      <Input
                        placeholder="Start Date"
                        type="month"
                        value={exp.start_date}
                        onChange={(e) => {
                          const newExp = [...currentCV.experience];
                          newExp[index] = { ...newExp[index], start_date: e.target.value };
                          setCurrentCV({ ...currentCV, experience: newExp });
                        }}
                      />
                      <Input
                        placeholder="End Date"
                        type="month"
                        value={exp.end_date}
                        onChange={(e) => {
                          const newExp = [...currentCV.experience];
                          newExp[index] = { ...newExp[index], end_date: e.target.value };
                          setCurrentCV({ ...currentCV, experience: newExp });
                        }}
                        disabled={exp.current}
                      />
                    </div>
                    
                    <Textarea
                      placeholder="Job Description"
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...currentCV.experience];
                        newExp[index] = { ...newExp[index], description: e.target.value };
                        setCurrentCV({ ...currentCV, experience: newExp });
                      }}
                      rows={3}
                    />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Technical Skills</h4>
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Suggest Skills
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentCV.skills.technical.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
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
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">💡 Popular tech skills in demand:</p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Python', 'JavaScript', 'SQL', 'AWS', 'Docker', 'Git'].map((skill) => (
                      <Button
                        key={skill}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 border-blue-300"
                        onClick={() => addSkill('technical', skill)}
                      >
                        + {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Soft Skills</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentCV.skills.soft.map((skill, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
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
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 mb-2">💡 Essential soft skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability'].map((skill) => (
                      <Button
                        key={skill}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 border-green-300"
                        onClick={() => addSkill('soft', skill)}
                      >
                        + {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Achievements & Awards</h4>
                <Button onClick={addAchievement} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
              
              {currentCV.achievements.map((achievement, index) => (
                <Card key={index}>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Achievement {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Achievement Title"
                        value={achievement.title}
                        onChange={(e) => {
                          const newAchievements = [...currentCV.achievements];
                          newAchievements[index] = { ...newAchievements[index], title: e.target.value };
                          setCurrentCV({ ...currentCV, achievements: newAchievements });
                        }}
                      />
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
                    
                    <Textarea
                      placeholder="Achievement Description"
                      value={achievement.description}
                      onChange={(e) => {
                        const newAchievements = [...currentCV.achievements];
                        newAchievements[index] = { ...newAchievements[index], description: e.target.value };
                        setCurrentCV({ ...currentCV, achievements: newAchievements });
                      }}
                      rows={3}
                    />
                  </CardContent>
                </Card>
              ))}

              {currentCV.achievements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p>No achievements added yet</p>
                  <p className="text-sm">Add your accomplishments, awards, and recognitions</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}