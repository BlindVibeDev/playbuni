// Simple auth utilities without Clerk

// Get user (returns null since we've removed authentication)
export async function getUser() {
  return null
}

// Get user ID (returns null since we've removed authentication)
export async function getUserId() {
  return null
}

// Check if user is authenticated (always returns false)
export async function isAuthenticated() {
  return false
}
