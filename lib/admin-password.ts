export class AdminPasswordService {
  private static readonly ADMIN_PASSWORD = "admin2024"
  private static readonly STORAGE_KEY = "admin_password_verified"

  static verifyPassword(password: string): boolean {
    const isValid = password === this.ADMIN_PASSWORD
    if (isValid) {
      localStorage.setItem(this.STORAGE_KEY, "true")
    }
    return isValid
  }

  static isPasswordVerified(): boolean {
    if (typeof window === "undefined") return false
    return localStorage.getItem(this.STORAGE_KEY) === "true"
  }

  static clearPasswordVerification(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }

  static getAdminPassword(): string {
    return this.ADMIN_PASSWORD
  }
}
