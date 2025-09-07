import React, { useState, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  BadgeCheck,
  Target,
  BookOpen,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  MessageCircle,
  FileText,
  BarChart3,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Lightbulb,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingResults from "@/components/user/OnboardingResults";
import Profile from "@/components/user/Profile";
import SystemSettings from "@/components/user/SystemSettings";
import CareerAssessment from "@/components/dashboard/CareerAssessment";
import LearningModules from "@/components/dashboard/LearningModules";
import JobOpportunities from "@/components/dashboard/JobOpportunities";
import CVBuilder from "@/components/dashboard/CVBuilder";
import Mentorship from "@/components/dashboard/Mentorship";
import PerformanceTracker from "@/components/dashboard/PerformanceTracker";
import RoadmapGenerator from "@/components/user/profile/RoadmapGenerator";

// Lazy load dashboard components with proper named exports
const InterviewAICoach = React.lazy(() => import("@/components/dashboard/InterviewAICoach"));
const CareerDashboard = React.lazy(() => import("@/components/dashboard/CareerDashboard"));
const EmploymentPath = React.lazy(() => import("@/components/dashboard/EmploymentPath"));
const SelfEmploymentPath = React.lazy(() => import("@/components/dashboard/SelfEmploymentPath"));
const InvestorPath = React.lazy(() => import("@/components/dashboard/InvestorPath"));
const BehavioralInsight = React.lazy(() => import("@/components/dashboard/BehavioralInsight").then(m => ({ default: m.BehavioralInsight })));
const Badges = React.lazy(() => import("@/components/dashboard/Badges").then(m => ({ default: m.Badges })));
const AcademicSupport = React.lazy(() => import("@/components/dashboard/AcademicSupport").then(m => ({ default: m.AcademicSupport })));
const SelfLearning = React.lazy(() => import("@/components/dashboard/SelfLearning").then(m => ({ default: m.SelfLearning })));
const DreamPlanner = React.lazy(() => import("@/components/dashboard/DreamPlanner").then(m => ({ default: m.DreamPlanner })));
const CareerSuggestion = React.lazy(() => import("@/components/dashboard/CareerSuggestion").then(m => ({ default: m.CareerSuggestion })));
const UbongInsight = React.lazy(() => import("@/components/dashboard/UbongInsight").then(m => ({ default: m.UbongInsight })));
const StrengthWeakness = React.lazy(() => import("@/components/dashboard/StrengthWeakness").then(m => ({ default: m.StrengthWeakness })));

export default function YouthDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  const sidebarItems = [
    {
      title: "Knowing Who I Am",
      items: [
        { title: "Career Personality Test", icon: Brain, id: "personality" },
        { title: "Strengths & Weaknesses", icon: BarChart3, id: "strengths" },
        { title: "Ubongo Insights", icon: Lightbulb, id: "insights" },
      ],
    },
    {
      title: "My Opportunities",
      items: [
        { title: "Labor Market Info", icon: TrendingUp, id: "market" },
        {
          title: "Global & Local Opportunities",
          icon: Target,
          id: "opportunities",
        },
        { title: "Custom Career Suggestions", icon: Star, id: "suggestions" },
        { title: "Get hired", icon: BadgeCheck, id: "platfom" },
      ],
    },
    {
      title: "Learning Opportunities",
      items: [
        { title: "Online Modules", icon: BookOpen, id: "modules" },
        { title: "Academic Support", icon: MessageCircle, id: "academic" },
        { title: "Self-Learning Challenges", icon: Award, id: "challenges" },
      ],
    },
    {
      title: "My Life Dream",
      items: [
        { title: "Dream Planner", icon: Target, id: "planner" },
        { title: "Roadmap Generator", icon: ArrowRight, id: "roadmap" },
        { title: "Investor Tools", icon: TrendingUp, id: "investor" },
      ],
    },
    {
      title: "Mentorship",
      items: [
        { title: "Academic Mentorship", icon: BookOpen, id: "academic-mentor" },
        { title: "Career Mentorship", icon: Users, id: "career-mentor" },
        { title: "Parental Guidance", icon: Users, id: "parental" },
      ],
    },
    {
      title: "Career Paths",
      items: [
        { title: "Employment Path", icon: Briefcase, id: "employment" },
        { title: "Self-Employment Path", icon: Target, id: "self-employment" },
        { title: "Investor Path", icon: TrendingUp, id: "investor-path" },
      ],
    },
    {
      title: "Career Tools",
      items: [
        { title: "Smart CV Builder", icon: FileText, id: "cv-builder" },
        { title: "Interview AI Coach", icon: MessageCircle, id: "interview" },
        { title: "Career Dashboard", icon: BarChart3, id: "career-dashboard" },
      ],
    },
    {
      title: "Performance & Support",
      items: [
        { title: "Performance Tracker", icon: BarChart3, id: "performance" },
        { title: "Behavioral Insights", icon: Brain, id: "behavioral" },
        { title: "Badges & Rewards", icon: Award, id: "badges" },
      ],
    },
    {
      title: "My Profile",
      items: [
        { title: "Profile Settings", icon: User, id: "profile" },
        { title: "Account Settings", icon: Settings, id: "settings" },
        { title: "Onboarding Results", icon: Brain, id: "onboarding-results" },
      ],
    },
  ];

  const quickStats = [
    {
      label: "Career Readiness",
      value: 72,
      icon: Target,
      color: "text-primary",
    },
    {
      label: "Skills Developed",
      value: 12,
      icon: BookOpen,
      color: "text-secondary",
    },
    { label: "Days Active", value: 34, icon: Calendar, color: "text-primary" },
    { label: "Badges Earned", value: 8, icon: Award, color: "text-secondary" },
  ];

  const recentActivities = [
    {
      title: "Completed Career Personality Test",
      description: "Discovered you're a 'Logical Thinker' personality type",
      time: "2 hours ago",
      icon: Brain,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Started ICT Fundamentals Module",
      description: "Progress: 3/12 lessons completed",
      time: "1 day ago",
      icon: BookOpen,
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Mentorship Session Scheduled",
      description: "Meeting with Dr. James Mwangi tomorrow at 2 PM",
      time: "2 days ago",
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
  ];

  const upcomingTasks = [
    { title: "Complete CV Builder Setup", priority: "High", due: "Today" },
    {
      title: "Take Mathematics Assessment",
      priority: "Medium",
      due: "Tomorrow",
    },
    { title: "Review Roadmap Progress", priority: "Low", due: "This Week" },
  ];

  const renderOverview = () => (
    <div className='space-y-8'>
      {/* Welcome Section */}
      <div className='bg-gradient-hero text-white rounded-lg p-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>
              Habari {user?.name?.split(" ")[0] || "Amina"}! 👋
            </h1>
            <p className='text-white/90 text-lg'>
              Ready to continue building your career journey today?
            </p>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold'>72%</div>
            <div className='text-white/80 text-sm'>Career Readiness</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {quickStats.map((stat, index) => (
          <Card
            key={stat.label}
            className='hover:shadow-primary transition-all duration-300'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>{stat.label}</p>
                  <p className='text-2xl font-bold text-foreground'>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Recent Activities */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Clock className='h-5 w-5 mr-2' />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className='flex items-start space-x-4 p-4 bg-gradient-accent rounded-lg'>
                  <div className={`p-2 rounded-lg ${activity.color}`}>
                    <activity.icon className='h-4 w-4' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-medium text-foreground'>
                      {activity.title}
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      {activity.description}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <CheckCircle className='h-5 w-5 mr-2' />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {upcomingTasks.map((task, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-3 bg-background border border-border rounded-lg'>
                  <div className='flex-1'>
                    <p className='font-medium text-foreground text-sm'>
                      {task.title}
                    </p>
                    <p className='text-xs text-muted-foreground'>{task.due}</p>
                  </div>
                  <Badge
                    variant={
                      task.priority === "High"
                        ? "destructive"
                        : task.priority === "Medium"
                        ? "default"
                        : "secondary"
                    }>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Recommendations */}
      <Card className='bg-gradient-card border-0'>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Brain className='h-5 w-5 mr-2 text-primary' />
            AI Recommendations for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center p-4'>
              <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                <BookOpen className='h-6 w-6 text-primary' />
              </div>
              <h4 className='font-semibold text-foreground mb-2'>
                Continue Learning
              </h4>
              <p className='text-sm text-muted-foreground'>
                Complete your ICT Fundamentals course to unlock advanced modules
              </p>
            </div>
            <div className='text-center p-4'>
              <div className='w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                <Users className='h-6 w-6 text-secondary' />
              </div>
              <h4 className='font-semibold text-foreground mb-2'>
                Book Mentorship
              </h4>
              <p className='text-sm text-muted-foreground'>
                Schedule your next session with a technology industry mentor
              </p>
            </div>
            <div className='text-center p-4'>
              <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                <FileText className='h-6 w-6 text-primary' />
              </div>
              <h4 className='font-semibold text-foreground mb-2'>Update CV</h4>
              <p className='text-sm text-muted-foreground'>
                Add your recent skills and achievements to your professional CV
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (activeSection === "overview") return renderOverview();

    // Profile and settings
    if (activeSection === "onboarding-results") return <OnboardingResults />;
    if (activeSection === "profile") return <Profile />;
    if (activeSection === "settings") return <SystemSettings />;

    // Career Assessment
    if (activeSection === "personality") return <CareerAssessment />;
    
    // Learning
    if (activeSection === "modules") return <LearningModules />;
    
    // Job Opportunities
    if (activeSection === "platfom") return <JobOpportunities />;
    
    // CV Builder
    if (activeSection === "cv-builder") return <CVBuilder />;

    // Interview AI Coach
    if (activeSection === "interview") {
      return <InterviewAICoach />;
    }

    // Career Dashboard
    if (activeSection === "career-dashboard") {
      return <CareerDashboard />;
    }

    // Employment Path
    if (activeSection === "employment") {
      return <EmploymentPath />;
    }

    // Self-Employment Path
    if (activeSection === "self-employment") {
      return <SelfEmploymentPath />;
    }

    // Investor Path
    if (activeSection === "investor-path") {
      return <InvestorPath />;
    }

    // Mentorship
    if (activeSection === "academic-mentor" || activeSection === "career-mentor" || activeSection === "parental") {
      return <Mentorship />;
    }

    // Performance Tracker
    if (activeSection === "performance") return <PerformanceTracker />;

    // Roadmap Generator (already exists)
    if (activeSection === "roadmap") return <RoadmapGenerator />;

    // Investor Tools
    if (activeSection === "investor") {
      const InvestorTools = React.lazy(() => import("@/components/dashboard/InvestorTools"));
      return <InvestorTools />;
    }

    // New dashboard components
    if (activeSection === "behavioral") return <BehavioralInsight />;
    if (activeSection === "badges") return <Badges />;
    if (activeSection === "academic") return <AcademicSupport />;
    if (activeSection === "challenges") return <SelfLearning />;
    if (activeSection === "planner") return <DreamPlanner />;
    if (activeSection === "suggestions") return <CareerSuggestion />;
    if (activeSection === "insights") return <UbongInsight />;
    if (activeSection === "strengths") return <StrengthWeakness />;

    // Placeholder for remaining sections
    return (
      <Card>
        <CardHeader>
          <CardTitle className='capitalize'>
            {activeSection.replace("-", " ")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
              <Star className='h-8 w-8 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-foreground mb-2'>
              {activeSection.charAt(0).toUpperCase() +
                activeSection.slice(1).replace("-", " ")}{" "}
              Module
            </h3>
            <p className='text-muted-foreground mb-6'>
              This feature is coming soon with rich interactive content and
              AI-powered insights.
            </p>
            <Button className='bg-gradient-hero text-white'>
              Get Notified When Available
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <SidebarProvider>
      <div className='min-h-screen flex w-full bg-background'>
        <Sidebar className='border-r border-border'>
          <div className='p-4 border-b border-border'>
            <div className='flex items-center space-x-2'>
              {/* Replace the span below with your logo */}
              <img
                src='/logo.png'
                alt='Career na Mimi Logo'
                className='h-8 w-8'
                style={{ maxWidth: 120 }}
              />
              <span className='text-black font-bold '>careerHub</span>
            </div>
          </div>

          <SidebarContent>
            <div className='p-4'>
              <Button
                variant={activeSection === "overview" ? "default" : "ghost"}
                className='w-full justify-start mb-4'
                onClick={() => setActiveSection("overview")}>
                <BarChart3 className='h-4 w-4 mr-2' />
                Dashboard Overview
              </Button>
            </div>

            {sidebarItems.map((group, index) => (
              <SidebarGroup key={index}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveSection(item.id)}
                          className={
                            activeSection === item.id
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }>
                          <item.icon className='h-4 w-4' />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <div className='p-4 border-t border-border'>
            <div className='text-xs text-muted-foreground mb-2'>
              Logged in as:
            </div>
            <div className='text-sm font-medium text-foreground'>
              {user?.name}
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={logout}
              className='w-full mt-2 text-muted-foreground hover:text-foreground'>
              Sign Out
            </Button>
          </div>
        </Sidebar>

        <main className='flex-1'>
          <header className='h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-6'>
            <SidebarTrigger />
            <div className='ml-4'>
              <h1 className='text-xl font-semibold text-foreground'>
                {activeSection === "overview"
                  ? "Dashboard Overview"
                  : activeSection.charAt(0).toUpperCase() +
                    activeSection.slice(1).replace("-", " ")}
              </h1>
            </div>
          </header>

          <div className='p-6'>
            <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              {renderContent()}
            </Suspense>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}