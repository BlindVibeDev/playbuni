import pool from "./db"

export type Subscription = {
  id: number
  userId: number
  subscriptionType: string
  isActive: boolean
  startDate: Date
  endDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export async function createSubscription(
  email: string,
  name: string,
  subscriptionType: string,
): Promise<{ userId: number; subscriptionId: number }> {
  // Start a transaction
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Check if user exists
    const userQuery = "SELECT id FROM users WHERE email = $1"
    const userParams = [email]
    const userResult = await client.query(userQuery, userParams)

    let userId: number

    if (userResult.rows.length === 0) {
      // Create new user
      const insertQuery = "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id"
      const insertParams = [email, name]
      const newUserResult = await client.query(insertQuery, insertParams)
      userId = newUserResult.rows[0].id
    } else {
      userId = userResult.rows[0].id
    }

    // Create subscription
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1) // 1 year subscription

    const subscriptionResult = await client.query(
      `INSERT INTO subscriptions 
       (user_id, subscription_type, is_active, start_date, end_date) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [userId, subscriptionType, true, new Date(), endDate],
    )

    const subscriptionId = subscriptionResult.rows[0].id

    await client.query("COMMIT")

    return { userId, subscriptionId }
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating subscription:", error)
    throw error
  } finally {
    client.release()
  }
}

export async function getActiveSubscription(userId: number): Promise<Subscription | null> {
  const query = `
    SELECT * FROM subscriptions
    WHERE user_id = $1 AND is_active = true AND (end_date IS NULL OR end_date > NOW())
    ORDER BY created_at DESC
    LIMIT 1
  `

  try {
    const result = await pool.query(query, [userId])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error getting active subscription:", error)
    throw error
  }
}

export async function cancelSubscription(subscriptionId: number): Promise<void> {
  const query = `
    UPDATE subscriptions
    SET is_active = false, updated_at = NOW()
    WHERE id = $1
  `

  try {
    await pool.query(query, [subscriptionId])
  } catch (error) {
    console.error("Error canceling subscription:", error)
    throw error
  }
}
