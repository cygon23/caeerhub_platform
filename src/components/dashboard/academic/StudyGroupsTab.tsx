import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Plus,
  Search,
  UserPlus,
  LogOut,
  Calendar,
  Crown,
} from 'lucide-react';
import {
  academicSupportService,
  StudyGroup,
  AcademicProfile,
} from '@/services/academicSupportService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Props {
  profile: AcademicProfile;
}

export default function StudyGroupsTab({ profile }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allGroups, setAllGroups] = useState<StudyGroup[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [myGroupIds, setMyGroupIds] = useState<Set<string>>(new Set());

  // Create form
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
    description: '',
    max_members: 20,
    schedule_day: '',
    schedule_time: '',
    is_recurring: true,
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const [all, mine] = await Promise.all([
        academicSupportService.getGroups(),
        academicSupportService.getMyGroups(),
      ]);
      setAllGroups(all);
      setMyGroups(mine);
      setMyGroupIds(new Set(mine.map(g => g.id)));
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.subject.trim()) {
      toast({ title: 'Error', description: 'Name and subject are required', variant: 'destructive' });
      return;
    }
    try {
      await academicSupportService.createGroup(newGroup);
      toast({ title: 'Group created', description: `"${newGroup.name}" is ready!` });
      setShowCreate(false);
      setNewGroup({ name: '', subject: '', description: '', max_members: 20, schedule_day: '', schedule_time: '', is_recurring: true });
      await loadGroups();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    setJoiningId(groupId);
    try {
      await academicSupportService.joinGroup(groupId);
      toast({ title: 'Joined', description: 'You have joined the group!' });
      await loadGroups();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setJoiningId(null);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      await academicSupportService.leaveGroup(groupId);
      toast({ title: 'Left group', description: 'You have left the group' });
      await loadGroups();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const subjects = profile.subjects_need_help.map(s => s.name);
  const filteredGroups = allGroups.filter(g => {
    const matchesSearch = !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !subjectFilter || g.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Study Groups
          </h3>
          <p className="text-sm text-muted-foreground">Create or join groups for collaborative learning</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Create Group</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
              <DialogDescription>Set up a new group for collaborative study</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-sm font-medium">Group Name</label>
                <Input
                  value={newGroup.name}
                  onChange={e => setNewGroup(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Math Study Circle"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <select
                  value={newGroup.subject}
                  onChange={e => setNewGroup(p => ({ ...p, subject: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Description (optional)</label>
                <Textarea
                  value={newGroup.description}
                  onChange={e => setNewGroup(p => ({ ...p, description: e.target.value }))}
                  placeholder="What will this group focus on?"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Max Members</label>
                  <Input
                    type="number"
                    value={newGroup.max_members}
                    onChange={e => setNewGroup(p => ({ ...p, max_members: parseInt(e.target.value) || 20 }))}
                    min={2}
                    max={50}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Meeting Day</label>
                  <select
                    value={newGroup.schedule_day}
                    onChange={e => setNewGroup(p => ({ ...p, schedule_day: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                    <option value="">Select day</option>
                    {DAYS.map(d => <option key={d} value={d} className="capitalize">{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Meeting Time</label>
                <Input
                  type="time"
                  value={newGroup.schedule_time}
                  onChange={e => setNewGroup(p => ({ ...p, schedule_time: e.target.value }))}
                />
              </div>
              <Button onClick={handleCreateGroup} className="w-full">Create Group</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* My Groups */}
      {myGroups.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">My Groups ({myGroups.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {myGroups.map(g => (
                <div key={g.id} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{g.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{g.subject}</Badge>
                    </div>
                    {g.created_by === user?.id && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Crown className="h-3 w-3" />Admin
                      </Badge>
                    )}
                  </div>
                  {g.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{g.description}</p>}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t">
                    <span className="text-xs text-muted-foreground">{g.member_count}/{g.max_members} members</span>
                    {g.schedule_day && (
                      <span className="text-xs text-primary capitalize flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {g.schedule_day}s {g.schedule_time}
                      </span>
                    )}
                  </div>
                  {g.created_by !== user?.id && (
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-destructive" onClick={() => handleLeaveGroup(g.id)}>
                      <LogOut className="h-3 w-3 mr-1" />Leave
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Browse Groups */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Browse Groups</CardTitle>
          <CardDescription>Find and join groups in your subjects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search groups..."
                className="pl-9"
              />
            </div>
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm">
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Group List */}
          {filteredGroups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No groups found. Be the first to create one!
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredGroups.map(g => {
                const isMember = myGroupIds.has(g.id);
                const isFull = g.member_count >= g.max_members;
                return (
                  <div key={g.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{g.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">{g.subject}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{g.member_count}/{g.max_members}</span>
                    </div>
                    {g.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{g.description}</p>}
                    {g.schedule_day && (
                      <p className="text-xs text-muted-foreground mt-1 capitalize flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {g.schedule_day}s at {g.schedule_time}
                      </p>
                    )}
                    <Button
                      size="sm"
                      variant={isMember ? 'secondary' : 'default'}
                      className="w-full mt-3"
                      disabled={isMember || isFull || joiningId === g.id}
                      onClick={() => handleJoinGroup(g.id)}>
                      {isMember ? 'Joined' : isFull ? 'Full' : (
                        <><UserPlus className="h-3 w-3 mr-1" />Join Group</>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
