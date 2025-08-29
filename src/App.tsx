import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Features from "./pages/public/Features";
import Services from "./pages/public/Services";
import Partners from "./pages/public/Partners";
import Contact from "./pages/public/Contact";

// Auth Pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";

// Dashboard Pages
import YouthDashboard from "./pages/dashboard/YouthDashboard";
import MentorDashboard from "./pages/dashboard/MentorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// Onboarding
import OnboardingWizard from "./pages/onboarding/OnboardingWizard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/services" element={<Services />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Auth Routes - redirect if already logged in */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={
              <ProtectedRoute requireAuth={false}>
                <SignUp />
              </ProtectedRoute>
            } />
            
            {/* Onboarding - requires auth */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingWizard />
              </ProtectedRoute>
            } />
            
            {/* Dashboard Routes - role-based access */}
            <Route path="/dashboard/youth" element={
              <ProtectedRoute requiredRole="youth">
                <YouthDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/mentor" element={
              <ProtectedRoute requiredRole="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;