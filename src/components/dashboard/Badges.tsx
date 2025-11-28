import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { badgeService, BadgeWithProgress, BadgeStats, BadgeCategory } from '@/services/badgeService';
import {
  Award,
  Trophy,
  Medal,
  Star,
  Crown,
  Sparkles,
  CheckCircle,
  Lock,
  TrendingUp,
  Target,
  BookOpen,
  Brain,
  Calendar,
  Briefcase,
  Users,
  Zap,
  Flame,
  Rocket,
  PartyPopper,
  Heart,
  Coins,
  Gem,
  Diamond,
  Compass,
  FileText,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Award, Trophy, Medal, Star, Crown, Sparkles, CheckCircle,
  Target, BookOpen, Brain, Calendar, Briefcase, Users, Zap,
  Flame, Rocket, PartyPopper, Heart, Coins, Gem, Diamond,
  Compass, FileText, GraduationCap, TrendingUp,
};

const TIER_COLORS = {
  bronze: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500',
    text: 'text-orange-600',
    glow: 'shadow-orange-500/20',
    gradient: 'from-orange-500/5 to-amber-500/5',
  },
  silver: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500',
    text: 'text-purple-600',
    glow: 'shadow-purple-500/20',
    gradient: 'from-purple-500/5 to-violet-500/5',
  },
  gold: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    text: 'text-yellow-600',
    glow: 'shadow-yellow-500/20',
    gradient: 'from-yellow-500/5 to-amber-500/5',
  },
};

const CATEGORY_COLORS: Record<BadgeCategory, string> = {
  learning: 'text-blue-600',
  assessment: 'text-purple-600',
  activity: 'text-green-600',
  career_readiness: 'text-cyan-600',
  milestone: 'text-orange-600',
  achievement: 'text-pink-600',
};

