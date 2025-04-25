import { neon } from "@neondatabase/serverless"
import { nanoid } from "nanoid"

// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL!)

/**
 * Ensure that the necessary tables exist
 */
export async function ensureChatTablesExist() {
  try {
    // Check if chat_sessions table exists
    const sessionTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'chat_sessions'
      );
    `

    const messagesTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'chat_messages'
      );
    `

    const sessionTableExists = sessionTableCheck[0]?.exists
    const messagesTableExists = messagesTableCheck[0]?.exists

    // Create tables if they don't exist
    if (!sessionTableExists) {
      console.log("Creating chat_sessions table...")
      await sql`
        CREATE TABLE chat_sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    }

    if (!messagesTableExists) {
      console.log("Creating chat_messages table...")
      await sql`
        CREATE TABLE chat_messages (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB
        )
      `

      // Add foreign key constraint
      try {
        console.log("Adding foreign key constraint...")
        await sql`
          ALTER TABLE chat_messages 
          ADD CONSTRAINT fk_session_id 
          FOREIGN KEY (session_id) 
          REFERENCES chat_sessions(id) 
          ON DELETE CASCADE
        `
      } catch (error) {
        // Foreign key might already exist or fail for other reasons
        console.warn("Could not add foreign key constraint:", error)
      }
    }

    // Create indexes if needed
    try {
      console.log("Creating indexes...")
      await sql`
        CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id)
      `
      await sql`
        CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id)
      `
    } catch (error) {
      console.warn("Could not create indexes:", error)
    }

    return true
  } catch (error) {
    console.error("Error ensuring chat tables exist:", error)
    throw error
  }
}

export type ChatSession = {
  id: string
  createdAt: Date
  updatedAt: Date
  preview: string
  messageCount: number
}

export type ChatMessage = {
  id: string
  sessionId: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

/**
 * Get a list of chat sessions for a user
 */
export async function getChatSessions(userId?: string): Promise<ChatSession[]> {
  try {
    // Ensure tables exist before querying
    await ensureChatTablesExist()

    // If no userId provided, use a temporary ID to get anonymous sessions
    const userIdentifier = userId || "anonymous"

    const sessions = await sql`
      SELECT 
        cs.id, 
        cs.created_at, 
        cs.updated_at,
        (
          SELECT content 
          FROM chat_messages 
          WHERE session_id = cs.id AND role = 'user' 
          ORDER BY created_at ASC 
          LIMIT 1
        ) as preview,
        (
          SELECT COUNT(*) 
          FROM chat_messages 
          WHERE session_id = cs.id
        ) as message_count
      FROM chat_sessions cs
      WHERE cs.user_id IS NULL OR cs.user_id = ${userIdentifier}
      ORDER BY cs.updated_at DESC
      LIMIT 20
    `

    return sessions.map((session) => ({
      id: session.id,
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at),
      preview: session.preview || "New conversation",
      messageCount: Number.parseInt(session.message_count) || 0,
    }))
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    return []
  }
}

/**
 * Get all messages for a specific chat session
 */
export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    // Ensure tables exist before querying
    await ensureChatTablesExist()

    const messages = await sql`
      SELECT id, session_id, role, content, created_at
      FROM chat_messages
      WHERE session_id = ${sessionId}
      ORDER BY created_at ASC
    `

    return messages.map((message) => ({
      id: message.id,
      sessionId: message.session_id,
      role: message.role,
      content: message.content,
      createdAt: new Date(message.created_at),
    }))
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return []
  }
}

/**
 * Create a new chat session
 */
export async function createChatSession(userId?: string): Promise<string> {
  try {
    // Ensure tables exist before creating a session
    await ensureChatTablesExist()

    const sessionId = nanoid()
    await sql`
      INSERT INTO chat_sessions (id, user_id, created_at, updated_at)
      VALUES (${sessionId}, ${userId || null}, NOW(), NOW())
    `
    return sessionId
  } catch (error) {
    console.error("Error creating chat session:", error)
    return nanoid() // Return a new ID even if DB fails
  }
}

/**
 * Update the timestamp of a chat session
 */
export async function updateChatSessionTimestamp(sessionId: string): Promise<boolean> {
  try {
    // Ensure tables exist before updating
    await ensureChatTablesExist()

    await sql`
      UPDATE chat_sessions
      SET updated_at = NOW()
      WHERE id = ${sessionId}
    `
    return true
  } catch (error) {
    console.error("Error updating chat session timestamp:", error)
    return false
  }
}
