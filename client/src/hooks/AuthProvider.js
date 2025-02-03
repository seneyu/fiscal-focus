import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../../supabase.js';

const AuthConext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if user is already logged in when app loads
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthConext.Provider value={{ user, loading }}>
      {children}
    </AuthConext.Provider>
  );
};

export const useAuth = () => useContext(AuthConext);

export default AuthProvider;
