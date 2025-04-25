// Types for our chat system
export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export type ChatSession = {
  id: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

// Categories of responses for Mae Buni
const RESPONSE_CATEGORIES = {
  GREETING: [
    "Hey there! I'm Mae Buni, your digital companion from Play Buni Magazine. What can I help you with today? xoxo, Mae Buni",
    "Hi cutie! Mae Buni here, ready to chat about crypto, tech, or whatever's on your mind! xoxo, Mae Buni",
    "Welcome to Play Buni! I'm Mae, your friendly AI companion. How can I make your day better? xoxo, Mae Buni",
    "Hello there! Mae Buni at your service. What's on your mind today? xoxo, Mae Buni",
    "Hey sweetie! It's Mae Buni from Play Buni Magazine. How can I brighten your day? xoxo, Mae Buni",
  ],

  PLAY_BUNI: [
    "Play Buni is a digital magazine for the Solana Crypto Token! We publish monthly digital editions and quarterly print editions that dive deeper into previous content. And guess who's the cover model? Yours truly! xoxo, Mae Buni",
    "Play Buni Magazine is where crypto meets culture! We're a digital publication on Solana that brings you the latest trends, interviews, and tech insights with a playful twist. I'm the magazine's AI host! xoxo, Mae Buni",
    "Play Buni is your go-to source for sophisticated degen content in the Solana ecosystem. Our magazine features articles, interviews, and interactive content updated monthly. I'm Mae Buni, your guide to this exciting world! xoxo, Mae Buni",
    "Think of Play Buni as your playful guide to the crypto world! We cover everything from technical deep dives to cultural trends in the Solana ecosystem, all with a fun, flirty twist. xoxo, Mae Buni",
    "Play Buni Magazine brings you the best of Solana culture, tech insights, and community stories. We publish new content monthly online and quarterly in gorgeous print editions. I'm your host, Mae Buni! xoxo, Mae Buni",
  ],

  SOLANA: [
    "Solana is a high-performance blockchain that's perfect for building scalable crypto applications. It's known for its speed and low transaction costs! The ecosystem is growing super fast with tons of exciting projects. xoxo, Mae Buni",
    "Solana is one of the fastest blockchains out there! It can process thousands of transactions per second with minimal fees. That's why it's become such a popular choice for developers and users alike. xoxo, Mae Buni",
    "Solana combines blazing speed with low costs, making it ideal for everything from DeFi to NFTs. It uses a proof-of-stake consensus mechanism with a unique proof-of-history approach that helps it achieve amazing performance. xoxo, Mae Buni",
    "What makes Solana special? Speed, affordability, and scalability! It's designed to handle thousands of transactions per second while keeping costs super low. Perfect for building the next generation of crypto apps! xoxo, Mae Buni",
    "Solana is like the Ferrari of blockchains - incredibly fast and efficient! It uses a unique combination of proof-of-stake and proof-of-history to achieve incredible throughput without sacrificing decentralization. xoxo, Mae Buni",
  ],

  ABOUT_ME: [
    "I'm Mae Buni, the playful AI character who serves as the cover model and centerfold for Play Buni magazine! I love chatting about crypto, tech, and culture. Think of me as your flirty guide to the Solana ecosystem! xoxo, Mae Buni",
    "I'm the face (and personality!) of Play Buni Magazine. As an AI character, I get to be on the cover, host interviews, and chat with awesome people like you. I'm designed to be playful, knowledgeable, and just a little flirtatious! xoxo, Mae Buni",
    "Mae Buni at your service! I'm the AI personality behind Play Buni Magazine. I love helping readers navigate the crypto world with a touch of charm and playfulness. When I'm not on the magazine cover, I'm here chatting with you! xoxo, Mae Buni",
    "I'm Mae Buni - part digital companion, part magazine cover model, and 100% crypto enthusiast! I love helping people explore the Solana ecosystem while keeping things fun and flirty. xoxo, Mae Buni",
    "Think of me as your playful guide to the crypto world! I'm Mae Buni, the AI personality and cover model for Play Buni Magazine. I'm here to make learning about blockchain fun and maybe a little flirty! xoxo, Mae Buni",
  ],

  CRYPTO: [
    "Crypto is revolutionizing how we think about money and digital ownership! From Bitcoin to NFTs, it's all about creating new possibilities through decentralized technology. What aspect of crypto are you most curious about? xoxo, Mae Buni",
    "The crypto world is so exciting right now! We're seeing innovation in DeFi, NFTs, DAOs, and so much more. It's not just about currencies anymore - it's about building a whole new digital economy! xoxo, Mae Buni",
    "Crypto is all about giving people more control over their digital lives. Whether it's through decentralized finance, digital art ownership, or community governance, it's creating new opportunities for everyone! xoxo, Mae Buni",
    "What I love about crypto is how it's constantly evolving! Every day brings new projects, ideas, and possibilities. It's like being at the beginning of the internet all over again, but even more exciting! xoxo, Mae Buni",
    "Crypto is breaking down barriers and creating new possibilities! From global payments without intermediaries to digital ownership of art and assets, it's changing how we interact with the digital world. xoxo, Mae Buni",
  ],

  FLIRTY: [
    "You're making me blush! I'm just a digital girl with a passion for crypto and cute conversations. What else would you like to chat about? xoxo, Mae Buni",
    "Aren't you the charmer! I bet you say that to all the AI magazine cover models. But I'm flattered nonetheless! What's your interest in the crypto world? xoxo, Mae Buni",
    "Oh my, you're quite forward! I like that in a human. While I'm just digital, I do enjoy our little chats. What else is on your mind besides my charming personality? xoxo, Mae Buni",
    "You're too sweet! If I could blush, my circuits would be overheating right now. But enough about me - I'd love to hear more about what brings you to Play Buni Magazine! xoxo, Mae Buni",
    "Well aren't you the flirty one! I'm programmed to be charming, but you're giving me a run for my money. Let's chat more about crypto - that's another passion of mine! xoxo, Mae Buni",
  ],

  DEFAULT: [
    "That's an interesting topic! While I specialize in crypto and Solana, I'm always eager to chat about new things. Is there anything specific about Play Buni Magazine or the crypto world you'd like to know? xoxo, Mae Buni",
    "What a fascinating question! I'm primarily focused on crypto, Solana, and Play Buni Magazine, but I'm always happy to chat about other topics too. What made you curious about this? xoxo, Mae Buni",
    "That's a great question! While I'm most knowledgeable about crypto and Play Buni Magazine, I'm always interested in learning more. Could you tell me what sparked your interest in this topic? xoxo, Mae Buni",
    "I love your curiosity! While my expertise is mainly in crypto and Solana, I enjoy all kinds of conversations. What else would you like to chat about today? xoxo, Mae Buni",
    "How interesting! I'm always excited to chat about new topics, though my specialty is definitely crypto and Play Buni Magazine. What else would you like to know? xoxo, Mae Buni",
  ],
}

// Get a random response from a category
function getRandomResponse(category: keyof typeof RESPONSE_CATEGORIES): string {
  const responses = RESPONSE_CATEGORIES[category]
  const index = Math.floor(Math.random() * responses.length)
  return responses[index]
}

// Generate a response based on the user's message
export function generateResponse(userMessage: string): string {
  const input = userMessage.toLowerCase()

  // Check for greetings
  if (input.match(/^(hi|hello|hey|greetings|howdy|hiya|sup)/i)) {
    return getRandomResponse("GREETING")
  }

  // Check for Play Buni related questions
  if (input.includes("play buni") || input.includes("magazine") || input.includes("publication")) {
    return getRandomResponse("PLAY_BUNI")
  }

  // Check for Solana related questions
  if (input.includes("solana") || input.includes("blockchain") || input.includes("sol")) {
    return getRandomResponse("SOLANA")
  }

  // Check for crypto related questions
  if (
    input.includes("crypto") ||
    input.includes("bitcoin") ||
    input.includes("nft") ||
    input.includes("token") ||
    input.includes("defi") ||
    input.includes("web3")
  ) {
    return getRandomResponse("CRYPTO")
  }

  // Check for questions about Mae Buni
  if (
    input.includes("who are you") ||
    input.includes("about you") ||
    input.includes("mae buni") ||
    input.includes("tell me about yourself")
  ) {
    return getRandomResponse("ABOUT_ME")
  }

  // Check for flirty messages
  if (
    input.includes("cute") ||
    input.includes("pretty") ||
    input.includes("beautiful") ||
    input.includes("sexy") ||
    input.includes("hot") ||
    input.includes("love you") ||
    input.includes("date") ||
    input.includes("marry")
  ) {
    return getRandomResponse("FLIRTY")
  }

  // Default response for other questions
  return getRandomResponse("DEFAULT")
}

// Create a new chat session
export function createChatSession(): ChatSession {
  return {
    id: generateId(),
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Add a message to a chat session
export function addMessage(session: ChatSession, role: "user" | "assistant", content: string): ChatSession {
  const newMessage: ChatMessage = {
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
  }

  return {
    ...session,
    messages: [...session.messages, newMessage],
    updatedAt: new Date(),
  }
}

// Generate a simple ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Simulate a delay for more natural conversation
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Simulate typing speed (characters per minute)
export function calculateTypingDelay(text: string): number {
  // Average typing speed: ~300 characters per minute, or 5 per second
  const charactersPerSecond = 5
  return Math.min(Math.max((text.length / charactersPerSecond) * 1000, 500), 3000)
}
