'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User, MapPin, Clock, DollarSign, Plane } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  travelData?: {
    destination?: string
    dates?: string
    budget?: string
    travelers?: number
  }
}

interface SmartTravelAssistantProps {
  userLocation?: string
  currentBooking?: any
}

// Helper function to strip markdown formatting
const stripMarkdown = (text: string): string => {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold **text**
    .replace(/\*([^*]+)\*/g, '$1')      // Remove italic *text*
    .replace(/#{1,6}\s/g, '')           // Remove headers # ## ###
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Remove links [text](url)
    .replace(/`([^`]+)`/g, '$1')        // Remove code `text`
    .replace(/~~([^~]+)~~/g, '$1')      // Remove strikethrough ~~text~~
}

export function SmartTravelAssistant({ userLocation, currentBooking }: SmartTravelAssistantProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m your Smart Travel Assistant. I can help you plan trips, find the best deals, answer questions about your bookings, and provide real-time travel updates. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'Plan a trip to Bali',
        'Find cheap flights',
        'Check my booking status',
        'Best time to visit Japan'
      ]
    }
  ])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = (): void => {
    // Manual scroll within container instead of scrollIntoView
    const container = messagesEndRef.current?.parentElement
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const generateAssistantResponse = (userMessage: string): ChatMessage => {
    const message = userMessage.toLowerCase()
    let content = ''
    let suggestions: string[] = []
    let travelData: ChatMessage['travelData'] = undefined

    // Trip Planning Responses
    if (message.includes('plan') || message.includes('trip')) {
      if (message.includes('bali')) {
        content = `Great choice! Bali is perfect for ${new Date().getMonth() >= 4 && new Date().getMonth() <= 9 ? 'dry season visits' : 'fewer crowds'}. Here's what I recommend:

🏝️ **Best Areas**: Ubud (culture), Seminyak (beaches), Canggu (surf)
💰 **Budget**: $50-150/day depending on accommodation
⏰ **Best Time**: April-October (dry season)
🎯 **Must-Do**: Rice terraces, temples, volcano sunrise

Would you like me to create a custom Bali package for you?`
        suggestions = ['Create Bali package', 'Check flight prices', 'Find hotels in Ubud', 'Bali weather forecast']
        travelData = { destination: 'Bali', budget: '$50-150/day' }
      } else if (message.includes('japan') || message.includes('tokyo')) {
        content = `Japan is incredible! Here's your personalized Tokyo guide:

🌸 **Season**: ${new Date().getMonth() >= 2 && new Date().getMonth() <= 4 ? 'Cherry blossom season!' : new Date().getMonth() >= 8 && new Date().getMonth() <= 10 ? 'Perfect autumn colors' : 'Great time to visit'}
🎌 **Culture**: Temple visits, traditional neighborhoods, food tours
🍜 **Food**: Sushi, ramen, street food in Shibuya
🚇 **Transport**: JR Pass for unlimited train travel

I can find you the best flight deals and accommodations!`
        suggestions = ['Find Tokyo flights', 'Book JR Pass', 'Best Tokyo hotels', 'Japan visa requirements']
        travelData = { destination: 'Tokyo' }
      } else {
        content = `I'd love to help you plan an amazing trip! To give you the best recommendations, could you tell me:

📍 Where would you like to go?
📅 When are you planning to travel?
👥 How many people will be traveling?
💵 What's your approximate budget?

I'll create a personalized itinerary with the best deals and insider tips!`
        suggestions = ['Suggest popular destinations', 'Budget travel tips', 'Best travel months', 'Group travel options']
      }
    }
    
    // Flight Search
    else if (message.includes('flight') || message.includes('plane')) {
      content = `🛫 **Flight Search Assistant Active!**

I'm scanning across 50+ airlines for the best deals. Here's what I found:

Current trending routes:
• Jakarta → Bali: From $45 (1.5h flight)
• Jakarta → Singapore: From $89 (2h flight)  
• Jakarta → Kuala Lumpur: From $67 (2.5h flight)
• Jakarta → Bangkok: From $156 (3.5h flight)

💡 **Pro Tips**:
- Book Tuesday/Wednesday for 15% savings
- Flexibility with dates can save up to 40%
- Red-eye flights often 30% cheaper

What route are you looking for?`
      suggestions = ['Compare prices', 'Flexible date search', 'Set price alerts', 'Airport transfer options']
    }
    
    // Booking Status
    else if (message.includes('booking') || message.includes('status')) {
      if (currentBooking) {
        content = `📋 **Your Current Booking Status:**

🎯 **Trip**: ${currentBooking.destination || 'Custom Package'}  
📅 **Dates**: ${currentBooking.dates || 'TBD'}
💰 **Total**: ${currentBooking.total || '$0'} ETH
✅ **Services**: ${currentBooking.services?.length || 0} selected

📊 **Progress**: 
- Payment: ✅ Confirmed
- Services: 🟡 3/5 activated
- Journey: 🟡 In progress

Need help with any specific service?`
        suggestions = ['Trigger next service', 'Check payment status', 'Modify booking', 'Contact support']
      } else {
        content = `I don't see any active bookings in your account. Would you like to:

🎫 Browse available travel packages
✈️ Search for flights and hotels  
🏨 Explore accommodations
🎯 Create a custom itinerary

I can help you find amazing deals and plan the perfect trip!`
        suggestions = ['Browse packages', 'Search flights', 'Find hotels', 'Custom itinerary']
      }
    }
    
    // Weather & Best Time
    else if (message.includes('weather') || message.includes('best time')) {
      content = `🌤️ **Travel Weather Intelligence**

Based on global weather patterns and travel data:

**This Month** (${new Date().toLocaleDateString('en', { month: 'long' })}):
🏖️ **Beach Destinations**: Thailand, Philippines, Maldives
🏔️ **Mountain/Culture**: Nepal, Peru, Morocco
🌸 **City Breaks**: Japan, South Korea, Europe

**Climate Tips**:
- Monsoon season in SEA: May-October
- Europe peak season: June-August  
- Southern hemisphere winter: June-August

Where are you thinking of going?`
      suggestions = ['Beach destinations', 'Mountain adventures', 'City breaks', 'Monsoon-free zones']
    }
    
    // Budget & Deals
    else if (message.includes('cheap') || message.includes('budget') || message.includes('deal')) {
      content = `💰 **Budget Travel Expert Mode Activated!**

🔥 **Current Hot Deals**:
• Bali packages: 40% off (Limited time)
• Tokyo early bird: Save $200 
• Group bookings: Extra 15% off
• Crypto payments: 5% additional discount

💡 **Money-Saving Strategies**:
- Travel Tuesday/Wednesday: 20% savings
- Book 6-8 weeks ahead: Optimal pricing  
- Package deals: Save 25% vs separate bookings
- Shoulder season: 50% cheaper accommodations

What's your target budget per person?`
      suggestions = ['Under $500 trips', '$500-1000 packages', 'Luxury budget options', 'Group discounts']
    }
    
    // Default Response
    else {
      content = `I understand you're asking about "${userMessage}". As your travel assistant, I can help with:

✈️ **Trip Planning**: Custom itineraries worldwide
🔍 **Price Comparison**: Best deals across providers  
📱 **Booking Management**: Real-time status updates
🌍 **Destination Insights**: Weather, culture, tips
💳 **Smart Payments**: Crypto integration & rewards

What specific aspect would you like help with?`
      suggestions = ['Plan a new trip', 'Check flight prices', 'Destination advice', 'Booking help']
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      suggestions,
      travelData
    }
  }

  const sendMessage = async (): Promise<void> => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI processing time
    setTimeout(() => {
      const assistantResponse = generateAssistantResponse(inputMessage)
      setMessages(prev => [...prev, assistantResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string): void => {
    setInputMessage(suggestion)
    setTimeout(() => {
      sendMessage()
    }, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-full shadow-2xl hover:from-cyan-700 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center z-40"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Smart Assistant</div>
                <div className="text-green-400 text-xs flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {/* Avatar */}
                  <div className={`flex items-center gap-2 mb-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-cyan-600' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-3 w-3 text-white" />
                      ) : (
                        <Bot className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-3 rounded-xl ${
                    message.type === 'user'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">{stripMarkdown(message.content)}</div>
                    
                    {/* Travel Data Display */}
                    {message.travelData && (
                      <div className="mt-3 p-2 bg-black/40 rounded-lg border border-cyan-500/30">
                        <div className="text-xs text-cyan-400 mb-2">Quick Info</div>
                        {message.travelData.destination && (
                          <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
                            <MapPin className="h-3 w-3" />
                            {message.travelData.destination}
                          </div>
                        )}
                        {message.travelData.budget && (
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <DollarSign className="h-3 w-3" />
                            {message.travelData.budget}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.type === 'assistant' && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-xs text-gray-300 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about travel plans, deals, bookings..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-cyan-500"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-3 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-600 disabled:opacity-50 transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              Powered by AI • Real-time travel intelligence
            </div>
          </div>
        </div>
      )}
    </>
  )
}