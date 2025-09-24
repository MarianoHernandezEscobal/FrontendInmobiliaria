"use client";

import { UserUpdateRequestDto } from "@/service/dto/user-update.request.dto";
import { getUsers, loginUser, registerUser, updateUser } from "@/service/user";
import { RegisterUser, User } from "@/types/user";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextProps {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  logoutUser: () => void;
  loginUser: (email: string, password: string) => void;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (formData: UserUpdateRequestDto) => Promise<void>;
  registerUser: (user: RegisterUser) => void;
  handleUserData: (user: User, token: string) => Promise<void>;

}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
      setToken(token);
      setHasSession(true);
    } else {
      setHasSession(false);
      setToken(null);
      setUser(null);
    }
  }, []);

  const handlerLogin = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("user", JSON.stringify(response.user));
      setHasSession(true);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error("Error during login:", error);
      setHasSession(false);
      setUser(null);
      setToken(null);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      throw error;
    }
  };

  const handleUserData = async (user: User, token: string) => {
    try {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      setHasSession(true);
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error("Error during login:", error);
      setHasSession(false);
      setUser(null);
      setToken(null);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      throw error;
    }
  };

  const handlerRegister = async (user: RegisterUser) => {
    try {
      const response = await registerUser(user);
      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("user", JSON.stringify(response.user));
      setHasSession(true);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error("Error during login:", error);
      setHasSession(false);
      setUser(null);
      setToken(null);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      throw error;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userData = token ? await getUsers(token) : null;
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.warn("Error fetching user profile:", error);
      sessionStorage.removeItem("user");
      setUser(null);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    setHasSession(false);
    router.push("/");
  };

  const updateUserProfile = async (formData: UserUpdateRequestDto) => {
    try {
      const updatedUser = token ? await updateUser(formData, token) : null;
      setUser(updatedUser?.user ?? null);
      setToken(updatedUser?.token ?? null);
      sessionStorage.setItem("user", JSON.stringify(updatedUser?.user));
      sessionStorage.setItem("token", updatedUser?.token ?? "");
    } catch (error) {
      setUser(null);
      setToken(null);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isAuthenticated: hasSession === true && !!user,
        loginUser: handlerLogin,
        logoutUser: handleLogout,
        fetchUserProfile,
        updateUserProfile,
        registerUser: handlerRegister,
        handleUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};
