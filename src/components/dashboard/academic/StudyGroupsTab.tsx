import { useEffect, useState, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Plus,
  Search,
  UserPlus,
  LogOut,
  Calendar,
  Crown,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Pin,
  Send,
  Trash2,
  Reply,
  Loader2,
  Filter,
  TrendingUp,
  Clock,
  HelpCircle,
  BookOpen,
  Megaphone,
  CheckCircle2,
  MoreVertical,
} from 'lucide-react';
import {
  academicSupportService,
  StudyGroup,
  StudyGroupMember,
  AcademicProfile,
  GroupDiscussion,
  DiscussionComment,
  DiscussionReaction,
  GroupPoll,
  PollOption,
  GroupPollVote,
} from '@/services/academicSupportService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Props {
  profile: AcademicProfile;
}

// ==============================================
// Main Component
// ==============================================
export default function StudyGroupsTab({ profile }: Props) {
  const [activeGroup, setActiveGroup] = useState<StudyGroup | null>(null);

  if (activeGroup) {
    return (
      <GroupDetailView
        group={activeGroup}
        profile={profile}
        onBack={() => setActiveGroup(null)}
      />
    );
  }

  return <GroupListView profile={profile} onSelectGroup={setActiveGroup} />;
}

// ==============================================
// Group List View (Browse / My Groups)
// ==============================================
function GroupListView({ profile, onSelectGroup }: { profile: AcademicProfile; onSelectGroup: (g: StudyGroup) => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allGroups, setAllGroups] = useState<StudyGroup[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'members'>('newest');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [myGroupIds, setMyGroupIds] = useState<Set<string>>(new Set());

  const [newGroup, setNewGroup] = useState({
    name: '', subject: '', description: '', max_members: 20,
    schedule_day: '', schedule_time: '', is_recurring: true,
  });

  const subjects = profile.subjects_need_help.map(s => s.name);
  const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => { loadGroups(); }, []);

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

  // Filter and sort
  const filteredGroups = allGroups
    .filter(g => {
      const matchesSearch = !searchQuery ||
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = !subjectFilter || g.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.member_count - a.member_count;
      if (sortBy === 'members') return b.member_count - a.member_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Study Groups
          </h3>
          <p className="text-sm text-muted-foreground">
            {allGroups.length} groups available, {myGroups.length} joined
          </p>
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
                <Input value={newGroup.name} onChange={e => setNewGroup(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Math Study Circle" />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <select value={newGroup.subject} onChange={e => setNewGroup(p => ({ ...p, subject: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="General">General</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea value={newGroup.description} onChange={e => setNewGroup(p => ({ ...p, description: e.target.value }))} placeholder="What will this group focus on? What topics?" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Max Members</label>
                  <Input type="number" value={newGroup.max_members} onChange={e => setNewGroup(p => ({ ...p, max_members: parseInt(e.target.value) || 20 }))} min={2} max={50} />
                </div>
                <div>
                  <label className="text-sm font-medium">Meeting Day</label>
                  <select value={newGroup.schedule_day} onChange={e => setNewGroup(p => ({ ...p, schedule_day: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                    <option value="">Select day</option>
                    {DAYS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Meeting Time</label>
                <Input type="time" value={newGroup.schedule_time} onChange={e => setNewGroup(p => ({ ...p, schedule_time: e.target.value }))} />
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
            <CardDescription>Click a group to view discussions and participate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {myGroups.map(g => (
                <div
                  key={g.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => onSelectGroup(g)}>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{g.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{g.subject}</Badge>
                    </div>
                    {g.created_by === user?.id && (
                      <Badge variant="outline" className="text-xs gap-1 flex-shrink-0 ml-2">
                        <Crown className="h-3 w-3" />Admin
                      </Badge>
                    )}
                  </div>
                  {g.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{g.description}</p>}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />{g.member_count}/{g.max_members}
                    </span>
                    {g.schedule_day && (
                      <span className="text-xs text-primary capitalize flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {g.schedule_day}s {g.schedule_time}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={(e) => { e.stopPropagation(); onSelectGroup(g); }}>
                      <MessageSquare className="h-3 w-3 mr-1" />Open
                    </Button>
                    {g.created_by !== user?.id && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={(e) => { e.stopPropagation(); handleLeaveGroup(g.id); }}>
                        <LogOut className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
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
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, subject, or description..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="px-3 py-2 border rounded-md bg-background text-sm">
                <option value="">All Subjects</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="General">General</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-3 py-2 border rounded-md bg-background text-sm">
                <option value="newest">Newest</option>
                <option value="popular">Most Members</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''} found</p>

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
                  <div key={g.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm">{g.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">{g.subject}</Badge>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-xs text-muted-foreground">{g.member_count}/{g.max_members}</span>
                        {g.member_count >= g.max_members * 0.8 && !isFull && (
                          <p className="text-[10px] text-orange-500">Almost full</p>
                        )}
                      </div>
                    </div>
                    {g.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{g.description}</p>}
                    {g.schedule_day && (
                      <p className="text-xs text-muted-foreground mt-1 capitalize flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{g.schedule_day}s at {g.schedule_time}
                      </p>
                    )}
                    {isMember ? (
                      <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => onSelectGroup(g)}>
                        <MessageSquare className="h-3 w-3 mr-1" />Open Group
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        disabled={isFull || joiningId === g.id}
                        onClick={() => handleJoinGroup(g.id)}>
                        {joiningId === g.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <UserPlus className="h-3 w-3 mr-1" />}
                        {isFull ? 'Full' : 'Join Group'}
                      </Button>
                    )}
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

// ==============================================
// Group Detail View
// ==============================================
function GroupDetailView({ group, profile, onBack }: { group: StudyGroup; profile: AcademicProfile; onBack: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('discussions');
  const [members, setMembers] = useState<StudyGroupMember[]>([]);
  const [memberNames, setMemberNames] = useState<Record<string, string>>({});
  const isAdmin = group.created_by === user?.id;

  useEffect(() => {
    loadMembers();
  }, [group.id]);

  const loadMembers = async () => {
    try {
      const data = await academicSupportService.getGroupMembers(group.id);
      setMembers(data);
      const names = await academicSupportService.getAuthorNames(data.map(m => m.user_id));
      setMemberNames(names);
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Group Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="mt-0.5">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold">{group.name}</h2>
            <Badge variant="secondary">{group.subject}</Badge>
            {isAdmin && (
              <Badge variant="outline" className="gap-1"><Crown className="h-3 w-3" />Admin</Badge>
            )}
          </div>
          {group.description && (
            <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{group.member_count} members</span>
            {group.schedule_day && (
              <span className="flex items-center gap-1 capitalize"><Calendar className="h-3 w-3" />{group.schedule_day}s at {group.schedule_time}</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="discussions" className="gap-1">
            <MessageSquare className="h-3.5 w-3.5" />Discussions
          </TabsTrigger>
          <TabsTrigger value="polls" className="gap-1">
            <BarChart3 className="h-3.5 w-3.5" />Polls
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-1">
            <Users className="h-3.5 w-3.5" />Members ({group.member_count})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="mt-4">
          <DiscussionsPanel groupId={group.id} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="polls" className="mt-4">
          <PollsPanel groupId={group.id} />
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <MembersPanel members={members} memberNames={memberNames} creatorId={group.created_by} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ==============================================
// Discussions Panel
// ==============================================
function DiscussionsPanel({ groupId, isAdmin }: { groupId: string; isAdmin: boolean }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<GroupDiscussion[]>([]);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [myReactions, setMyReactions] = useState<Record<string, 'like' | 'dislike'>>({});
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'discussion' });

  useEffect(() => { loadDiscussions(); }, [groupId, filterType, sortBy]);

  const loadDiscussions = async () => {
    try {
      const data = await academicSupportService.getDiscussions(groupId, {
        type: filterType || undefined,
        sortBy,
      });
      setDiscussions(data);

      // Load author names
      const authorIds = [...new Set(data.map(d => d.author_id))];
      const names = await academicSupportService.getAuthorNames(authorIds);
      setAuthorNames(names);

      // Load my reactions
      if (data.length > 0) {
        const reactions = await academicSupportService.getMyDiscussionReactions(data.map(d => d.id));
        const rMap: Record<string, 'like' | 'dislike'> = {};
        reactions.forEach(r => { if (r.discussion_id) rMap[r.discussion_id] = r.reaction_type as any; });
        setMyReactions(rMap);
      }
    } catch (error) {
      console.error('Failed to load discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({ title: 'Error', description: 'Title and content are required', variant: 'destructive' });
      return;
    }
    try {
      await academicSupportService.createDiscussion({
        group_id: groupId,
        title: newPost.title,
        content: newPost.content,
        type: newPost.type,
      });
      toast({ title: 'Posted', description: 'Your discussion has been posted!' });
      setShowCreate(false);
      setNewPost({ title: '', content: '', type: 'discussion' });
      await loadDiscussions();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleReaction = async (discussionId: string, type: 'like' | 'dislike') => {
    try {
      await academicSupportService.toggleReaction({ discussionId }, type);
      await loadDiscussions();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await academicSupportService.deleteDiscussion(id);
      toast({ title: 'Deleted', description: 'Discussion removed' });
      await loadDiscussions();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handlePin = async (id: string, pinned: boolean) => {
    try {
      await academicSupportService.pinDiscussion(id, pinned);
      await loadDiscussions();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'question': return <HelpCircle className="h-3.5 w-3.5 text-blue-500" />;
      case 'resource': return <BookOpen className="h-3.5 w-3.5 text-green-500" />;
      case 'announcement': return <Megaphone className="h-3.5 w-3.5 text-orange-500" />;
      default: return <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case 'question': return 'Question';
      case 'resource': return 'Resource';
      case 'announcement': return 'Announcement';
      default: return 'Discussion';
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-1.5 border rounded-md bg-background text-sm">
            <option value="">All Types</option>
            <option value="discussion">Discussions</option>
            <option value="question">Questions</option>
            <option value="resource">Resources</option>
            <option value="announcement">Announcements</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-3 py-1.5 border rounded-md bg-background text-sm">
            <option value="newest">Newest First</option>
            <option value="popular">Most Liked</option>
          </select>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
              <DialogDescription>Start a discussion, ask a question, or share a resource</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-sm font-medium">Post Type</label>
                <div className="flex gap-2 mt-1">
                  {['discussion', 'question', 'resource', 'announcement'].map(t => (
                    <button
                      key={t}
                      onClick={() => setNewPost(p => ({ ...p, type: t }))}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        newPost.type === t ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                      }`}>
                      {typeIcon(t)}
                      {typeLabel(t)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} placeholder="What's this about?" />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} placeholder="Share your thoughts, questions, or resources..." rows={5} />
              </div>
              <Button onClick={handleCreatePost} className="w-full">
                <Send className="h-4 w-4 mr-2" />Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Discussion List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
        </div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No discussions yet</p>
          <p className="text-sm mt-1">Be the first to start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {discussions.map(d => (
            <div key={d.id}>
              <Card className={`transition-shadow hover:shadow-sm ${d.is_pinned ? 'border-primary/30 bg-primary/5' : ''}`}>
                <CardContent className="p-4">
                  {/* Post Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                      {(authorNames[d.author_id] || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{authorNames[d.author_id] || 'Anonymous'}</span>
                        <div className="flex items-center gap-1">
                          {typeIcon(d.type)}
                          <Badge variant="outline" className="text-[10px] h-5">{typeLabel(d.type)}</Badge>
                        </div>
                        {d.is_pinned && (
                          <Badge variant="secondary" className="text-[10px] h-5 gap-0.5">
                            <Pin className="h-2.5 w-2.5" />Pinned
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{timeAgo(d.created_at)}</span>
                      </div>
                      <h4 className="font-semibold text-sm mt-1">{d.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{d.content}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-1 mt-3 -ml-2">
                        <button
                          onClick={() => handleReaction(d.id, 'like')}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
                            myReactions[d.id] === 'like' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'hover:bg-accent text-muted-foreground'
                          }`}>
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {d.like_count > 0 && d.like_count}
                        </button>
                        <button
                          onClick={() => handleReaction(d.id, 'dislike')}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
                            myReactions[d.id] === 'dislike' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'hover:bg-accent text-muted-foreground'
                          }`}>
                          <ThumbsDown className="h-3.5 w-3.5" />
                          {d.dislike_count > 0 && d.dislike_count}
                        </button>
                        <button
                          onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs hover:bg-accent text-muted-foreground transition-colors">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {d.comment_count > 0 ? `${d.comment_count} comments` : 'Comment'}
                        </button>
                        {(d.author_id === user?.id || isAdmin) && (
                          <>
                            {isAdmin && (
                              <button
                                onClick={() => handlePin(d.id, !d.is_pinned)}
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs hover:bg-accent text-muted-foreground transition-colors">
                                <Pin className="h-3.5 w-3.5" />
                                {d.is_pinned ? 'Unpin' : 'Pin'}
                              </button>
                            )}
                            {d.author_id === user?.id && (
                              <button
                                onClick={() => handleDelete(d.id)}
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs hover:bg-destructive/10 text-destructive transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              {expandedId === d.id && (
                <CommentsSection discussionId={d.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==============================================
// Comments Section
// ==============================================
function CommentsSection({ discussionId }: { discussionId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [myReactions, setMyReactions] = useState<Record<string, 'like' | 'dislike'>>({});
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadComments(); }, [discussionId]);

  const loadComments = async () => {
    try {
      const data = await academicSupportService.getComments(discussionId);
      setComments(data);

      const authorIds = [...new Set(data.map(c => c.author_id))];
      const names = await academicSupportService.getAuthorNames(authorIds);
      setAuthorNames(names);

      if (data.length > 0) {
        const reactions = await academicSupportService.getMyReactions(undefined, data.map(c => c.id));
        const rMap: Record<string, 'like' | 'dislike'> = {};
        reactions.forEach(r => { if (r.comment_id) rMap[r.comment_id] = r.reaction_type as any; });
        setMyReactions(rMap);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (parentId?: string) => {
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await academicSupportService.createComment({
        discussion_id: discussionId,
        content: content.trim(),
        parent_comment_id: parentId,
      });
      if (parentId) {
        setReplyContent('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }
      await loadComments();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (commentId: string, type: 'like' | 'dislike') => {
    try {
      await academicSupportService.toggleReaction({ commentId }, type);
      await loadComments();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await academicSupportService.deleteComment(id);
      await loadComments();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const topLevelComments = comments.filter(c => !c.parent_comment_id);
  const getReplies = (parentId: string) => comments.filter(c => c.parent_comment_id === parentId);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  const renderComment = (comment: DiscussionComment, depth: number = 0) => {
    const replies = getReplies(comment.id);
    return (
      <div key={comment.id} className={depth > 0 ? 'ml-6 border-l-2 border-muted pl-3' : ''}>
        <div className="py-2">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
              {(authorNames[comment.author_id] || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{authorNames[comment.author_id] || 'Anonymous'}</span>
                <span className="text-[10px] text-muted-foreground">{timeAgo(comment.created_at)}</span>
              </div>
              <p className="text-sm mt-0.5">{comment.content}</p>
              <div className="flex items-center gap-0.5 mt-1 -ml-1.5">
                <button
                  onClick={() => handleReaction(comment.id, 'like')}
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                    myReactions[comment.id] === 'like' ? 'text-green-600' : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  <ThumbsUp className="h-3 w-3" />{comment.like_count > 0 && comment.like_count}
                </button>
                <button
                  onClick={() => handleReaction(comment.id, 'dislike')}
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                    myReactions[comment.id] === 'dislike' ? 'text-red-600' : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  <ThumbsDown className="h-3 w-3" />{comment.dislike_count > 0 && comment.dislike_count}
                </button>
                {depth === 0 && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    <Reply className="h-3 w-3" />Reply
                  </button>
                )}
                {comment.author_id === user?.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center px-1.5 py-0.5 rounded text-[11px] text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Reply input */}
              {replyingTo === comment.id && (
                <div className="flex gap-2 mt-2">
                  <Input
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="text-sm h-8"
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(comment.id); } }}
                  />
                  <Button size="sm" className="h-8" onClick={() => handleSubmitComment(comment.id)} disabled={!replyContent.trim() || submitting}>
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        {replies.map(r => renderComment(r, depth + 1))}
      </div>
    );
  };

  return (
    <div className="ml-4 mr-0 mb-3 p-3 bg-muted/30 rounded-b-lg border border-t-0">
      {loading ? (
        <div className="py-4 text-center">
          <Loader2 className="h-4 w-4 mx-auto animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {topLevelComments.length > 0 && (
            <div className="space-y-1 mb-3">
              {topLevelComments.map(c => renderComment(c))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="text-sm h-8"
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); } }}
            />
            <Button size="sm" className="h-8" onClick={() => handleSubmitComment()} disabled={!newComment.trim() || submitting}>
              {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ==============================================
// Polls Panel
// ==============================================
function PollsPanel({ groupId }: { groupId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [polls, setPolls] = useState<GroupPoll[]>([]);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [voteCounts, setVoteCounts] = useState<Record<string, Record<number, number>>>({});
  const [myVotes, setMyVotes] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    is_anonymous: false,
    allows_multiple: false,
  });

  useEffect(() => { loadPolls(); }, [groupId]);

  const loadPolls = async () => {
    try {
      const data = await academicSupportService.getPolls(groupId);
      setPolls(data);

      const authorIds = [...new Set(data.map(p => p.author_id))];
      const names = await academicSupportService.getAuthorNames(authorIds);
      setAuthorNames(names);

      // Load vote counts and my votes for each poll
      const countsMap: Record<string, Record<number, number>> = {};
      const votesMap: Record<string, number[]> = {};
      await Promise.all(data.map(async (poll) => {
        const [counts, votes] = await Promise.all([
          academicSupportService.getPollVoteCounts(poll.id),
          academicSupportService.getMyPollVotes(poll.id),
        ]);
        countsMap[poll.id] = counts;
        votesMap[poll.id] = votes.map(v => v.option_index);
      }));
      setVoteCounts(countsMap);
      setMyVotes(votesMap);
    } catch (error) {
      console.error('Failed to load polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async () => {
    const validOptions = newPoll.options.filter(o => o.trim());
    if (!newPoll.question.trim() || validOptions.length < 2) {
      toast({ title: 'Error', description: 'Question and at least 2 options are required', variant: 'destructive' });
      return;
    }
    try {
      await academicSupportService.createPoll({
        group_id: groupId,
        question: newPoll.question,
        options: validOptions.map(o => ({ text: o.trim() })),
        is_anonymous: newPoll.is_anonymous,
        allows_multiple: newPoll.allows_multiple,
      });
      toast({ title: 'Poll created', description: 'Your poll is live!' });
      setShowCreate(false);
      setNewPoll({ question: '', options: ['', ''], is_anonymous: false, allows_multiple: false });
      await loadPolls();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      const currentVotes = myVotes[pollId] || [];
      if (currentVotes.includes(optionIndex)) {
        await academicSupportService.removePollVote(pollId, optionIndex);
      } else {
        await academicSupportService.votePoll(pollId, optionIndex);
      }
      await loadPolls();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${Math.max(1, mins)}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{polls.length} poll{polls.length !== 1 ? 's' : ''}</p>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Create Poll</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Poll</DialogTitle>
              <DialogDescription>Ask the group and gather opinions</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Input value={newPoll.question} onChange={e => setNewPoll(p => ({ ...p, question: e.target.value }))} placeholder="What do you want to ask?" />
              </div>
              <div>
                <label className="text-sm font-medium">Options</label>
                <div className="space-y-2 mt-1">
                  {newPoll.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={opt}
                        onChange={e => {
                          const opts = [...newPoll.options];
                          opts[i] = e.target.value;
                          setNewPoll(p => ({ ...p, options: opts }));
                        }}
                        placeholder={`Option ${i + 1}`}
                      />
                      {newPoll.options.length > 2 && (
                        <Button variant="ghost" size="sm" className="h-9 px-2" onClick={() => setNewPoll(p => ({ ...p, options: p.options.filter((_, j) => j !== i) }))}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {newPoll.options.length < 6 && (
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setNewPoll(p => ({ ...p, options: [...p.options, ''] }))}>
                      <Plus className="h-3 w-3 mr-1" />Add Option
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={newPoll.allows_multiple} onChange={e => setNewPoll(p => ({ ...p, allows_multiple: e.target.checked }))} />
                  Allow multiple selections
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={newPoll.is_anonymous} onChange={e => setNewPoll(p => ({ ...p, is_anonymous: e.target.checked }))} />
                  Anonymous voting
                </label>
              </div>
              <Button onClick={handleCreatePoll} className="w-full">Create Poll</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8"><Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" /></div>
      ) : polls.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No polls yet</p>
          <p className="text-sm mt-1">Create a poll to get the group's opinion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map(poll => {
            const counts = voteCounts[poll.id] || {};
            const voted = myVotes[poll.id] || [];
            const hasVoted = voted.length > 0;
            const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);
            const isExpired = poll.ends_at && new Date(poll.ends_at) < new Date();

            return (
              <Card key={poll.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-sm">{poll.question}</h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">by {authorNames[poll.author_id] || 'Anonymous'}</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(poll.created_at)}</span>
                        {poll.allows_multiple && <Badge variant="outline" className="text-[10px] h-4">Multi-select</Badge>}
                        {isExpired && <Badge variant="destructive" className="text-[10px] h-4">Ended</Badge>}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="space-y-2 mt-3">
                    {(poll.options as PollOption[]).map((opt, i) => {
                      const count = counts[i] || 0;
                      const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                      const isSelected = voted.includes(i);

                      return (
                        <button
                          key={i}
                          onClick={() => !isExpired && handleVote(poll.id, i)}
                          disabled={!!isExpired || (hasVoted && !poll.allows_multiple && !isSelected)}
                          className={`w-full text-left p-2.5 rounded-lg border text-sm transition-all relative overflow-hidden ${
                            isSelected ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                          } ${isExpired ? 'opacity-75' : ''}`}>
                          {/* Progress bar background */}
                          {(hasVoted || isExpired) && (
                            <div
                              className={`absolute inset-y-0 left-0 transition-all ${isSelected ? 'bg-primary/10' : 'bg-muted/50'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          )}
                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                              <span>{opt.text}</span>
                            </div>
                            {(hasVoted || isExpired) && (
                              <span className="text-xs font-medium text-muted-foreground">{percentage}%</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==============================================
// Members Panel
// ==============================================
function MembersPanel({ members, memberNames, creatorId }: {
  members: StudyGroupMember[];
  memberNames: Record<string, string>;
  creatorId: string;
}) {
  return (
    <div className="space-y-2">
      {members.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          No members yet
        </div>
      ) : (
        members.map(m => (
          <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {(memberNames[m.user_id] || 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{memberNames[m.user_id] || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground">Joined {new Date(m.joined_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {m.role === 'admin' && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Crown className="h-3 w-3" />Admin
                </Badge>
              )}
              {m.user_id === creatorId && (
                <Badge variant="secondary" className="text-xs">Creator</Badge>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