export const Badges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<BadgeWithProgress[]>([]);
  const [stats, setStats] = useState<BadgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (user?.id) {
      loadBadges();
    }
  }, [user]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const [badgesData, statsData] = await Promise.all([
        badgeService.getBadgesWithProgress(user!.id),
        badgeService.getBadgeStats(user!.id),
      ]);
      setBadges(badgesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your badges...</p>
        </div>
      </div>
    );
  }

  const filteredBadges = selectedCategory === 'all'
    ? badges
    : badges.filter(b => b.category === selectedCategory);

  const earnedBadges = filteredBadges.filter(b => b.isEarned);
  const lockedBadges = filteredBadges.filter(b => !b.isEarned);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-lg">
            <Trophy className="h-8 w-8 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Achievement Badges</h1>
            <p className="text-muted-foreground mt-1">Track your progress and celebrate milestones</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-600">{stats.earnedBadges}</div>
          <div className="text-xs text-muted-foreground">Badges Earned</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-blue-600" />
              <p className="text-xs text-muted-foreground">Total Badges</p>
            </div>
            <p className="text-2xl font-bold">{stats.totalBadges}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Medal className="h-4 w-4 text-orange-600" />
              <p className="text-xs text-muted-foreground">Bronze</p>
            </div>
            <p className="text-2xl font-bold text-orange-600">{stats.bronzeBadges}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Medal className="h-4 w-4 text-purple-600" />
              <p className="text-xs text-muted-foreground">Silver</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.silverBadges}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <p className="text-xs text-muted-foreground">Gold</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.goldBadges}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-4 w-4 text-green-600" />
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.totalPoints}</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Badges Showcase */}
      {stats.featuredBadges.length > 0 && (
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 rounded-full -mr-32 -mt-32"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              Featured Achievements
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">Your most impressive accomplishments</p>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.featuredBadges.map((userBadge) => {
                const badge = userBadge.badge;
                const IconComponent = ICONS[badge.icon] || Award;
                const tierColor = TIER_COLORS[badge.tier];

                return (
                  <div
                    key={userBadge.id}
                    className={`p-6 rounded-lg border-2 ${tierColor.border} bg-gradient-to-br ${tierColor.gradient} hover:shadow-lg transition-all group relative overflow-hidden`}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                      {/* Icon */}
                      <div className={`p-4 rounded-full ${tierColor.bg} ring-4 ring-${badge.tier === 'gold' ? 'yellow' : badge.tier === 'silver' ? 'purple' : 'orange'}-500/20`}>
                        <IconComponent className={`h-10 w-10 ${tierColor.text}`} />
                      </div>

                      {/* Badge name */}
                      <h3 className="font-bold text-lg">{badge.name}</h3>

                      {/* Tier badge */}
                      <Badge className={`${tierColor.bg} ${tierColor.text} border-${badge.tier === 'gold' ? 'yellow' : badge.tier === 'silver' ? 'purple' : 'orange'}-300 capitalize`}>
                        {badge.tier} Badge
                      </Badge>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">{badge.description}</p>

                      {/* Earned date */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Earned {new Date(userBadge.earned_at).toLocaleDateString()}
                      </div>

                      {/* Points */}
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="font-bold text-yellow-600">+{badge.points} points</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Badges</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="career_readiness">Career Ready</TabsTrigger>
          <TabsTrigger value="milestone">Milestones</TabsTrigger>
          <TabsTrigger value="achievement">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Earned Badges ({earnedBadges.length})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-2">Congratulations on your achievements!</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {earnedBadges.map((badge) => {
                    const IconComponent = ICONS[badge.icon] || Award;
                    const tierColor = TIER_COLORS[badge.tier];

                    return (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg border-2 ${tierColor.border} bg-gradient-to-br ${tierColor.gradient} hover:shadow-md transition-all group cursor-pointer`}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className={`p-3 rounded-full ${tierColor.bg}`}>
                            <IconComponent className={`h-6 w-6 ${tierColor.text}`} />
                          </div>
                          <h4 className="font-semibold text-sm line-clamp-2">{badge.name}</h4>
                          <Badge variant="outline" className={`text-xs capitalize ${tierColor.text}`}>
                            {badge.tier}
                          </Badge>
                          <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            <span>Earned</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Locked Badges (In Progress) */}
          {lockedBadges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Available Badges ({lockedBadges.length})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-2">Keep going to unlock these achievements!</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lockedBadges.map((badge) => {
                    const IconComponent = ICONS[badge.icon] || Award;
                    const tierColor = TIER_COLORS[badge.tier];

                    return (
                      <div
                        key={badge.id}
                        className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50/50 hover:border-gray-300 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="p-3 rounded-full bg-gray-200">
                              <IconComponent className="h-6 w-6 text-gray-400" />
                            </div>
                            {badge.progress < 100 && (
                              <div className="absolute -bottom-1 -right-1 p-1 bg-blue-500 rounded-full">
                                <Lock className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-sm">{badge.name}</h4>
                                <Badge variant="outline" className={`text-xs mt-1 capitalize ${tierColor.text}`}>
                                  {badge.tier} • {badge.points} pts
                                </Badge>
                              </div>
                              <Badge className={CATEGORY_COLORS[badge.category]} variant="outline">
                                {badge.category.replace('_', ' ')}
                              </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground">{badge.description}</p>

                            {/* Progress */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold">{badge.progress}%</span>
                              </div>
                              <Progress value={badge.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground">
                                {badge.currentValue} / {badge.requirement_value} {badge.requirement_type.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty state */}
          {earnedBadges.length === 0 && lockedBadges.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No badges in this category</h3>
                <p className="text-sm text-muted-foreground">Try selecting a different category</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Progress Summary */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Overall Badge Completion</h3>
                <p className="text-sm text-muted-foreground">
                  You've earned {stats.earnedBadges} out of {stats.totalBadges} badges
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{stats.completionPercentage}%</div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={stats.completionPercentage} className="h-3 mt-4" />
        </CardContent>
      </Card>
    </div>
  );
};
