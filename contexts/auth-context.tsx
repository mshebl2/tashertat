"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { AuthService, type User, type AuthState, type LoginCredentials, type RegisterData } from "@/lib/auth"

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }

interface AuthContextType {
  state: AuthState
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }

    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    AuthService.initializeDefaultAdmin()
    const currentUser = AuthService.getCurrentUser()
    dispatch({ type: "SET_USER", payload: currentUser })
  }, [])

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const user = await AuthService.login(credentials)
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const user = await AuthService.register(data)
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const logout = () => {
    AuthService.logout()
    dispatch({ type: "LOGOUT" })
  }

  return <AuthContext.Provider value={{ state, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
