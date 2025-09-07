import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Target, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  ArrowRight,
  Building,
  GraduationCap,
  Award,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  match_score: number;
  skills_required: string[];
  experience_level: 'entry' | 'junior' | 'mid' | 'senior';
  posted_date: string;
  application_url?: string;
}

interface CareerStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'pending';
  resources: string[];
}

export default function EmploymentPath() {
  const { user } = useAuth();
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>([]);
  const [careerSteps, setCareerSteps] = useState<CareerStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('roadmap');

  // Mock data - in real app, this would come from APIs
  const mockJobs: JobRecommendation[] = [
    {
      id: '1',
      title: 'Junior Software Developer',
      company: 'TechStart Kenya',
      location: 'Nairobi, Kenya',
      salary: 'KSh 80,000 - 120,000',
      type: 'full-time',
      match_score: 92,
      skills_required: ['JavaScript', 'React', 'Node.js', 'Git'],
      experience_level: 'entry',
      posted_date: '2024-01-15',
      application_url: 'https://techstart.co.ke/careers'
    },
    {
      id: '2',
      title: 'Frontend Developer Intern',
      company: 'Digital Garage',
      location: 'Mombasa, Kenya',
      salary: 'KSh 30,000 - 50,000',
      type: 'internship',
      match_score: 88,
      skills_required: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
      experience_level: 'entry',
      posted_date: '2024-01-12',
      application_url: 'https://digitalgarage.co.ke/intern'
    },
    {
      id: '3',
      title: 'IT Support Specialist',
      company: 'SafariCorp',
      location: 'Kisumu, Kenya',
      salary: 'KSh 60,000 - 85,000',
      type: 'full-time',
      match_score: 75,
      skills_required: ['Windows', 'Network Troubleshooting', 'Customer Service'],
      experience_level: 'entry',
      posted_date: '2024-01-10'
    },
    {
      id: '4',
      title: 'Junior Data Analyst',
      company: 'DataHub Africa',
      location: 'Remote',
      salary: 'KSh 70,000 - 100,000',
      type: 'full-time',
      match_score: 82,
      skills_required: ['Python', 'SQL', 'Excel', 'Power BI'],
      experience_level: 'entry',
      posted_date: '2024-01-08'
    }
  ];

  const mockCareerSteps: CareerStep[] = [
    {
      id: '1',
      title: 'Complete Your Technical Foundation',
      description: 'Master fundamental programming concepts and build your first projects',
      duration: '3-4 months',
      priority: 'high',
      status: 'in-progress',
      resources: ['JavaScript Fundamentals Course', 'React Basics', 'Git & GitHub Workshop']
    },
    {
      id: '2',
      title: 'Build a Professional Portfolio',
      description: 'Create 3-5 projects showcasing your skills and deploy them online',
      duration: '2-3 months',
      priority: 'high',
      status: 'pending',
      resources: ['Portfolio Templates', 'Project Ideas Guide', 'Deployment Tutorial']
    },
    {
      id: '3',
      title: 'Gain Professional Experience',
      description: 'Apply for internships or entry-level positions to gain real-world experience',
      duration: '6-12 months',
      priority: 'high',
      status: 'pending',
      resources: ['Interview Preparation', 'Resume Templates', 'Application Tracking']
    },
    {
      id: '4',
      title: 'Develop Specialized Skills',
      description: 'Choose a specialization and deepen your expertise in that area',
      duration: '6-8 months',
      priority: 'medium',
      status: 'pending',
      resources: ['Specialization Guide', 'Advanced Courses', 'Certification Programs']
    },
    {
      id: '5',
      title: 'Build Professional Network',
      description: 'Connect with industry professionals and join tech communities',
      duration: 'Ongoing',
      priority: 'medium',
      status: 'pending',
      resources: ['LinkedIn Optimization', 'Tech Meetups', 'Professional Communities']
    },
    {
      id: '6',
      title: 'Pursue Leadership Opportunities',
      description: 'Take on leadership roles and mentor others in your field',
      duration: '12+ months',
      priority: 'low',
      status: 'pending',
      resources: ['Leadership Training', 'Mentorship Programs', 'Team Management']
    }
  ];

  useEffect(() => {
    loadEmploymentData();
  }, [user]);

  const loadEmploymentData = async () => {
    setLoading(true);
    try {
      // Set mock data
      setJobRecommendations(mockJobs);
      setCareerSteps(mockCareerSteps);
    } catch (error) {
      console.error('Error loading employment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (status: CareerStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderRoadmap = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-hero text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Your Employment Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/90 mb-4">
            Follow this personalized roadmap to land your first tech job. Each step is tailored to your current skills and career goals.
          </p>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">78%</div>
              <div className="text-white/80 text-sm">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4-6</div>
              <div className="text-white/80 text-sm">Months to Goal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {careerSteps.map((step, index) => (
          <Card key={step.id} className={`border-l-4 ${
            step.status === 'completed' ? 'border-l-green-500 bg-green-50' :
            step.status === 'in-progress' ? 'border-l-blue-500 bg-blue-50' :
            'border-l-gray-300'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    {getStatusIcon(step.status)}
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <Badge variant={step.priority === 'high' ? 'destructive' : step.priority === 'medium' ? 'default' : 'secondary'}>
                      {step.priority} priority
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3 ml-11">{step.description}</p>
                  
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Duration: {step.duration}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {step.resources.map((resource, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Button 
                    variant={step.status === 'pending' ? 'default' : 'outline'} 
                    size="sm"
                    disabled={step.status === 'completed'}
                  >
                    {step.status === 'completed' ? 'Completed' :
                     step.status === 'in-progress' ? 'Continue' : 'Start'}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderJobSearch = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Job Recommendations
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button size="sm">
                View All Jobs
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {jobRecommendations.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Building className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge className={`${getMatchColor(job.match_score)}`}>
                          {job.match_score}% match
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-muted-foreground">
                          <Building className="h-4 w-4 mr-2" />
                          {job.company}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {job.salary}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          Posted {new Date(job.posted_date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills_required.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant={job.type === 'full-time' ? 'default' : 'outline'}>
                          {job.type}
                        </Badge>
                        <Badge variant="outline">
                          {job.experience_level} level
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Button 
                        variant="default"
                        onClick={() => {
                          if (job.application_url) {
                            window.open(job.application_url, '_blank');
                          }
                        }}
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Save Job
                        <Star className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSkillsGap = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Skills Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Skills You Have</h4>
                <div className="space-y-2">
                  {['HTML/CSS', 'JavaScript Basics', 'Git Version Control', 'Problem Solving'].map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">{skill}</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-red-600">❌ Skills to Develop</h4>
                <div className="space-y-2">
                  {[
                    { skill: 'React Framework', priority: 'high' },
                    { skill: 'Node.js Backend', priority: 'medium' },
                    { skill: 'Database Management', priority: 'medium' },
                    { skill: 'Testing & Debugging', priority: 'high' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">{item.skill}</span>
                      <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {item.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📚 Recommended Learning Path</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">1. Complete React Fundamentals Course</span>
                  <Badge variant="outline">2 weeks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">2. Build 2 React Projects</span>
                  <Badge variant="outline">3 weeks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">3. Learn Testing with Jest</span>
                  <Badge variant="outline">1 week</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">4. Start applying for React jobs</span>
                  <Badge variant="outline">Ongoing</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Demand Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">87%</div>
              <div className="text-sm text-muted-foreground">Jobs require React</div>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-lg">
              <DollarSign className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">KSh 95k</div>
              <div className="text-sm text-muted-foreground">Avg. starting salary</div>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-lg">
              <Briefcase className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">Open positions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Employment Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="roadmap">Career Roadmap</TabsTrigger>
              <TabsTrigger value="jobs">Job Search</TabsTrigger>
              <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="roadmap">
              {renderRoadmap()}
            </TabsContent>

            <TabsContent value="jobs">
              {renderJobSearch()}
            </TabsContent>

            <TabsContent value="skills">
              {renderSkillsGap()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}