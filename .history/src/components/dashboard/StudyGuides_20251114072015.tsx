import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookMarked,
  RefreshCw,
  Sparkles,
  Edit,
  Save,
  X,
  Download,
  AlertCircle,
  Lightbulb,
  Calculator,
  BookOpen,
  Brain,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface StudyGuideContent {
  summary: string;
  key_points: string[];
  formulas?: Array<{
    name: string;
    formula: string;
    explanation: string;
  }>;
  definitions?: Array<{
    term: string;
    definition: string;
  }>;
  examples?: string[];
  mnemonics?: string[];
}

interface StudyGuide {
  id: string;
  subject: string;
  title: string;
  content: StudyGuideContent;
  is_customized: boolean;
  created_at: string;
}

export default function StudyGuides() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<StudyGuide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<StudyGuideContent | null>(null);

  useEffect(() => {
    fetchAvailableSubjects();
  }, [user]);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudyGuides();
    }
  }, [selectedSubject]);

  const fetchAvailableSubjects = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('study_materials')
        .select('subject')
        .eq('user_id', user.id)
        .eq('ai_processed', true);

      if (error) throw error;

      const uniqueSubjects = [...new Set(data.map((m) => m.subject))];
      setSubjects(uniqueSubjects);
      
      if (uniqueSubjects.length > 0 && !selectedSubject) {
        setSelectedSubject(uniqueSubjects[0]);
      }
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load subjects.",
        variant: "destructive",
      });
    }
  };

  const fetchStudyGuides = async () => {
    if (!user?.id || !selectedSubject) return;

    setIsLoading(true);
    setSelectedGuide(null);

    try {
      const { data, error } = await supabase
        .from('study_guides')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject', selectedSubject)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStudyGuides(data || []);

      if (data && data.length > 0) {
        setSelectedGuide(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching study guides:', error);
      toast({
        title: "Error",
        description: "Failed to load study guides.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateStudyGuide = async () => {
    if (!user?.id || !selectedSubject) return;

    setIsGenerating(true);

    try {
      // Get a material for this subject
      const { data: materials, error: materialsError } = await supabase
        .from('study_materials')
        .select('id, file_name')
        .eq('user_id', user.id)
        .eq('subject', selectedSubject)
        .eq('ai_processed', true)
        .limit(1);

      if (materialsError) throw materialsError;

      if (!materials || materials.length === 0) {
        toast({
          title: "No Materials Found",
          description: `Please upload and process ${selectedSubject} materials first.`,
          variant: "destructive",
        });
        return;
      }

      const materialId = materials[0].id;
      const materialName = materials[0].file_name;

      toast({
        title: "Generating Study Guide",
        description: "AI is creating a comprehensive study guide from your materials...",
      });

      const { data, error } = await supabase.functions.invoke('generate-study-guide', {
        body: {
          user_id: user.id,
          material_id: materialId,
          subject: selectedSubject,
          include_formulas: true,
          include_mnemonics: true,
        },
      });

      if (error) throw error;

      if (data.study_guide) {
        setStudyGuides([data.study_guide, ...studyGuides]);
        setSelectedGuide(data.study_guide);
        
        toast({
          title: "Study Guide Generated!",
          description: `Created comprehensive guide for ${selectedSubject}.`,
          icon: <Sparkles className="h-5 w-5" />,
        });
      }
    } catch (error: any) {
      console.error('Error generating study guide:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate study guide. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startEditing = () => {
    if (selectedGuide) {
      setEditedContent({ ...selectedGuide.content });
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setEditedContent(null);
    setIsEditing(false);
  };

  const saveEdit = async () => {
    if (!selectedGuide || !editedContent) return;

    try {
      const { error } = await supabase
        .from('study_guides')
        .update({
          content: editedContent,
          is_customized: true,
        })
        .eq('id', selectedGuide.id);

      if (error) throw error;

      setSelectedGuide({
        ...selectedGuide,
        content: editedContent,
        is_customized: true,
      });

      setIsEditing(false);
      setEditedContent(null);

      toast({
        title: "Changes Saved",
        description: "Your study guide has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error saving changes:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = () => {
    toast({
      title: "Export Feature",
      description: "PDF export will be available in the next update.",
    });
  };

  if (subjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookMarked className="h-5 w-5 mr-2" />
            Study Guides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Study Materials Yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload and process study materials first to generate AI-powered study guides.
            </p>
            <Button onClick={() => window.location.href = '#upload-materials'}>
              Upload Materials
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <BookMarked className="h-5 w-5 mr-2" />
              Study Guides
            </span>
            <div className="flex gap-2">
              {selectedGuide && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              )}
              <Button
                onClick={generateStudyGuide}
                disabled={isGenerating || !selectedSubject}
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate New Guide
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {studyGuides.length > 1 && (
              <div className="flex-1">
                <Label>Select Guide</Label>
                <Select 
                  value={selectedGuide?.id || ""} 
                  onValueChange={(id) => {
                    const guide = studyGuides.find(g => g.id === id);
                    if (guide) setSelectedGuide(guide);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a study guide" />
                  </SelectTrigger>
                  <SelectContent>
                    {studyGuides.map((guide) => (
                      <SelectItem key={guide.id} value={guide.id}>
                        {guide.title} ({new Date(guide.created_at).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Study Guide Display */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading study guides...</p>
            </div>
          </CardContent>
        </Card>
      ) : !selectedGuide ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BookMarked className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Study Guides Yet</h3>
              <p className="text-muted-foreground mb-6">
                Click "Generate New Guide" to create an AI-powered study guide from your materials.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedGuide.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{selectedGuide.subject}</Badge>
                  {selectedGuide.is_customized && (
                    <Badge variant="secondary">
                      <Edit className="h-3 w-3 mr-1" />
                      Customized
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Created {new Date(selectedGuide.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {!isEditing && (
                <Button variant="outline" onClick={startEditing}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Guide
                </Button>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={cancelEditing}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={saveEdit}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="points">Key Points</TabsTrigger>
                <TabsTrigger value="formulas">Formulas</TabsTrigger>
                <TabsTrigger value="definitions">Definitions</TabsTrigger>
                <TabsTrigger value="mnemonics">Mnemonics</TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Content Summary</h3>
                </div>
                {isEditing ? (
                  <Textarea
                    value={editedContent?.summary || ""}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent!,
                        summary: e.target.value,
                      })
                    }
                    rows={8}
                    className="font-serif"
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-base leading-relaxed">
                      {selectedGuide.content.summary}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Key Points Tab */}
              <TabsContent value="points" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Key Points</h3>
                </div>
                <div className="space-y-3">
                  {(isEditing ? editedContent?.key_points : selectedGuide.content.key_points)?.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      {isEditing ? (
                        <Textarea
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...(editedContent?.key_points || [])];
                            newPoints[index] = e.target.value;
                            setEditedContent({
                              ...editedContent!,
                              key_points: newPoints,
                            });
                          }}
                          rows={2}
                          className="flex-1"
                        />
                      ) : (
                        <p className="flex-1 text-base">{point}</p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Formulas Tab */}
              <TabsContent value="formulas" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Important Formulas</h3>
                </div>
                {selectedGuide.content.formulas && selectedGuide.content.formulas.length > 0 ? (
                  <div className="space-y-4">
                    {selectedGuide.content.formulas.map((formula, index) => (
                      <Card key={index} className="border-2">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-lg">{formula.name}</h4>
                            <div className="bg-accent/30 p-3 rounded font-mono text-lg font-semibold text-center">
                              {formula.formula}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formula.explanation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No formulas available for this guide.
                  </div>
                )}
              </TabsContent>

              {/* Definitions Tab */}
              <TabsContent value="definitions" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Key Definitions</h3>
                </div>
                {selectedGuide.content.definitions && selectedGuide.content.definitions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedGuide.content.definitions.map((def, index) => (
                      <div key={index} className="p-4 border-l-4 border-primary bg-accent/50 rounded-r-lg">
                        <h4 className="font-semibold text-base mb-1">{def.term}</h4>
                        <p className="text-sm text-muted-foreground">{def.definition}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No definitions available for this guide.
                  </div>
                )}
              </TabsContent>

              {/* Mnemonics Tab */}
              <TabsContent value="mnemonics" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Memory Aids & Mnemonics</h3>
                </div>
                {selectedGuide.content.mnemonics && selectedGuide.content.mnemonics.length > 0 ? (
                  <div className="space-y-3">
                    {selectedGuide.content.mnemonics.map((mnemonic, index) => (
                      <div key={index} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-base">{mnemonic}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No mnemonics available for this guide.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}