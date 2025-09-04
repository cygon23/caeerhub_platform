import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Users, MessageCircle, Star, Video, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  rating: number;
  sessions_count: number;
  bio: string;
  avatar_url?: string;
}

interface MentorshipSession {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  session_type: string;
  mentor: {
    name: string;
    expertise: string;
  };
  notes?: string;
}

export default function Mentorship() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'sessions' | 'find-mentor'>('sessions');
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [availableMentors] = useState<Mentor[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      expertise: ['Technology', 'Entrepreneurship', 'Leadership'],
      rating: 4.9,
      sessions_count: 156,
      bio: 'Former tech executive with 15+ years experience helping young professionals navigate their careers.',
      avatar_url: undefined
    },
    {
      id: '2',
      name: 'James Mwangi',
      expertise: ['Business Development', 'Finance', 'Strategy'],
      rating: 4.8,
      sessions_count: 98,
      bio: 'Business consultant and mentor specializing in startup growth and financial planning.',
      avatar_url: undefined
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      expertise: ['Marketing', 'Communications', 'Brand Strategy'],
      rating: 4.9,
      sessions_count: 142,
      bio: 'Marketing director with expertise in digital marketing and brand development.',
      avatar_url: undefined
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    
    // Mock data for now since we don't have mentor data populated
    const mockSessions: MentorshipSession[] = [
      {
        id: '1',
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        duration_minutes: 60,
        status: 'scheduled',
        session_type: 'video_call',
        mentor: {
          name: 'Dr. Sarah Johnson',
          expertise: 'Technology Leadership'
        },
        notes: 'Discuss career transition to tech leadership role'
      },
      {
        id: '2',
        scheduled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration_minutes: 45,
        status: 'completed',
        session_type: 'video_call',
        mentor: {
          name: 'James Mwangi',
          expertise: 'Business Development'
        },
        notes: 'Reviewed business plan and discussed funding options'
      }
    ];
    
    setSessions(mockSessions);
  };

  const scheduleSession = async (mentorId: string) => {
    setLoading(true);
    try {
      // This would normally create a mentorship session
      toast.success('Session request sent! The mentor will confirm your booking.');
      // Refresh sessions after booking
      setTimeout(() => {
        loadSessions();
      }, 1000);
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast.error('Failed to schedule session');
    } finally {
      setLoading(false);
    }
  };

  const joinSession = (sessionId: string) => {
    // This would open the video call interface
    toast.info('Opening video call...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Mentorship Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'sessions' ? 'default' : 'outline'}
              onClick={() => setActiveTab('sessions')}
            >
              My Sessions
            </Button>
            <Button
              variant={activeTab === 'find-mentor' ? 'default' : 'outline'}
              onClick={() => setActiveTab('find-mentor')}
            >
              Find a Mentor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Mentorship Sessions</h3>
          
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No sessions scheduled</h3>
                <p className="text-muted-foreground mb-4">Book your first mentorship session to get personalized guidance</p>
                <Button onClick={() => setActiveTab('find-mentor')}>
                  Find a Mentor
                </Button>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{session.mentor.name}</h4>
                        <Badge variant="outline">{session.mentor.expertise}</Badge>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(session.scheduled_at)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {session.duration_minutes} minutes
                        </div>
                        <div className="flex items-center">
                          {session.session_type === 'video_call' ? (
                            <Video className="h-4 w-4 mr-1" />
                          ) : (
                            <Phone className="h-4 w-4 mr-1" />
                          )}
                          {session.session_type.replace('_', ' ')}
                        </div>
                      </div>

                      {session.notes && (
                        <p className="text-sm text-muted-foreground">
                          <MessageCircle className="h-4 w-4 inline mr-1" />
                          {session.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {session.status === 'scheduled' && isUpcoming(session.scheduled_at) && (
                        <Button onClick={() => joinSession(session.id)}>
                          Join Session
                        </Button>
                      )}
                      {session.status === 'completed' && (
                        <Button variant="outline">
                          View Summary
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Find Mentor Tab */}
      {activeTab === 'find-mentor' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Mentors</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableMentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={mentor.avatar_url} />
                      <AvatarFallback>
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h4 className="font-semibold">{mentor.name}</h4>
                    
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{mentor.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({mentor.sessions_count} sessions)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {mentor.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground text-center">
                      {mentor.bio}
                    </p>

                    <Button 
                      className="w-full" 
                      onClick={() => scheduleSession(mentor.id)}
                      disabled={loading}
                    >
                      {loading ? 'Booking...' : 'Book Session'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}