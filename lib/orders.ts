import type { CartItem } from "./cart"

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: CartItem[]
  total: number
  status: "جديد" | "قيد التنفيذ" | "مكتمل" | "ملغي"
  createdAt: string
  updatedAt: string
  notes?: string
}

export class OrderService {
  private static ORDERS_KEY = "teeshirtate_orders"

  static getOrders(): Order[] {
    if (typeof window === "undefined") return []
    const orders = localStorage.getItem(this.ORDERS_KEY)
    return orders ? JSON.parse(orders) : []
  }

  static saveOrders(orders: Order[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders))
  }

  static createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
    const orders = this.getOrders()
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    orders.push(newOrder)
    this.saveOrders(orders)
    return newOrder
  }

  static updateOrderStatus(orderId: string, status: Order["status"], notes?: string): void {
    const orders = this.getOrders()
    const orderIndex = orders.findIndex((order) => order.id === orderId)

    if (orderIndex >= 0) {
      orders[orderIndex].status = status
      orders[orderIndex].updatedAt = new Date().toISOString()
      if (notes) {
        orders[orderIndex].notes = notes
      }
      this.saveOrders(orders)
    }
  }

  static getOrdersByStatus(status: Order["status"]): Order[] {
    return this.getOrders().filter((order) => order.status === status)
  }

  static getOrdersByCustomer(customerId: string): Order[] {
    return this.getOrders().filter((order) => order.customerId === customerId)
  }
}
