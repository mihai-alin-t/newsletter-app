-- Fix newsletters table RLS policies
DROP POLICY IF EXISTS "Anyone can view published newsletters" ON newsletters;
DROP POLICY IF EXISTS "Admins can manage newsletters" ON newsletters;

-- Allow anyone to view published newsletters
CREATE POLICY "Anyone can view published newsletters" ON newsletters 
FOR SELECT USING (is_published = true);

-- Allow authenticated users to create their own newsletters
CREATE POLICY "Users can create newsletters" ON newsletters 
FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Allow users to view their own newsletters (including drafts)
CREATE POLICY "Users can view their own newsletters" ON newsletters 
FOR SELECT USING (auth.uid() = author_id);

-- Allow users to update their own newsletters
CREATE POLICY "Users can update their own newsletters" ON newsletters 
FOR UPDATE USING (auth.uid() = author_id);

-- Allow users to delete their own newsletters
CREATE POLICY "Users can delete their own newsletters" ON newsletters 
FOR DELETE USING (auth.uid() = author_id);

-- Allow service role to manage all newsletters (for admin operations)
CREATE POLICY "Service role can manage all newsletters" ON newsletters 
FOR ALL USING (current_setting('role') = 'service_role');