import React, { useState, Suspense, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Upload,
  FileQuestion,
  BookMarked,
  Bell,
  LogOut,
  ChevronDown,
  RefreshCw,
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
import ExamInsights from "@/components/dashboard/ExamInsights";
import RoadmapGenerator from "@/components/user/profile/RoadmapGenerator";
import UploadMaterials from "@/components/dashboard/UploadMaterials";
import PracticeQuestions from "@/components/dashboard/PracticeQuestions";
import StudyGuides from "@/components/dashboard/StudyGuides";
import YouthDashboardOverview from "@/components/dashboard/YouthDashboardOverview";
import SelfLearningHub from "@/components/dashboard/SelfLearningHub";
import AIKnowledgeChat from "@/components/dashboard/AIKnowledgeChat";
import { supabase } from "@/integrations/supabase/client";

// Lazy load dashboard components with proper named exports
const InterviewAICoach = React.lazy(
  () => import("@/components/dashboard/InterviewAICoach")
);
const CareerDashboard = React.lazy(
  () => import("@/components/dashboard/CareerDashboard")
);
const EmploymentPath = React.lazy(() =>
  import("@/components/dashboard/EmploymentPath").then((m) => ({
    default: m.EmploymentPath,
  }))
);
const SelfEmploymentPath = React.lazy(() =>
  import("@/components/dashboard/SelfEmploymentPath").then((m) => ({
    default: m.default,
  }))
);
const InvestorPath = React.lazy(() =>
  import("@/components/dashboard/InvestorPath").then((m) => ({
    default: m.default,
  }))
);
const BehavioralInsight = React.lazy(() =>
  import("@/components/dashboard/BehavioralInsight").then((m) => ({
    default: m.BehavioralInsight,
  }))
);
const Badges = React.lazy(() =>
  import("@/components/dashboard/Badges").then((m) => ({ default: m.Badges }))
);
const AcademicSupport = React.lazy(() =>
  import("@/components/dashboard/AcademicSupport").then((m) => ({
    default: m.AcademicSupport,
  }))
);
const SelfLearning = React.lazy(() =>
  import("@/components/dashboard/SelfLearning").then((m) => ({
    default: m.SelfLearning,
  }))
);
const DreamPlanner = React.lazy(
  () => import("@/components/dashboard/DreamPlanner")
);
const CareerSuggestion = React.lazy(() =>
  import("@/components/dashboard/CareerSuggestion").then((m) => ({
    default: m.CareerSuggestion,
  }))
);
const UbongInsight = React.lazy(() =>
  import("@/components/dashboard/UbongInsight").then((m) => ({
    default: m.UbongInsight,
  }))
);
const StrengthWeakness = React.lazy(() =>
  import("@/components/dashboard/StrengthWeakness").then((m) => ({
    default: m.StrengthWeakness,
  }))
);
const InvestorTools = React.lazy(
  () => import("@/components/dashboard/InvestorTools")
);

export default function YouthDashboard() {
  const { user, logout } = useAuth();
  const [userCareerPath, setUserCareerPath] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [userPlanTier, setUserPlanTier] = useState<string>("free");

  useEffect(() => {
    fetchUserCareerPath();
    fetchUserPlan();
  }, [user]);

  const fetchUserCareerPath = async () => {
    try {
      const { data, error } = await supabase
        .from("onboarding_responses")
        .select("preferred_path, ai_recommended_path")
        .eq("user_id", user.id)
        .single();

      // Ensure we get a string value, handle objects/arrays safely
      const path = data?.ai_recommended_path || data?.preferred_path;
      if (path && typeof path === 'string') {
        setUserCareerPath(path);
      } else if (path && typeof path === 'object') {
        // If it's an object, try to extract a string value
        setUserCareerPath(String(path.name || path.value || path.path || ''));
      } else {
        setUserCareerPath(null);
      }
    } catch (err) {
      setUserCareerPath(null);
    }
  };

  const fetchUserPlan = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("billing_settings")
        .select("plan_tier")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data?.plan_tier) {
        setUserPlanTier(data.plan_tier);
      } else {
        setUserPlanTier("free");
      }
    } catch (err) {
      console.error("Error fetching user plan:", err);
      setUserPlanTier("free");
    }
  };

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
      ],
    },
   {
  title: "Examination Preparation",
  items: [
    { title: "Upload Materials", icon: Upload, id: "upload-materials" },
    { title: "Practice Questions", icon: FileQuestion, id: "practice-questions" },
    { title: "Study Guides", icon: BookMarked, id: "study-guides" },
    { title: "Performance Insights", icon: TrendingUp, id: "exam-insights" },
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

  // --- Normalize and map career paths safely ---
  const pathMapping: Record<string, string> = {
    employment: "employment",
    "self-employment": "self-employment",
    self_employment: "self-employment",
    investor: "investor-path",
    "investor-path": "investor-path",
    investor_path: "investor-path",
  };

  const normalizeCareer = (c?: string | null) => {
    if (!c) return null;
    return String(c)
      .toLowerCase()
      .trim()
      .replace(/[_\s]+/g, "-");
  };

  // --- Filter sidebar based on normalized path mapping ---
  const filteredSidebarItems = sidebarItems.map((group) => {
    if (group.title === "Career Paths") {
      const key = normalizeCareer(userCareerPath);
      const mapped = key ? pathMapping[key] : undefined;
      const filteredItems = mapped
        ? group.items.filter((item) => String(item.id) === mapped)
        : group.items; // fallback to showing all if no match

      return { ...group, items: filteredItems };
    }
    return group;
  });


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

  const renderOverview = () => <YouthDashboardOverview />;

  const renderOverviewOld = () => (
    <div className='space-y-8'>
      {/* Welcome Section */}
      <div className='bg-gradient-hero text-white rounded-lg p-4 md:p-8'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold mb-2'>
              Habari {user?.name?.split(" ")[0] || "User"}! 👋
            </h1>
            <p className='text-white/90 text-base md:text-lg'>
              Ready to continue building your career journey today?
            </p>
          </div>
          <div className='text-left md:text-right'>
            <div className='text-2xl font-bold'>72%</div>
            <div className='text-white/80 text-sm'>Career Readiness</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6'>
        {quickStats.map((stat, index) => (
          <Card
            key={stat.label}
            className='hover:shadow-primary transition-all duration-300'>
            <CardContent className='p-4 md:p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-xs md:text-sm'>
                    {stat.label}
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-foreground'>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
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

    if (activeSection === "investor") {
      return (
        <Suspense
          fallback={
            <div className='flex items-center justify-center py-12'>
              <RefreshCw className='h-8 w-8 animate-spin text-primary' />
            </div>
          }>
          <InvestorTools />
        </Suspense>
      );
    }

    // Mentorship
    if (
      activeSection === "academic-mentor" ||
      activeSection === "career-mentor" ||
      activeSection === "parental"
    ) {
      return <Mentorship />;
    }

    // Performance Tracker
    if (activeSection === "performance") return <PerformanceTracker />;

    // Roadmap Generator (already exists)
    if (activeSection === "roadmap") return <RoadmapGenerator />;

    // Investor Tools
    if (activeSection === "investor") {
      const InvestorTools = React.lazy(
        () => import("@/components/dashboard/InvestorTools")
      );
      return <InvestorTools />;
    }

    // New dashboard components
    if (activeSection === "behavioral") return <BehavioralInsight />;
    if (activeSection === "badges") return <Badges />;
    if (activeSection === "academic") return <AcademicSupport />;
    if (activeSection === "challenges") return <AIKnowledgeChat />;
    if (activeSection === "planner") return <DreamPlanner />;
    if (activeSection === "suggestions") return <CareerSuggestion />;
    if (activeSection === "insights") return <UbongInsight />;
    if (activeSection === "strengths") return <StrengthWeakness />;

    // Examination Preparation
    if (activeSection === "upload-materials") return <UploadMaterials />;
    if (activeSection === "practice-questions") return <PracticeQuestions />;
    if (activeSection === "study-guides") return <StudyGuides />;
    if (activeSection === "exam-insights") return <ExamInsights />;

    // Placeholder for remaining sections
    return (
      <Card>
        <CardHeader>
          <CardTitle className='capitalize'>
            {typeof activeSection === "string"
              ? activeSection.replace(/-/g, " ")
              : "Module"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
              <Star className='h-8 w-8 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-foreground mb-2'>
              {typeof activeSection === "string"
                ? activeSection.charAt(0).toUpperCase() +
                  activeSection.slice(1).replace(/-/g, " ")
                : "Module"}{" "}
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
        <Sidebar className='border-r border-border hidden md:flex'>
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
            {filteredSidebarItems.map((group, index) => {
              // Skip groups with no items
              if (
                !group ||
                !Array.isArray(group.items) ||
                group.items.length === 0
              ) {
                return null;
              }

              return (
                <SidebarGroup key={`${index}-${String(group.title)}`}>
                  <SidebarGroupLabel>{String(group.title)}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item, i) => {
                        // Skip invalid items
                        if (
                          !item ||
                          typeof item !== "object" ||
                          !item.id ||
                          !item.title
                        ) {
                          console.warn(
                            "⚠️ Invalid sidebar item:",
                            item,
                            "in group:",
                            group.title,
                            "index:",
                            i
                          );
                          return null;
                        }

                        // Ensure id and title are strings
                        const itemId = String(item.id);
                        const itemTitle = String(item.title);

                        return (
                          <SidebarMenuItem key={`${itemId}-${i}`}>
                            <SidebarMenuButton
                              onClick={() => setActiveSection(itemId)}
                              className={
                                activeSection === itemId
                                  ? "bg-primary text-primary-foreground"
                                  : ""
                              }>
                              {/* Safely render the icon */}
                              {item.icon ? (
                                (() => {
                                  try {
                                    return React.createElement(item.icon, {
                                      className: "h-4 w-4 mr-2",
                                    });
                                  } catch (err) {
                                    console.warn(
                                      "⚠️ Failed to render icon for item:",
                                      itemTitle,
                                      err
                                    );
                                    return (
                                      <span className='h-4 w-4 inline-block mr-2' />
                                    );
                                  }
                                })()
                              ) : (
                                <span className='h-4 w-4 inline-block mr-2' />
                              )}

                              <span>{itemTitle}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
          </SidebarContent>

          {/* Professional User Profile Section */}
          <div className='p-3 border-t border-border bg-muted/30'>
            <DropdownMenu>
              <DropdownMenuTrigger className='w-full focus:outline-none'>
                <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group'>
                  {/* Avatar with Initials */}
                  <Avatar className='h-10 w-10 border-2 border-primary/20 group-hover:border-primary/40 transition-colors'>
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback className='bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm'>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className='flex-1 text-left min-w-0'>
                    <div className='text-sm font-medium text-foreground truncate'>
                      {user?.name?.split(' ')[0] || 'User'}
                    </div>
                    <div className='flex items-center gap-1.5 mt-0.5'>
                      <Badge
                        variant='outline'
                        className='text-[10px] px-1.5 py-0 h-4 border-primary/30 bg-primary/5 text-primary font-medium capitalize'
                      >
                        {userPlanTier}
                      </Badge>
                    </div>
                  </div>

                  {/* Dropdown Icon */}
                  <ChevronDown className='h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0' />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align='end'
                className='w-56 mb-2'
                sideOffset={8}
              >
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>{user?.name}</p>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setActiveSection('settings')}
                  className='cursor-pointer'
                >
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem className='cursor-pointer'>
                  <svg
                    className='mr-2 h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'
                    />
                  </svg>
                  <span>Languages</span>
                </DropdownMenuItem>

                <DropdownMenuItem className='cursor-pointer'>
                  <MessageCircle className='mr-2 h-4 w-4' />
                  <span>Get Help</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Sidebar>

        <main className='flex-1 w-full min-w-0'>
          <header className='h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-6'>
            <div className='flex items-center'>
              <SidebarTrigger className='md:hidden' />
              <div className='ml-4'>
                <h1 className='text-base md:text-xl font-semibold text-foreground'>
                  {(() => {
                    if (activeSection === "overview") return "Dashboard";
                    if (typeof activeSection !== "string") return "Dashboard";
                    const formatted = activeSection.replace(/-/g, " ");
                    return (
                      formatted.charAt(0).toUpperCase() + formatted.slice(1)
                    );
                  })()}
                </h1>
              </div>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative h-10 w-10 rounded-full p-0 hover:bg-accent'>
                  <Avatar className='h-10 w-10 border-2 border-primary/20'>
                    <AvatarFallback className='bg-primary text-primary-foreground'>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className='absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-background' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {user?.name}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setActiveSection("notifications")}>
                  <Bell className='mr-2 h-4 w-4' />
                  <span>Notifications</span>
                  <Badge variant='secondary' className='ml-auto'>
                    3
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveSection("profile")}>
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveSection("settings")}>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className='text-destructive'>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <div className='p-4 md:p-6'>
            <Suspense
              fallback={
                <div className='flex items-center justify-center py-12'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                </div>
              }>
              {renderContent()}
            </Suspense>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
