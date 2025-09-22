-- Script simple pour permettre à l'admin de voir tous les utilisateurs
-- À exécuter dans l'interface Supabase SQL Editor

-- 1. Vérifier si RLS est activé sur les tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'user_roles', 'vendor_profiles');

-- 2. Si RLS est activé, créer des politiques pour les admins
-- (Ces politiques permettront aux admins de voir tous les utilisateurs)

-- Supprimer les politiques existantes d'abord
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all vendor profiles" ON vendor_profiles;

-- Politique pour la table profiles
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

-- Politique pour la table user_roles
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

-- Politique pour la table vendor_profiles
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

-- 3. Alternative: Désactiver RLS temporairement si les politiques ne fonctionnent pas
-- (Décommentez les lignes suivantes si nécessaire)
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE vendor_profiles DISABLE ROW LEVEL SECURITY;

-- 4. Vérifier que l'utilisateur actuel a bien le rôle admin
SELECT 
  p.email,
  ur.role
FROM profiles p
LEFT JOIN user_roles ur ON ur.user_id = p.user_id
WHERE p.user_id = auth.uid();
