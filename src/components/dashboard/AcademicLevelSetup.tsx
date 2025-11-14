import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type EducationLevel = 'form_1' | 'form_2' | 'form_3' | 'form_4' | 'form_5' | 'form_6';
type ExamType = 'necta_form_2' | 'necta_form_4' | 'necta_form_6';

interface AcademicLevelSetupProps {
  onComplete: () => void;
}

export default function AcademicLevelSetup({ onComplete }: AcademicLevelSetupProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [educationLevel, setEducationLevel] = useState<EducationLevel | "">("");
  const [examType, setExamType] = useState<ExamType | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingLevel, setHasExistingLevel] = useState(false);

  const educationLevels = [
    { value: "form_1", label: "Form 1" },
    { value: "form_2", label: "Form 2" },
    { value: "form_3", label: "Form 3" },
    { value: "form_4", label: "Form 4" },
    { value: "form_5", label: "Form 5" },
    { value: "form_6", label: "Form 6" },
  ];

  const examTypes = [
    { value: "necta_form_2", label: "NECTA Form 2 Examination", description: "Certificate of Secondary Education Examination (CSEE)" },
    { value: "necta_form_4", label: "NECTA Form 4 Examination", description: "Certificate of Secondary Education Examination (CSEE)" },
    { value: "necta_form_6", label: "NECTA Form 6 Examination", description: "Advanced Certificate of Secondary Education Examination (ACSEE)" },
  ];

  useEffect(() => {
    checkExistingLevel();
  }, [user]);

  const checkExistingLevel = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("student_academic_levels")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data && !error) {
        setHasExistingLevel(true);
        setEducationLevel(data.education_level);
        setExamType(data.exam_type);
      }
    } catch (err) {
      // No existing level found - this is expected for new users
      console.log("No existing academic level found");
    }
  };

  const handleSubmit = async () => {
    if (!educationLevel || !examType) {
      toast({
        title: "Missing Information",
        description: "Please select both your education level and exam type.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("student_academic_levels")
        .upsert({
          user_id: user.id,
          education_level: educationLevel,
          exam_type: examType,
        }, {
          onConflict: "user_id"
        });

      if (error) throw error;

      toast({
        title: "Academic Level Set!",
        description: "Your academic level has been saved successfully.",
      });

      onComplete();
    } catch (error: any) {
      console.error("Error saving academic level:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save academic level. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {hasExistingLevel ? "Update Academic Level" : "Set Up Your Academic Level"}
          </CardTitle>
          <CardDescription className="text-base">
            {hasExistingLevel 
              ? "You can update your academic level and exam type below."
              : "This is a one-time setup to personalize your learning experience. We need to know your current education level to provide the right study materials and practice questions."
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Education Level Selection */}
          <div className="space-y-2">
            <Label htmlFor="education-level" className="text-base font-semibold">
              Current Education Level *
            </Label>
            <Select 
              value={educationLevel} 
              onValueChange={(value) => setEducationLevel(value as EducationLevel)}
            >
              <SelectTrigger id="education-level" className="h-12">
                <SelectValue placeholder="Select your form level" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value} className="py-3">
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Select the form you are currently in or preparing for
            </p>
          </div>

          {/* Exam Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="exam-type" className="text-base font-semibold">
              Target Examination *
            </Label>
            <Select 
              value={examType} 
              onValueChange={(value) => setExamType(value as ExamType)}
            >
              <SelectTrigger id="exam-type" className="h-12">
                <SelectValue placeholder="Select your target exam" />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((exam) => (
                  <SelectItem key={exam.value} value={exam.value} className="py-4">
                    <div>
                      <div className="font-medium">{exam.label}</div>
                      <div className="text-xs text-muted-foreground">{exam.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose the NECTA examination you are preparing for
            </p>
          </div>

          {/* Information Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-foreground">
                <p className="font-medium mb-1">Why do we need this information?</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Generate appropriate practice questions for your level</li>
                  <li>• Provide relevant study materials and guides</li>
                  <li>• Track your progress toward exam readiness</li>
                  <li>• Customize difficulty levels based on your education stage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!educationLevel || !examType || isLoading}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                {hasExistingLevel ? "Update Academic Level" : "Continue to Upload Materials"}
              </>
            )}
          </Button>

          {hasExistingLevel && (
            <Button
              variant="ghost"
              onClick={onComplete}
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}