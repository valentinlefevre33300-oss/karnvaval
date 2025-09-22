-- Create a function to get all users for admins
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Return all profiles
  RETURN QUERY
  SELECT 
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.phone,
    p.created_at
  FROM profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_all_users() TO authenticated;
