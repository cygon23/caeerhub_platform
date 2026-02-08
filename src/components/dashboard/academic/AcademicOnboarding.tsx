import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { academicSupportService, SubjectHelp } from '@/services/academicSupportService';
import { useToast } from '@/hooks/use-toast';

const EDUCATION_LEVELS = [
  { value: 'primary', label: 'Primary (Standard 7)', description: 'Completed or attending primary school' },
  { value: 'secondary_form4', label: 'Secondary (Form 4)', description: 'O-Level / CSEE' },
  { value: 'secondary_form6', label: 'Secondary (Form 6)', description: 'A-Level / ACSEE' },
  { value: 'certificate_diploma', label: 'Certificate / Diploma', description: 'Technical or vocational training' },
  { value: 'university_student', label: 'University Student', description: 'Currently enrolled in university' },
  { value: 'university_graduate', label: 'University Graduate', description: 'Completed a degree program' },
];

// Subjects mapped by education level
const SUBJECTS_BY_LEVEL: Record<string, string[]> = {
  primary: ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'Civics'],
  secondary_form4: [
    'Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology',
    'Geography', 'History', 'Civics', 'Book-keeping', 'Commerce', 'ICT',
    'Literature', 'Agriculture',
  ],
  secondary_form6: [
    'Advanced Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography',
    'History', 'Economics', 'English', 'Kiswahili', 'ICT', 'General Studies',
    'Accountancy', 'Commerce',
  ],
  certificate_diploma: [
    'Mathematics', 'English', 'ICT', 'Business Studies', 'Accounting',
    'Engineering', 'Health Sciences', 'Agriculture', 'Education',
    'Hospitality', 'Other (specify)',
  ],
  university_student: [
    'Mathematics', 'Computer Science', 'Engineering', 'Medicine', 'Law',
    'Business Administration', 'Economics', 'Education', 'Natural Sciences',
    'Social Sciences', 'Arts & Humanities', 'Agriculture', 'Other (specify)',
  ],
  university_graduate: [
    'Research Methods', 'Professional Certification', 'Postgraduate Studies',
    'Career-Specific Skills', 'Other (specify)',
  ],
};

const HELP_TYPES = [
  { value: 'understanding_concepts', label: 'Understanding concepts', description: 'I struggle to grasp certain topics' },
  { value: 'exam_preparation', label: 'Exam preparation', description: 'Help me prepare for upcoming exams' },
  { value: 'assignment_help', label: 'Assignment help', description: 'Guidance on completing assignments' },
  { value: 'study_scheduling', label: 'Study scheduling', description: 'Help me organize my study time' },
  { value: 'finding_groups', label: 'Finding study groups', description: 'Connect me with peers for group study' },
  { value: 'tutoring', label: 'Tutoring', description: 'One-on-one guidance on specific subjects' },
];

interface Props {
  onComplete: () => void;
}

export default function AcademicOnboarding({ onComplete }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [educationLevel, setEducationLevel] = useState('');

  // Step 2
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectHelp[]>([]);
  const [topicInput, setTopicInput] = useState<Record<string, string>>({});

  // Step 3
  const [helpTypes, setHelpTypes] = useState<string[]>([]);
  const [specificStruggles, setSpecificStruggles] = useState('');

  const availableSubjects = educationLevel ? SUBJECTS_BY_LEVEL[educationLevel] || [] : [];

  const toggleSubject = (subjectName: string) => {
    setSelectedSubjects(prev => {
      const exists = prev.find(s => s.name === subjectName);
      if (exists) {
        return prev.filter(s => s.name !== subjectName);
      }
      return [...prev, { name: subjectName, topics: [] }];
    });
  };

  const addTopic = (subjectName: string) => {
    const topic = topicInput[subjectName]?.trim();
    if (!topic) return;

    setSelectedSubjects(prev =>
      prev.map(s =>
        s.name === subjectName && !s.topics.includes(topic)
          ? { ...s, topics: [...s.topics, topic] }
          : s
      )
    );
    setTopicInput(prev => ({ ...prev, [subjectName]: '' }));
  };

  const removeTopic = (subjectName: string, topic: string) => {
    setSelectedSubjects(prev =>
      prev.map(s =>
        s.name === subjectName
          ? { ...s, topics: s.topics.filter(t => t !== topic) }
          : s
      )
    );
  };

  const toggleHelpType = (value: string) => {
    setHelpTypes(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await academicSupportService.createProfile({
        education_level: educationLevel,
        subjects_need_help: selectedSubjects,
        help_types: helpTypes,
        specific_struggles: specificStruggles || undefined,
      });
      toast({ title: 'Profile created', description: 'Your academic profile has been set up!' });
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create academic profile',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 = !!educationLevel;
  const canProceedStep2 = selectedSubjects.length > 0;
  const canProceedStep3 = helpTypes.length > 0;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 w-16 h-16 flex items-center justify-center mb-3">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Academic Support Setup</CardTitle>
          <CardDescription>
            Help us understand your needs so we can personalize your experience
          </CardDescription>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s ? 'bg-primary text-primary-foreground' :
                  step > s ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-green-500' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Step 1: Education Level */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">What's your education level?</h3>
              </div>
              <div className="grid gap-2">
                {EDUCATION_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => setEducationLevel(level.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      educationLevel === level.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    }`}>
                    <p className="font-medium">{level.label}</p>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Subjects & Topics */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Which subjects do you need help with?</h3>
              </div>
              <p className="text-sm text-muted-foreground">Select subjects, then optionally add specific topics within each.</p>
              <div className="flex flex-wrap gap-2">
                {availableSubjects.map(subject => {
                  const isSelected = selectedSubjects.some(s => s.name === subject);
                  return (
                    <button
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border hover:border-primary/50'
                      }`}>
                      {subject}
                    </button>
                  );
                })}
              </div>

              {/* Topic inputs for selected subjects */}
              {selectedSubjects.length > 0 && (
                <div className="space-y-3 mt-4 pt-4 border-t">
                  <p className="text-sm font-medium">Add specific topics (optional):</p>
                  {selectedSubjects.map(subject => (
                    <div key={subject.name} className="space-y-2">
                      <p className="text-sm font-medium text-primary">{subject.name}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={topicInput[subject.name] || ''}
                          onChange={e => setTopicInput(prev => ({ ...prev, [subject.name]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTopic(subject.name); } }}
                          placeholder={`e.g. Algebra, Trigonometry...`}
                          className="flex-1 px-3 py-1.5 text-sm border rounded-md bg-background"
                        />
                        <Button size="sm" variant="outline" onClick={() => addTopic(subject.name)}>Add</Button>
                      </div>
                      {subject.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {subject.topics.map(topic => (
                            <Badge key={topic} variant="secondary" className="gap-1">
                              {topic}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTopic(subject.name, topic)} />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Kind of Help */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">What kind of help do you need?</h3>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {HELP_TYPES.map(type => {
                  const isSelected = helpTypes.includes(type.value);
                  return (
                    <button
                      key={type.value}
                      onClick={() => toggleHelpType(type.value)}
                      className={`text-left p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}>
                      <div className="flex items-center gap-2">
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />}
                        <p className="font-medium text-sm">{type.label}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">Anything specific you're struggling with right now?</label>
                <Textarea
                  value={specificStruggles}
                  onChange={e => setSpecificStruggles(e.target.value)}
                  placeholder="E.g. I can't understand integration in calculus, I keep failing my chemistry practicals..."
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            {step < 3 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceedStep3 || isSubmitting}>
                {isSubmitting ? 'Setting up...' : 'Get Started'}
                <Sparkles className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
