import { v4 as uuidv4 } from 'uuid'
import Profile, { ProfileData } from './Profile'

export interface UserData {
  id?: string
  name: string
  email: string
  password?: string  // Made optional for Google auth users
  description?: string
  profileImage?: string
  profile?: Profile | ProfileData
  createdAt?: Date
  updatedAt?: Date
  lastLogin?: Date
  // Google auth fields
  googleId?: string
  googleProfilePicture?: string
  isGoogleUser?: boolean
}

export default class User {
  id: string
  name: string
  email: string
  password: string
  description: string
  profileImage: string
  profile?: Profile
  createdAt: Date
  updatedAt: Date
  lastLogin: Date
  // Google auth fields
  googleId?: string
  googleProfilePicture?: string
  isGoogleUser: boolean

  constructor(data: UserData) {
    this.id = data.id || uuidv4()
    this.name = data.name
    this.email = data.email
    this.password = data.password || ''
    this.description = data.description || ''
    this.profileImage = data.profileImage || ''
    this.profile = data.profile ? 
      (data.profile instanceof Profile ? data.profile : new Profile(data.profile))
      : undefined
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
    this.lastLogin = data.lastLogin || new Date()
    // Google auth fields
    this.googleId = data.googleId
    this.googleProfilePicture = data.googleProfilePicture
    this.isGoogleUser = data.isGoogleUser || false
  }

  static fromJSON(json: any): User {
    return new User({
      id: json.id,
      name: json.name,
      email: json.email,
      password: json.password,
      description: json.description,
      profileImage: json.profileImage,
      profile: json.profile ? Profile.fromJSON(json.profile) : undefined,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date(),
      lastLogin: json.lastLogin ? new Date(json.lastLogin) : new Date(),
      // Google auth fields
      googleId: json.googleId,
      googleProfilePicture: json.googleProfilePicture,
      isGoogleUser: json.isGoogleUser
    })
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      description: this.description,
      profileImage: this.profileImage,
      profile: this.profile?.toJSON(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLogin: this.lastLogin,
      // Google auth fields
      googleId: this.googleId,
      googleProfilePicture: this.googleProfilePicture,
      isGoogleUser: this.isGoogleUser
    }
  }
} 