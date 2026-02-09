import { createDirectus, rest } from '@directus/sdk'

interface Sponsor {
  id: number
  name: string
  level: 'root' | 'admin' | 'user' | 'collaborator'
  link: string
  logo: string
}

interface Schedule {
  id: number
  title: string
  start: 'datetime'
  end: 'datetime'
  location: string
  tags: string[]
  description?: string
}

interface Wifi {
  id: number
  ssid: string
  password: string
}

interface Hackingtime {
  id: number
  start: 'datetime'
  end: 'datetime'
}

interface Announcement {
  id: number
  content?: string
  visible: boolean
}

interface Challenge {
  id: number
  title: string
  description: string
  criteria: string
  sponsor: Sponsor
  prize: string
  prize_url: string
}

export interface Mentor {
  id: number
  name: string
  subtitle: string
  discord?: string
  description?: string
}

interface Schema {
  sponsors: Sponsor[]
  schedule: Schedule[]
  challenges: Challenge[]
  mentors: Mentor[]
  wifi: Wifi
  hackingtime: Hackingtime
  announcement: Announcement
}

const directus = createDirectus<Schema>(import.meta.env.VITE_DIRECTUS_URL).with(rest())

export default directus
