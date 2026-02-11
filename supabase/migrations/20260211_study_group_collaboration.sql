-- ============================================
-- Study Group Collaboration: Discussions, Comments, Reactions, Polls
-- ============================================

-- 1. Group Discussions (posts within a group)
CREATE TABLE IF NOT EXISTS group_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'discussion' CHECK (type IN ('discussion', 'question', 'resource', 'announcement')),
  is_pinned BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  dislike_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Discussion Comments
CREATE TABLE IF NOT EXISTS discussion_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES group_discussions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES discussion_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  dislike_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Reactions (for both discussions and comments)
CREATE TABLE IF NOT EXISTS discussion_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES group_discussions(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES discussion_comments(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT reaction_target_check CHECK (
    (discussion_id IS NOT NULL AND comment_id IS NULL) OR
    (discussion_id IS NULL AND comment_id IS NOT NULL)
  ),
  CONSTRAINT unique_discussion_reaction UNIQUE (user_id, discussion_id) DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT unique_comment_reaction UNIQUE (user_id, comment_id) DEFERRABLE INITIALLY DEFERRED
);

-- 4. Group Polls
CREATE TABLE IF NOT EXISTS group_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  is_anonymous BOOLEAN DEFAULT false,
  allows_multiple BOOLEAN DEFAULT false,
  ends_at TIMESTAMPTZ,
  total_votes INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Poll Votes
CREATE TABLE IF NOT EXISTS group_poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES group_polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_poll_vote UNIQUE (poll_id, user_id, option_index)
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_discussions_group ON group_discussions(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_author ON group_discussions(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_discussion ON discussion_comments(discussion_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON discussion_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_discussion ON discussion_reactions(discussion_id);
CREATE INDEX IF NOT EXISTS idx_reactions_comment ON discussion_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON discussion_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_polls_group ON group_polls(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON group_poll_votes(poll_id);

-- ============================================
-- Triggers for auto-updating counts
-- ============================================

-- Update comment_count on group_discussions
CREATE OR REPLACE FUNCTION update_discussion_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE group_discussions SET comment_count = comment_count + 1 WHERE id = NEW.discussion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE group_discussions SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.discussion_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_discussion_comment_count
AFTER INSERT OR DELETE ON discussion_comments
FOR EACH ROW EXECUTE FUNCTION update_discussion_comment_count();

-- Update like/dislike counts on discussions
CREATE OR REPLACE FUNCTION update_discussion_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.discussion_id IS NOT NULL THEN
    IF NEW.reaction_type = 'like' THEN
      UPDATE group_discussions SET like_count = like_count + 1 WHERE id = NEW.discussion_id;
    ELSE
      UPDATE group_discussions SET dislike_count = dislike_count + 1 WHERE id = NEW.discussion_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.discussion_id IS NOT NULL THEN
    IF OLD.reaction_type = 'like' THEN
      UPDATE group_discussions SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.discussion_id;
    ELSE
      UPDATE group_discussions SET dislike_count = GREATEST(dislike_count - 1, 0) WHERE id = OLD.discussion_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_discussion_reaction_count
AFTER INSERT OR DELETE ON discussion_reactions
FOR EACH ROW EXECUTE FUNCTION update_discussion_reaction_count();

-- Update like/dislike counts on comments
CREATE OR REPLACE FUNCTION update_comment_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.comment_id IS NOT NULL THEN
    IF NEW.reaction_type = 'like' THEN
      UPDATE discussion_comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE discussion_comments SET dislike_count = dislike_count + 1 WHERE id = NEW.comment_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.comment_id IS NOT NULL THEN
    IF OLD.reaction_type = 'like' THEN
      UPDATE discussion_comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.comment_id;
    ELSE
      UPDATE discussion_comments SET dislike_count = GREATEST(dislike_count - 1, 0) WHERE id = OLD.comment_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_comment_reaction_count
AFTER INSERT OR DELETE ON discussion_reactions
FOR EACH ROW EXECUTE FUNCTION update_comment_reaction_count();

-- Update total_votes on polls
CREATE OR REPLACE FUNCTION update_poll_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE group_polls SET total_votes = total_votes + 1 WHERE id = NEW.poll_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE group_polls SET total_votes = GREATEST(total_votes - 1, 0) WHERE id = OLD.poll_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_poll_vote_count
AFTER INSERT OR DELETE ON group_poll_votes
FOR EACH ROW EXECUTE FUNCTION update_poll_vote_count();

-- Updated_at triggers
CREATE TRIGGER set_discussions_updated_at
BEFORE UPDATE ON group_discussions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_comments_updated_at
BEFORE UPDATE ON discussion_comments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE group_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_poll_votes ENABLE ROW LEVEL SECURITY;

-- Discussions: group members can read, authors can write
CREATE POLICY "Group members can view discussions"
ON group_discussions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM study_group_members
    WHERE study_group_members.group_id = group_discussions.group_id
    AND study_group_members.user_id = auth.uid()
  )
);

CREATE POLICY "Group members can create discussions"
ON group_discussions FOR INSERT
WITH CHECK (
  auth.uid() = author_id
  AND EXISTS (
    SELECT 1 FROM study_group_members
    WHERE study_group_members.group_id = group_discussions.group_id
    AND study_group_members.user_id = auth.uid()
  )
);

CREATE POLICY "Authors can update own discussions"
ON group_discussions FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own discussions"
ON group_discussions FOR DELETE
USING (auth.uid() = author_id);

-- Comments: group members can read/create via discussion's group
CREATE POLICY "Members can view comments"
ON discussion_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM group_discussions gd
    JOIN study_group_members sgm ON sgm.group_id = gd.group_id
    WHERE gd.id = discussion_comments.discussion_id
    AND sgm.user_id = auth.uid()
  )
);

CREATE POLICY "Members can create comments"
ON discussion_comments FOR INSERT
WITH CHECK (
  auth.uid() = author_id
  AND EXISTS (
    SELECT 1 FROM group_discussions gd
    JOIN study_group_members sgm ON sgm.group_id = gd.group_id
    WHERE gd.id = discussion_comments.discussion_id
    AND sgm.user_id = auth.uid()
  )
);

CREATE POLICY "Authors can update own comments"
ON discussion_comments FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own comments"
ON discussion_comments FOR DELETE
USING (auth.uid() = author_id);

-- Reactions: members can react
CREATE POLICY "Members can view reactions"
ON discussion_reactions FOR SELECT
USING (true);

CREATE POLICY "Users can add reactions"
ON discussion_reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
ON discussion_reactions FOR DELETE
USING (auth.uid() = user_id);

-- Polls: group members
CREATE POLICY "Members can view polls"
ON group_polls FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM study_group_members
    WHERE study_group_members.group_id = group_polls.group_id
    AND study_group_members.user_id = auth.uid()
  )
);

CREATE POLICY "Members can create polls"
ON group_polls FOR INSERT
WITH CHECK (
  auth.uid() = author_id
  AND EXISTS (
    SELECT 1 FROM study_group_members
    WHERE study_group_members.group_id = group_polls.group_id
    AND study_group_members.user_id = auth.uid()
  )
);

CREATE POLICY "Authors can update own polls"
ON group_polls FOR UPDATE
USING (auth.uid() = author_id);

-- Poll votes
CREATE POLICY "Members can view votes"
ON group_poll_votes FOR SELECT
USING (true);

CREATE POLICY "Members can vote"
ON group_poll_votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own votes"
ON group_poll_votes FOR DELETE
USING (auth.uid() = user_id);
