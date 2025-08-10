export interface UserProfile {
  id: string
  email: string
  name: string
  image?: string
  createdAt: string
  favoriteDeals: string[]
  newsletterSubscribed: boolean
}

export interface NewsletterSubscriber {
  email: string
  name?: string
  subscribedAt: string
  isActive: boolean
}

export interface UserData {
  users: { [userId: string]: UserProfile }
  newsletter: NewsletterSubscriber[]
}
