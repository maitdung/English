import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthContextValue,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
  StoredUser,
} from "../types/auth";

const USERS_STORAGE_KEY = "mtd-lingo-users";
const SESSION_STORAGE_KEY = "mtd-lingo-session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

function readStoredUsers(): StoredUser[] {
  try {
    const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);

    if (!storedUsers) {
      return [];
    }

    const parsedUsers = JSON.parse(storedUsers);

    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
}

function readStoredSession(): AuthUser | null {
  try {
    const storedSession = window.localStorage.getItem(
      SESSION_STORAGE_KEY,
    );

    if (!storedSession) {
      return null;
    }

    const parsedSession = JSON.parse(storedSession) as AuthUser;

    if (
      typeof parsedSession.id !== "string" ||
      typeof parsedSession.fullName !== "string" ||
      typeof parsedSession.email !== "string"
    ) {
      return null;
    }

    return parsedSession;
  } catch {
    return null;
  }
}

function createUserId() {
  if ("randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSession = readStoredSession();

    setUser(storedSession);
    setIsLoading(false);
  }, []);

  const login = async ({
    email,
    password,
  }: LoginCredentials): Promise<void> => {
    await wait(600);

    const normalizedEmail = email.trim().toLowerCase();
    const storedUsers = readStoredUsers();

    const matchedUser = storedUsers.find(
      (storedUser) =>
        storedUser.email.toLowerCase() === normalizedEmail &&
        storedUser.password === password,
    );

    if (!matchedUser) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }

    const authenticatedUser: AuthUser = {
      id: matchedUser.id,
      fullName: matchedUser.fullName,
      email: matchedUser.email,
    };

    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(authenticatedUser),
    );

    setUser(authenticatedUser);
  };

  const register = async ({
    fullName,
    email,
    password,
  }: RegisterPayload): Promise<void> => {
    await wait(700);

    const normalizedEmail = email.trim().toLowerCase();
    const storedUsers = readStoredUsers();

    const emailAlreadyExists = storedUsers.some(
      (storedUser) =>
        storedUser.email.toLowerCase() === normalizedEmail,
    );

    if (emailAlreadyExists) {
      throw new Error("Email này đã được sử dụng.");
    }

    const newStoredUser: StoredUser = {
      id: createUserId(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
    };

    const updatedUsers = [...storedUsers, newStoredUser];

    window.localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(updatedUsers),
    );

    const authenticatedUser: AuthUser = {
      id: newStoredUser.id,
      fullName: newStoredUser.fullName,
      email: newStoredUser.email,
    };

    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(authenticatedUser),
    );

    setUser(authenticatedUser);
  };

  const logout = () => {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
  };

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [isLoading, user],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider.");
  }

  return context;
}

export default AuthContext;