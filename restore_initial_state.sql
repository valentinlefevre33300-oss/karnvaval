-- Script pour revenir à l'état initial
-- À exécuter dans l'interface Supabase SQL Editor

-- 1. Supprimer toutes les politiques RLS que nous avons créées
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete user roles" ON user_roles;

DROP POLICY IF EXISTS "Admins can view all vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can view own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can insert vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can insert own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can update vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can update own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can delete vendor profiles" ON vendor_profiles;

-- 2. Supprimer la fonction RPC si elle existe
DROP FUNCTION IF EXISTS get_all_users();

-- 3. Désactiver RLS sur toutes les tables (pour permettre l'accès complet)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles DISABLE ROW LEVEL SECURITY;

-- 4. Vérifier que RLS est bien désactivé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'user_roles', 'vendor_profiles');

-- 5. Message de confirmation
SELECT 'État initial restauré - RLS désactivé' as status;
