-- Script de nettoyage pour supprimer les modifications Supabase
-- À exécuter dans l'interface Supabase SQL Editor

-- 1. Supprimer la fonction RPC
DROP FUNCTION IF EXISTS get_all_users();

-- 2. Supprimer toutes les politiques RLS que nous avons créées

-- Politiques sur la table profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- Politiques sur la table user_roles
DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete user roles" ON user_roles;

-- Politiques sur la table vendor_profiles
DROP POLICY IF EXISTS "Admins can view all vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can view own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can insert vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can insert own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can update vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can update own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can delete vendor profiles" ON vendor_profiles;

-- 3. Optionnel: Désactiver RLS si vous voulez un accès complet (ATTENTION: moins sécurisé)
-- Décommentez les lignes suivantes si vous voulez désactiver RLS complètement
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE vendor_profiles DISABLE ROW LEVEL SECURITY;

-- 4. Vérifier que tout est propre
SELECT 'Nettoyage terminé' as status;
