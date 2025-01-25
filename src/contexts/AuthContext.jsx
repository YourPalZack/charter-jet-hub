import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
    }
  }

  async function signUp({ email, password, userType, companyName = null, companyWebsite = null, phone = null }) {
    try {
      setError(null);
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: user.id,
          user_type: userType,
          company_name: companyName,
          company_website: companyWebsite,
          phone,
          notification_email: email
        }]);

      if (profileError) throw profileError;

      return { user, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message);
      return { user: null, error };
    }
  }

  async function signIn({ email, password }) {
    try {
      setError(null);
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.message);
      return { user: null, error };
    }
  }

  async function signOut() {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error.message);
    }
  }

  async function createAlert({ categoryId, departureCity, arrivalCity, minPrice, maxPrice, frequency }) {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('flight_alerts')
        .insert([{
          user_id: user.id,
          category_id: categoryId,
          departure_city: departureCity,
          arrival_city: arrivalCity,
          min_price: minPrice,
          max_price: maxPrice,
          frequency
        }])
        .select()
        .single();

      if (error) throw error;
      return { alert: data, error: null };
    } catch (error) {
      console.error('Error creating alert:', error);
      setError(error.message);
      return { alert: null, error };
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    createAlert
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};