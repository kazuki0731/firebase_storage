import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from "@firebase/auth";

export const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoding] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    const actionCodeSettings = {
      url: "http://localhost:3000",
    };
    return sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  const emailVerification = () => {
    const actionCodeSettings = {
      url: "http://localhost:3000",
    };
    return sendEmailVerification(auth.currentUser, actionCodeSettings);
  };

  const updateDisplayName = (profiledata) => {
    return updateProfile(auth.currentUser, profiledata);
  };

  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoding(false);
    });

    return () => {
      unsubscribed();
    };
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    emailVerification,
    updateDisplayName,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
