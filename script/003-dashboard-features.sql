-- script/003-dashboard-features.sql
-- Migration script for views tracking and RSVP unread status

-- 1. Create invitation_views table for tracking impressions
CREATE TABLE IF NOT EXISTS invitation_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add is_read column to rsvp_messages to distinguish new messages
ALTER TABLE rsvp_messages
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- 3. Enable RLS on invitation_views
ALTER TABLE invitation_views ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy for Owners to read their own views
CREATE POLICY "Owner can read own views" ON invitation_views
FOR SELECT USING (
  EXISTS (SELECT 1 FROM invitations WHERE id = invitation_id AND user_id = auth.uid())
);

-- 5. RLS Policy for anyone (authenticated or anonymous) to insert views
-- No auth check since it's a public tracking endpoint
CREATE POLICY "Anyone can insert view" ON invitation_views
FOR INSERT WITH CHECK (true);

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invitation_views_invitation_id ON invitation_views(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_messages_invitation_id ON rsvp_messages(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_messages_is_read ON rsvp_messages(invitation_id, is_read);
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
