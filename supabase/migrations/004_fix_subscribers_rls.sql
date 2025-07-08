-- Fix subscribers table RLS policies to allow public subscription
DROP POLICY IF EXISTS "Admins can manage subscribers" ON subscribers;

-- Allow anyone to subscribe (insert their email)
CREATE POLICY "Anyone can subscribe" ON subscribers 
FOR INSERT WITH CHECK (true);

-- Allow service role to manage all subscribers (for admin operations)
CREATE POLICY "Service role can manage subscribers" ON subscribers 
FOR ALL USING (current_setting('role') = 'service_role');

-- Allow authenticated users to view/update their own subscription
CREATE POLICY "Users can view their own subscription" ON subscribers 
FOR SELECT USING (email = auth.email());

CREATE POLICY "Users can update their own subscription" ON subscribers 
FOR UPDATE USING (email = auth.email());

-- Allow admins to view all subscribers (using service role for admin dashboard)
-- This will be handled through service role calls from the dashboard