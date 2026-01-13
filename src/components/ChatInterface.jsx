import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Send, Bot, User, Loader2 } from 'lucide-react'
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
    
    // Add user message
    addMessage({
      role: 'user',
      type: 'chat',
      content: userMessage
    })
    
    // Process with AI
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
    
    // Focus back on input
    inputRef.current?.focus()
  }
  
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        
        {isAiTyping && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white dark:bg-dark-surface rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100 dark:border-dark-border">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI is analyzing your response...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            className="input-field flex-1"
            disabled={isAiTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isAiTyping}
            className="btn-primary !px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
          Press Enter to send • Be specific for better results
        </p>
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const isAI = message.role === 'ai'
  
  if (isAI && message.type === 'card') {
    return (
      <div className="flex items-start gap-3 animate-slide-up">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 max-w-xl">
          <div className="bg-white dark:bg-dark-surface rounded-2xl rounded-tl-none px-5 py-4 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-dark-border">
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
          {message.hint && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 ml-2">
              💡 {message.hint}
            </p>
          )}
        </div>
      </div>
    )
  }
  
  // User message (chat bubble style)
  return (
    <div className="flex items-start gap-3 justify-end animate-slide-up">
      <div className="max-w-xl">
        <div className="bg-primary-600 text-white rounded-2xl rounded-tr-none px-5 py-3 shadow-lg shadow-primary-600/20">
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </div>
    </div>
  )
}

export default ChatInterface

