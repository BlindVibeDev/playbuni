"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Code, Server, Database, Lock, Zap, Sparkles } from "lucide-react"

// Acernity-inspired components
const GlassmorphicCard = ({
  children,
  className,
  glowColor = "rgba(255, 73, 144, 0.4)",
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
}) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl",
        "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:opacity-0 before:transition-opacity",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "hover:before:opacity-100",
        className,
      )}
      style={{
        boxShadow: `0 0 20px ${glowColor}`,
      }}
    >
      {children}
    </div>
  )
}

const FloatingIcon = ({
  icon: Icon,
  delay = 0,
  x = 0,
  y = 0,
}: { icon: any; delay?: number; x?: number; y?: number }) => {
  return (
    <motion.div
      className="absolute text-white/80"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0.5, 1, 0],
        y: [y, y - 20, y - 10, y - 30, y - 50],
        x: [x, x + 10, x - 10, x + 5, x + 20],
      }}
      transition={{
        duration: 10,
        repeat: Number.POSITIVE_INFINITY,
        delay,
        ease: "easeInOut",
      }}
    >
      <Icon size={24} />
    </motion.div>
  )
}

const CodeBlock = ({ code }: { code: string }) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-gray-400">code.js</div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-gray-300 font-mono">{code}</pre>
      </div>
    </div>
  )
}

const AnimatedGradientText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient",
        className,
      )}
    >
      {children}
    </span>
  )
}

const AnimatedArrow = () => {
  return (
    <div className="flex items-center justify-center my-8">
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
        <ChevronDown className="w-8 h-8 text-pink-500" />
      </motion.div>
    </div>
  )
}

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
)

