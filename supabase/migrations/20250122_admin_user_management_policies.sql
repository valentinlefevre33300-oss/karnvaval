-- Enable RLS on profiles table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to see all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create policy to allow users to see their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create policy to allow admins to insert profiles
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create policy to allow admins to update profiles
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policy to allow admins to delete profiles
CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Enable RLS on user_roles table if not already enabled
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to view all user roles
CREATE POLICY "Admins can view all user roles" ON user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Create policy to allow users to view their own roles
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create policy to allow admins to insert user roles
CREATE POLICY "Admins can insert user roles" ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create policy to allow admins to update user roles
CREATE POLICY "Admins can update user roles" ON user_roles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create policy to allow admins to delete user roles
CREATE POLICY "Admins can delete user roles" ON user_roles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Enable RLS on vendor_profiles table if not already enabled
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to view all vendor profiles
CREATE POLICY "Admins can view all vendor profiles" ON vendor_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create policy to allow vendors to view their own profile
CREATE POLICY "Vendors can view own profile" ON vendor_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create policy to allow admins to insert vendor profiles
CREATE POLICY "Admins can insert vendor profiles" ON vendor_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create policy to allow vendors to insert their own profile
CREATE POLICY "Vendors can insert own profile" ON vendor_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'vendeur'
    )
  );

-- Create policy to allow admins to update vendor profiles
CREATE POLICY "Admins can update vendor profiles" ON vendor_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create policy to allow vendors to update their own profile
CREATE POLICY "Vendors can update own profile" ON vendor_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policy to allow admins to delete vendor profiles
CREATE POLICY "Admins can delete vendor profiles" ON vendor_profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );
