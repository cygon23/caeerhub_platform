import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Trash2, Download, Eye, Star } from 'lucide-react';
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
          <Input
            value={currentCV.title}
            onChange={(e) => setCurrentCV({ ...currentCV, title: e.target.value })}
            placeholder="CV Title"
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* CV Builder Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

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
                <h4 className="font-medium">Technical Skills</h4>
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}