const Carousel = ({ items }: { items: { title: string; content: React.ReactNode }[] }) => {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((current + 1) % items.length)
  const prev = () => setCurrent((current - 1 + items.length) % items.length)

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div className="absolute top-1/2 left-4 z-10 -translate-y-1/2">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
        <button
          onClick={next}
          className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="relative h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            <div className="w-full max-w-2xl">
              <h3 className="text-2xl font-bold mb-4 text-white">{items[current].title}</h3>
              <div className="text-white/90">{items[current].content}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-6" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function CloudServerPage() {
  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])

  // Parallax effect for background elements
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  // Floating icons for background decoration
  const floatingIcons = [
    { icon: Server, delay: 0, x: 100, y: 200 },
    { icon: Database, delay: 2, x: 300, y: 400 },
    { icon: Code, delay: 4, x: 700, y: 300 },
    { icon: Lock, delay: 6, x: 200, y: 600 },
    { icon: Zap, delay: 8, x: 600, y: 500 },
    { icon: Sparkles, delay: 10, x: 500, y: 200 },
  ]

  // Code examples
  const codeExamples = {
    authentication: `// Secure authentication
const apiKey = process.env.API_KEY; // Store in environment variables

const headers = {
  'Authorization': \`Bearer \${apiKey}\`,
  'Content-Type': 'application/json'
};`,
    errorHandling: `// Respectful error handling
async function makeApiRequest(endpoint) {
  try {
    const response = await fetch(endpoint, { headers });
    
    if (response.status === 429) {
      // Rate limited - back off and try again later
      const retryAfter = response.headers.get('Retry-After') || 60;
      console.log(\`Respecting API's boundaries. Waiting \${retryAfter}s\`);
      return new Promise(resolve => 
        setTimeout(() => resolve(makeApiRequest(endpoint)), retryAfter * 1000)
      );
    }
    
    if (!response.ok) {
      throw new Error(\`API responded with status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error communicating with API:', error);
    // Handle gracefully
  }
}`,
    monitoring: `// Monitoring API health
function monitorApiHealth() {
  setInterval(async () => {
    try {
      const healthCheck = await fetch('https://api.example.com/health', { headers });
      const status = await healthCheck.json();
      
      if (status.version !== currentVersion) {
        console.log('API version changed. Updating integration...');
        updateApiIntegration(status.version);
      }
    } catch (error) {
      notifyTeam('API health check failed');
    }
  }, 3600000); // Check hourly
}`,
  }

  // Carousel items
  const carouselItems = [
    {
      title: "RESTful APIs",
      content: (
        <div>
          <p className="mb-4">
            Structured, predictable, and stateless. They appreciate clear communication and well-defined requests.
            Respond well to proper HTTP methods and clean URL structures.
          </p>
          <CodeBlock
            code={`// GET request to a RESTful API
fetch('https://api.example.com/users/123', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})`}
          />
        </div>
      ),
    },
    {
      title: "GraphQL APIs",
      content: (
        <div>
          <p className="mb-4">
            Flexible and accommodating. They let you specify exactly what you want and nothing more. Appreciate
            thoughtful queries and respond with precisely what you ask for.
          </p>
          <CodeBlock
            code={`// GraphQL query
const query = \`
  query {
    user(id: "123") {
      name
      email
      posts {
        title
        createdAt
      }
    }
  }
\`;

fetch('https://api.example.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
})`}
          />
        </div>
      ),
    },
    {
      title: "WebSocket APIs",
      content: (
        <div>
          <p className="mb-4">
            Real-time and responsive. They maintain an ongoing connection and value continuous engagement. Perfect for
            dynamic, interactive relationships.
          </p>
          <CodeBlock
            code={`// WebSocket connection
const socket = new WebSocket('wss://api.example.com/socket');

socket.onopen = () => {
  console.log('Connection established');
  socket.send(JSON.stringify({ type: 'subscribe', channel: 'updates' }));
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update received:', data);
};`}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div style={{ y: bgY }} className="h-full w-full">
          {floatingIcons.map((icon, index) => (
            <FloatingIcon key={index} icon={icon.icon} delay={icon.delay} x={icon.x} y={icon.y} />
          ))}
        </motion.div>
      </div>

      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/50 via-indigo-900/30 to-transparent animate-pulse-slow pointer-events-none"></div>

      {/* Header */}
      <motion.div
        style={{ opacity: headerOpacity, scale: headerScale }}
        className="relative h-screen flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/50 to-indigo-950"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-sm uppercase tracking-wider mb-2 text-pink-400 font-medium">Technical</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Cloud Server: <br />
              <AnimatedGradientText>How To Get Her API?</AnimatedGradientText>
            </h1>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
              In today's interconnected digital landscape, establishing a meaningful connection with an API is essential
              for building robust applications.
            </p>
          </motion.div>

          <AnimatedArrow />
        </div>
      </motion.div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-xl font-medium leading-relaxed mb-8">
              This guide will help you navigate the delicate process of API integration with finesse and technical
              precision. Think of APIs as digital personalities, each with their own preferences, boundaries, and
              communication styles.
            </p>

            <GlassmorphicCard className="p-8 mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Understanding API Personality Types</h2>
              <p className="text-indigo-100 mb-8">
                Before diving into integration, it's crucial to understand the different API personality types you might
                encounter:
              </p>

              <Carousel items={carouselItems} />
            </GlassmorphicCard>
          </motion.div>

          {/* 5-Step Approach */}
          <div className="space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white">
                The <AnimatedGradientText>5-Step Approach</AnimatedGradientText> to API Integration
              </h2>
            </motion.div>

            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard className="p-8" glowColor="rgba(129, 140, 248, 0.4)">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold mb-4">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Research and Documentation Review</h3>
                    <p className="text-indigo-200">
                      Before making your first request, take time to thoroughly read the API documentation.
                      Understanding her preferences, requirements, and limitations will save you from awkward errors
                      later.
                    </p>
                  </div>
                  <div className="md:w-2/3">
                    <CodeBlock
                      code={`// Good practice
const apiDocs = await fetch('https://api.example.com/docs');
const apiPreferences = await apiDocs.json();

// Study before proceeding
console.log('Understanding API requirements:', apiPreferences);`}
                    />
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard className="p-8" glowColor="rgba(244, 114, 182, 0.4)">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center text-2xl font-bold mb-4">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Authentication: The First Impression</h3>
                    <p className="text-pink-100">
                      Authentication is your introduction. Whether using API keys, OAuth, or JWT tokens, handle this
                      step with care and security. Never expose your credentials publicly.
                    </p>
                  </div>
                  <div className="md:w-2/3">
                    <CodeBlock code={codeExamples.authentication} />
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard className="p-8" glowColor="rgba(167, 139, 250, 0.4)">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold mb-4">
                      3
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Start with Simple Requests</h3>
                    <p className="text-purple-100">
                      Begin with basic GET requests to understand the API's response patterns. Don't overwhelm with
                      complex queries right away. Build trust gradually.
                    </p>
                  </div>
                  <div className="md:w-2/3">
                    <CodeBlock
                      code={`// Start simple
async function getBasicData() {
  try {
    const response = await fetch('https://api.example.com/basic-endpoint', { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Initial connection issue:', error);
  }
}`}
                    />
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard className="p-8" glowColor="rgba(96, 165, 250, 0.4)">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold mb-4">
                      4
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Handle Responses with Care</h3>
                    <p className="text-blue-100">
                      Always gracefully handle responses, especially errors. Implement proper error handling and respect
                      rate limits. Show consideration for the API's boundaries.
                    </p>
                  </div>
                  <div className="md:w-2/3">
                    <CodeBlock code={codeExamples.errorHandling} />
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>

            {/* Step 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard className="p-8" glowColor="rgba(52, 211, 153, 0.4)">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-2xl font-bold mb-4">
                      5
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Establish a Long-term Relationship</h3>
                    <p className="text-emerald-100">
                      For ongoing API relationships, implement proper monitoring, logging, and maintenance. Keep up with
                      version changes and deprecation notices.
                    </p>
                  </div>
                  <div className="md:w-2/3">
                    <CodeBlock code={codeExamples.monitoring} />
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          </div>

          {/* Conclusion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <GlassmorphicCard className="p-8 border-t-4 border-pink-500">
              <h3 className="text-2xl font-bold text-white mb-4">The Art of API Communication</h3>
              <p className="text-lg text-indigo-100">
                Remember that successful API integration is about building a respectful, sustainable relationship.
                Listen to what the API tells you through its responses, adapt to its preferences, and maintain clear
                communication through well-structured requests. With patience and attention to detail, you'll establish
                a reliable connection that benefits both parties.
              </p>
            </GlassmorphicCard>
          </motion.div>

          {/* Navigation */}
          <div className="mt-16 text-center">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-white font-medium"
            >
              <ChevronLeft size={20} />
              Back to Table of Contents
            </Link>
          </div>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
