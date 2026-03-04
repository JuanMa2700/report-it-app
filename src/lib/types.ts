export type Role = 'RESIDENT' | 'VIGILANT' | 'ADMIN'
export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED'
export type MediaType = 'PHOTO' | 'VIDEO' | 'AUDIO'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: Role
  createdAt: string
}

export interface Category {
  id: string
  name: string
  icon?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ReportMedia {
  id: string
  type: MediaType
  key: string
  createdAt: string
}

export interface ReportNote {
  id: string
  content: string
  createdAt: string
  author: { id: string; name: string }
}

export interface Report {
  id: string
  title: string
  description: string
  urgency: Urgency
  status: ReportStatus
  latitude?: number
  longitude?: number
  manualAddress?: string
  resolvedAt?: string
  createdAt: string
  updatedAt: string
  reporterId: string
  categoryId: string
  assignedToId?: string
  category: Category
  reporter: { id: string; name: string }
  assignedTo?: { id: string; name: string }
  media: ReportMedia[]
  notes?: ReportNote[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LoginResponse {
  user: User
  token: string
}

export type NotificationType = 'STATUS_CHANGED' | 'REPORT_ASSIGNED' | 'NOTE_ADDED'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  reportId: string | null
  read: boolean
  createdAt: string
}
