export interface User extends Record<string, unknown> {
  id: string
  email: string
  name?: string
  image?: string
}
