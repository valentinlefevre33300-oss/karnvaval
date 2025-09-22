-- Script SQL à exécuter dans l'interface Supabase SQL Editor
-- Ce script permet aux admins de gérer tous les utilisateurs

-- 1. Créer la fonction pour récupérer tous les utilisateurs (admin seulement)
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
  -- Vérifier si l'utilisateur actuel est admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Retourner tous les profils
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

-- 2. Donner les permissions d'exécution aux utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION get_all_users() TO authenticated;

-- 3. Configurer les politiques RLS pour les profils
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour que les admins voient tous les profils
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
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

-- Politique pour que les utilisateurs voient leur propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 4. Configurer les politiques RLS pour les rôles utilisateurs
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Politique pour que les admins voient tous les rôles
DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;
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

-- Politique pour que les utilisateurs voient leurs propres rôles
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 5. Configurer les politiques RLS pour les profils vendeurs
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour que les admins voient tous les profils vendeurs
DROP POLICY IF EXISTS "Admins can view all vendor profiles" ON vendor_profiles;
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

-- Politique pour que les vendeurs voient leur propre profil
DROP POLICY IF EXISTS "Vendors can view own profile" ON vendor_profiles;
CREATE POLICY "Vendors can view own profile" ON vendor_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
