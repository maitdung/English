import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
  refreshTokensRequest,
  registerRequest,
} from "../../../lib/api/auth-api";
import type {
  ApiUser,
  AuthContextValue,
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
} from "../types/auth";

const SESSION_STORAGE_KEY = "mtd-lingo-auth-session";

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

type AuthProviderProps = {
  children: ReactNode;
};

function createFullName(user: ApiUser): string {
  const fullName = [user.lastName, user.firstName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || user.email.split("@")[0] || "Học viên";
}

function mapApiUser(user: ApiUser): AuthUser {
  return {
    ...user,
    fullName: createFullName(user),
  };
}

function readStoredSession(): AuthSession | null {
  try {
    const storedSession = window.localStorage.getItem(
      SESSION_STORAGE_KEY,
    );

    if (!storedSession) {
      return null;
    }

    const parsedSession = JSON.parse(
      storedSession,
    ) as Partial<AuthSession>;

    if (
      !parsedSession.user ||
      typeof parsedSession.accessToken !== "string" ||
      typeof parsedSession.refreshToken !== "string"
    ) {
      return null;
    }

    return parsedSession as AuthSession;
  } catch {
    return null;
  }
}

function storeSession(session: AuthSession): void {
  window.localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );
}

function clearStoredSession(): void {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);

  // Xóa dữ liệu đăng nhập giả của phiên bản frontend cũ.
  window.localStorage.removeItem("mtd-lingo-users");
  window.localStorage.removeItem("mtd-lingo-session");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionRef = useRef<AuthSession | null>(null);

  const updateSession = useCallback(
    (nextSession: AuthSession | null) => {
      sessionRef.current = nextSession;
      setSession(nextSession);

      if (nextSession) {
        storeSession(nextSession);
      } else {
        clearStoredSession();
      }
    },
    [],
  );

  const refreshSession = useCallback(
    async (
      currentSession: AuthSession,
    ): Promise<AuthSession | null> => {
      try {
        const tokens = await refreshTokensRequest(
          currentSession.refreshToken,
        );

        const nextSession: AuthSession = {
          user: currentSession.user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };

        updateSession(nextSession);

        return nextSession;
      } catch {
        updateSession(null);
        return null;
      }
    },
    [updateSession],
  );

  const loadCurrentUser = useCallback(
    async (
      currentSession: AuthSession,
    ): Promise<AuthSession | null> => {
      try {
        const apiUser = await getCurrentUserRequest(
          currentSession.accessToken,
        );

        const nextSession: AuthSession = {
          ...currentSession,
          user: mapApiUser(apiUser),
        };

        updateSession(nextSession);

        return nextSession;
      } catch (error) {
        const errorStatus =
          error instanceof Error &&
          "status" in error &&
          typeof error.status === "number"
            ? error.status
            : null;

        if (errorStatus !== 401) {
          throw error;
        }

        const refreshedSession =
          await refreshSession(currentSession);

        if (!refreshedSession) {
          return null;
        }

        const apiUser = await getCurrentUserRequest(
          refreshedSession.accessToken,
        );

        const nextSession: AuthSession = {
          ...refreshedSession,
          user: mapApiUser(apiUser),
        };

        updateSession(nextSession);

        return nextSession;
      }
    },
    [refreshSession, updateSession],
  );

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedSession = readStoredSession();

      if (!storedSession) {
        clearStoredSession();

        if (isMounted) {
          setIsLoading(false);
        }

        return;
      }

      sessionRef.current = storedSession;
      setSession(storedSession);

      try {
        await loadCurrentUser(storedSession);
      } catch {
        updateSession(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [loadCurrentUser, updateSession]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      const response = await loginRequest(credentials);

      updateSession({
        user: mapApiUser(response.user),
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    },
    [updateSession],
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<void> => {
      const response = await registerRequest(payload);

      updateSession({
        user: mapApiUser(response.user),
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    },
    [updateSession],
  );

  const refreshCurrentUser =
    useCallback(async (): Promise<void> => {
      const currentSession = sessionRef.current;

      if (!currentSession) {
        return;
      }

      await loadCurrentUser(currentSession);
    }, [loadCurrentUser]);

  const logout = useCallback(async (): Promise<void> => {
    const currentSession = sessionRef.current;

    updateSession(null);

    if (!currentSession?.accessToken) {
      return;
    }

    try {
      await logoutRequest(currentSession.accessToken);
    } catch {
      // Phiên phía trình duyệt vẫn phải bị xóa dù server đã hết hạn.
    }
  }, [updateSession]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user),
      isLoading,
      login,
      register,
      refreshCurrentUser,
      logout,
    }),
    [
      isLoading,
      login,
      logout,
      refreshCurrentUser,
      register,
      session?.user,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth phải được sử dụng bên trong AuthProvider.",
    );
  }

  return context;
}

export default AuthContext;