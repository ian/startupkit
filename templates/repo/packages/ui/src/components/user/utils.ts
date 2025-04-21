// A list of tailwind color classes for avatars
const AVATAR_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
]

/**
 * Generates a hash code from a string
 */
export function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Gets a consistent color based on a string (name or email)
 */
export function getAvatarColor(identifier: string): string {
  const hash = hashString(identifier)
  const colorIndex = hash % AVATAR_COLORS.length
  return AVATAR_COLORS[colorIndex] as string
}

/**
 * Gets the initial to display in the avatar
 */
export function getAvatarInitial(name: string, email: string): string {
  if (name && name.trim() !== "") {
    return name.trim()[0]?.toUpperCase() as string
  }

  if (email && email.trim() !== "") {
    return email.trim()[0]?.toUpperCase() as string
  }

  return ""
}

/**
 * Generates avatar data for a user
 */
export function generateAvatarData(
  name: string,
  email: string,
): {
  initial: string
  color: string
} {
  const identifier = name || email
  const initial = getAvatarInitial(name, email)
  const color = getAvatarColor(identifier)

  return {
    initial,
    color,
  }
}

