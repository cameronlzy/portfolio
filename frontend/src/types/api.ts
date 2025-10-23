export type LinkType = "github" | "demo" | "figma" | string

export interface ApiLink {
  type: LinkType
  inSite: boolean
  url?: string // optional when inSite === true
}

export interface ApiProject {
  _id: string
  name: string
  description: string
  tags?: string[]
  links?: ApiLink[]
  type: string
}

// types/Project.ts (your UI card type)
export interface Project {
  title: string
  description: string
  tags: string[]
  href?: string // demo
  repo?: string // github
  figmaLink?: string // figma
}
