import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { processUserMessage } from '../utils/aiEngine'

function ChatInterface() {
  const { messages, addMessage, isAiTyping, setIsAiTyping } = useStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isAiTyping) return
    
    const userMessage = input.trim()
    setInput('')
    
    addMessage({
      role: 'user',
      type: 'chat',
      content: userMessage
    })
    
    setIsAiTyping(true)
    try {
      await processUserMessage(userMessage)
    } catch (error) {
      console.error('Error processing message:', error)
      addMessage({
        role: 'ai',
        type: 'card',
        content: 'I encountered an issue processing that. Could you try rephrasing your response?'
      })
    }
    setIsAiTyping(false)
    
    inputRef.current?.focus()
  }
  
  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} index={index} />
        ))}
        
        {isAiTyping && (
          <div className="flex items-start gap-3 chat-bubble">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm px-5 py-4 shadow-lg border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              className="input-field pr-4"
              disabled={isAiTyping}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isAiTyping}
            className="btn-primary !px-5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
          >
            <Send className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </form>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
          💡 Be specific with numbers and results for a stronger resume
        </p>
      </div>
    </div>
  )
}

function MessageBubble({ message, index }) {
  const isAI = message.role === 'ai'
  
  if (isAI && message.type === 'card') {
    return (
      <div className="flex items-start gap-3 chat-bubble" style={{ animationDelay: `${index * 50}ms` }}>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
        <div className="flex-1 max-w-2xl">
          <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm px-5 py-4 shadow-lg border border-gray-100 dark:border-slate-700">
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
          {message.hint && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 ml-2 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                💡
              </span>
              {message.hint}
            </p>
          )}
        </div>
      </div>
    )
  }
  
  // User message
  return (
    <div className="flex items-start gap-3 justify-end chat-bubble" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="max-w-2xl">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-lg shadow-blue-500/20">
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center flex-shrink-0 shadow-md">
        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </div>
    </div>
  )
}

export default ChatInterface
