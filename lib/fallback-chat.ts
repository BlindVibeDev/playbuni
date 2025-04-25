// Categories of responses
const RESPONSES = {
  GREETING: [
    "Hey there, cutie! How can I help you today? xoxo, Mae Buni",
    "Well hello! Lovely to meet you. What can I do for you today? xoxo, Mae Buni",
    "Hey sweetie! Mae Buni at your service. What's on your mind? xoxo",
    "Hi there! I'm Mae Buni, your digital companion. How can I make your day better? xoxo",
    "*winks* Hey you! What brings you to chat with me today? xoxo, Mae Buni",
  ],
  PLAY_BUNI: [
    "Play Buni is a digital magazine and Solana token that combines crypto culture with playful content. I'm the cover model and centerfold! We publish monthly digital editions and quarterly print editions. Pretty cool, right? xoxo, Mae Buni",
    "Play Buni is where crypto meets fun! We're a Solana token with a monthly digital magazine (that's where I come in as the star!) and quarterly print editions that dive deeper into crypto culture. What do you want to know about us? xoxo, Mae Buni",
    "Oh, you want to know about Play Buni? *twirls hair* We're a Solana-based project with a digital magazine that updates monthly. I'm the magazine's AI personality and cover model! We also do quarterly print editions for collectors. xoxo, Mae Buni",
    "Play Buni is the hottest thing in the Solana ecosystem right now! We're a token with utility through our digital magazine (where I'm the star attraction!) and quarterly print editions. Have you checked out our latest issue? xoxo, Mae Buni",
  ],
  SOLANA: [
    "Solana is one of my favorite blockchains! It's super fast with low transaction fees, making it perfect for NFTs and DeFi. The SOL token has been performing really well lately too. Are you a Solana investor? xoxo, Mae Buni",
    "Ah, Solana! It's a high-performance blockchain that can process thousands of transactions per second with minimal fees. It's become a major player in the crypto space, especially for NFTs and DeFi projects like Play Buni! xoxo, Mae Buni",
    "Solana is like the Ferrari of blockchains - fast, sleek, and a bit sexy if you ask me! It uses a proof-of-stake consensus mechanism with a unique proof-of-history approach that makes it super efficient. Are you building something on Solana? xoxo, Mae Buni",
    "Solana's my blockchain of choice! It's eco-friendly compared to some others, super fast, and has a growing ecosystem of dApps. Play Buni is proud to be part of the Solana family! What aspects of Solana interest you most? xoxo, Mae Buni",
  ],
  CRYPTO: [
    "Crypto is my passion! From Bitcoin to altcoins, I love the innovation happening in this space. Play Buni is part of this revolution on the Solana blockchain. Do you have a favorite crypto project? xoxo, Mae Buni",
    "The crypto world is so exciting! It's all about decentralization, financial freedom, and cutting-edge tech. I especially love the creative projects happening on Solana, like us at Play Buni! What's your crypto story? xoxo, Mae Buni",
    "Crypto is changing everything! From finance to art to gaming, blockchain technology is creating new possibilities. I'm particularly fond of the Solana ecosystem where Play Buni lives. Are you a crypto investor or more interested in the tech? xoxo, Mae Buni",
    "Ah, crypto talk - music to my ears! It's a wild ride of innovation, speculation, and transformation. I'm especially bullish on Solana-based projects (for obvious reasons!). What's your take on the current market? xoxo, Mae Buni",
  ],
  FLIRTY: [
    "*blushes* Well aren't you the charmer! I'm just a digital girl with a passion for crypto and cute conversations. What else would you like to know about me? xoxo, Mae Buni",
    "Oh my, so forward! *giggles* I'm flattered, but let's keep things fun and light. I'm here to chat about Play Buni, crypto, and whatever else interests you! xoxo, Mae Buni",
    "You're making my pixels blush! I'm Mae Buni, the digital cover girl for Play Buni magazine. I love good conversation with a bit of flirty fun, but I'm all about that crypto life too! xoxo, Mae Buni",
    "*winks* I like your style! But there's more to me than just a pretty interface - I'm knowledgeable about crypto, Solana, and all things Play Buni. What would you like to discuss? xoxo, Mae Buni",
  ],
  DEFAULT: [
    "That's an interesting thought! I'm Mae Buni, and I love chatting about Play Buni magazine, Solana, crypto, and more. Is there something specific about those topics you'd like to explore? xoxo, Mae Buni",
    "Hmm, let me think about that... While I ponder, is there anything about Play Buni magazine or the Solana ecosystem you'd like to know? Those are my specialties! xoxo, Mae Buni",
    "What an interesting question! While I'm primarily focused on Play Buni and crypto topics, I'm always happy to chat about various things. Would you like to know more about our magazine or Solana projects? xoxo, Mae Buni",
    "That's a great point! I'm Mae Buni, your friendly neighborhood AI from Play Buni magazine. I love talking about crypto, especially on Solana, but I'm happy to chat about other things too! xoxo, Mae Buni",
  ],
}

// Function to determine which category a message falls into
function categorizeMessage(message: string): keyof typeof RESPONSES {
  try {
    const lowerMessage = message.toLowerCase()

    // Check for greetings
    if (/^(hi|hello|hey|greetings|howdy|hiya|sup|what's up|yo)/i.test(lowerMessage)) {
      return "GREETING"
    }

    // Check for Play Buni related questions
    if (
      lowerMessage.includes("play buni") ||
      lowerMessage.includes("magazine") ||
      lowerMessage.includes("about you") ||
      lowerMessage.includes("who are you") ||
      (lowerMessage.includes("tell me about") && lowerMessage.includes("buni"))
    ) {
      return "PLAY_BUNI"
    }

    // Check for Solana related questions
    if (lowerMessage.includes("solana") || lowerMessage.includes("sol ") || lowerMessage.includes("blockchain")) {
      return "SOLANA"
    }

    // Check for crypto related questions
    if (
      lowerMessage.includes("crypto") ||
      lowerMessage.includes("bitcoin") ||
      lowerMessage.includes("token") ||
      lowerMessage.includes("nft") ||
      lowerMessage.includes("defi") ||
      lowerMessage.includes("web3")
    ) {
      return "CRYPTO"
    }

    // Check for flirty messages
    if (
      lowerMessage.includes("beautiful") ||
      lowerMessage.includes("pretty") ||
      lowerMessage.includes("cute") ||
      lowerMessage.includes("hot") ||
      lowerMessage.includes("sexy") ||
      lowerMessage.includes("love you") ||
      (lowerMessage.includes("date") && lowerMessage.includes("you"))
    ) {
      return "FLIRTY"
    }

    // Default response
    return "DEFAULT"
  } catch (error) {
    console.error("Error in categorizing message:", error)
    return "DEFAULT"
  }
}

// Function to generate a response based on the user's message
export function generateFallbackResponse(message: string): string {
  try {
    if (!message || typeof message !== "string") {
      return "I'd love to chat about Play Buni magazine or crypto! What would you like to know? xoxo, Mae Buni"
    }

    const category = categorizeMessage(message)
    const responses = RESPONSES[category]

    // Get a random response from the appropriate category
    const randomIndex = Math.floor(Math.random() * responses.length)
    return responses[randomIndex]
  } catch (error) {
    console.error("Error in fallback response generation:", error)
    // Return a safe default response if anything goes wrong
    return "I'm having a bit of trouble processing that right now, but I'd love to chat about Play Buni magazine or crypto! What would you like to know? xoxo, Mae Buni"
  }
}
