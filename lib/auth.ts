export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "customer" | "admin"
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

// Simple auth service using localStorage (can be replaced with real API later)
export class AuthService {
  private static USERS_KEY = "teeshirtate_users"
  private static CURRENT_USER_KEY = "teeshirtate_current_user"

  static initializeDefaultAdmin(): void {
    const users = this.getUsers()
    const adminExists = users.some((user) => user.role === "admin")

    if (!adminExists) {
      const defaultAdmin: User = {
        id: "admin-1",
        name: "مدير المتجر",
        email: "admin@teeshirtate.com",
        role: "admin",
        createdAt: new Date().toISOString(),
      }
      users.push(defaultAdmin)
      this.saveUsers(users)
    }
  }

  static getUsers(): User[] {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(this.USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  static saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(this.CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  }

  static setCurrentUser(user: User | null): void {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY)
    }
  }

  static async login(credentials: LoginCredentials): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers()
        const user = users.find((u) => u.email === credentials.email)

        if (!user) {
          reject(new Error("البريد الإلكتروني غير مسجل"))
          return
        }

        if (credentials.email === "admin@teeshirtate.com" && credentials.password !== "admin123") {
          reject(new Error("كلمة المرور غير صحيحة"))
          return
        }

        this.setCurrentUser(user)
        resolve(user)
      }, 1000)
    })
  }

  static async register(data: RegisterData): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers()

        // Check if email already exists
        if (users.some((u) => u.email === data.email)) {
          reject(new Error("البريد الإلكتروني مسجل مسبقاً"))
          return
        }

        const newUser: User = {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: "customer", // Added default customer role
          createdAt: new Date().toISOString(),
        }

        users.push(newUser)
        this.saveUsers(users)
        this.setCurrentUser(newUser)
        resolve(newUser)
      }, 1000)
    })
  }

  static logout(): void {
    this.setCurrentUser(null)
  }

  static isAdmin(user: User | null): boolean {
    return user?.role === "admin"
  }
}
