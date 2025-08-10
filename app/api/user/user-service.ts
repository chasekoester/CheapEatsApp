import fs from 'fs/promises'
import path from 'path'
import { UserProfile, NewsletterSubscriber, UserData } from './types'

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json')

class UserService {
  private async ensureDataDirectory() {
    const dataDir = path.dirname(DATA_FILE)
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }
  }

  private async loadData(): Promise<UserData> {
    try {
      await this.ensureDataDirectory()
      const data = await fs.readFile(DATA_FILE, 'utf-8')
      return JSON.parse(data)
    } catch {
      return { users: {}, newsletter: [] }
    }
  }

  private async saveData(data: UserData): Promise<void> {
    await this.ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  }

  async createOrUpdateUser(user: {
    id: string
    email: string
    name: string
    image?: string
  }): Promise<UserProfile> {
    const data = await this.loadData()
    
    const existingUser = data.users[user.id]
    const userProfile: UserProfile = {
      ...user,
      createdAt: existingUser?.createdAt || new Date().toISOString(),
      favoriteDeals: existingUser?.favoriteDeals || [],
      newsletterSubscribed: existingUser?.newsletterSubscribed || false
    }
    
    data.users[user.id] = userProfile
    await this.saveData(data)
    
    return userProfile
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const data = await this.loadData()
    return data.users[userId] || null
  }

  async addFavoriteDeal(userId: string, dealId: string): Promise<boolean> {
    const data = await this.loadData()
    const user = data.users[userId]
    
    if (!user) return false
    
    if (!user.favoriteDeals.includes(dealId)) {
      user.favoriteDeals.push(dealId)
      await this.saveData(data)
    }
    
    return true
  }

  async removeFavoriteDeal(userId: string, dealId: string): Promise<boolean> {
    const data = await this.loadData()
    const user = data.users[userId]
    
    if (!user) return false
    
    user.favoriteDeals = user.favoriteDeals.filter(id => id !== dealId)
    await this.saveData(data)
    
    return true
  }

  async subscribeToNewsletter(email: string, name?: string): Promise<boolean> {
    const data = await this.loadData()
    
    const existingSubscriber = data.newsletter.find(sub => sub.email === email)
    if (existingSubscriber) {
      existingSubscriber.isActive = true
      await this.saveData(data)
      return true
    }
    
    const subscriber: NewsletterSubscriber = {
      email,
      name,
      subscribedAt: new Date().toISOString(),
      isActive: true
    }
    
    data.newsletter.push(subscriber)
    await this.saveData(data)
    
    return true
  }

  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    const data = await this.loadData()
    const subscriber = data.newsletter.find(sub => sub.email === email)
    
    if (subscriber) {
      subscriber.isActive = false
      await this.saveData(data)
      return true
    }
    
    return false
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const data = await this.loadData()
    return data.newsletter.filter(sub => sub.isActive)
  }
}

export const userService = new UserService()
