import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          await fetchUserData();
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Token ungültig:', error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    checkToken();
  }, [token]);

  const fetchUserData = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      return data;
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      throw error;
    }
  };

  const register = async (firstName, lastName, email, password, confirmPassword) => {
    try {
      const data = await api.register(firstName, lastName, email, password, confirmPassword);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      return data;
    } catch (error) {
      console.error('Registrierung fehlgeschlagen:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  const updateProfileImage = async (imageUrl) => {
    try {
      const response = await api.updateProfileImage(imageUrl);
      if (response.success) {
        setUser(prevUser => ({
          ...prevUser,
          profileImage: response.profileImage
        }));
      }
      return response;
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profilbilds:', error);
      throw error;
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.updateUserProfile(profileData);
      if (response.success) {
        setUser(prevUser => ({
          ...prevUser,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email
        }));
      }
      return response;
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profils:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.changePassword(currentPassword, newPassword, confirmPassword);
      return response;
    } catch (error) {
      console.error('Fehler beim Ändern des Passworts:', error);
      throw error;
    }
  };

  const deleteAccount = async (password) => {
    try {
      const response = await api.deleteAccount(password);
      if (response.success) {
        logout();
      }
      return response;
    } catch (error) {
      console.error('Fehler beim Löschen des Accounts:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        user,
        loading,
        login,
        register,
        logout,
        fetchUserData,
        updateProfileImage,
        updateUserProfile,
        changePassword,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 