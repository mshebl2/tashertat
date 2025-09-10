-- This script should be run after creating an admin user account
-- Update the email below to match your admin account
-- You'll need to sign up first, then run this to make the account admin

-- Make user admin (replace with your admin email)
update public.profiles 
set role = 'admin' 
where email = 'admin@teeshirtate.com';
