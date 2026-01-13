import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { FileSearch, User, Briefcase, GraduationCap, Wrench, CheckCircle } from 'lucide-react'

const parsingSteps = [
  { id: 'reading', label: 'Reading PDF document...', icon: FileSearch },
  { id: 'contact', label: 'Extracting contact information...', icon: User },
  { id: 'experience', label: 'Analyzing work experience...', icon: Briefcase },
  { id: 'education', label: 'Identifying education...', icon: GraduationCap },
  { id: 'skills', label: 'Discovering skills...', icon: Wrench },
  { id: 'complete', label: 'Analysis complete!', icon: CheckCircle },
]

function ParsingPage() {
  const { 
    setCurrentStep, 
    setOriginalResumeText, 
    setResumeData,
    setHasWorkExperience,
    addMessage 
  } = useStore()
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [extractedData, setExtractedData] = useState(null)
  
  useEffect(() => {
    const parseResume = async () => {
      const file = window.uploadedFile
      if (!file) {
        setCurrentStep('upload')
        return
      }
      
      // Simulate parsing steps with realistic timing
      for (let i = 0; i < parsingSteps.length - 1; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
        setCurrentStepIndex(i + 1)
      }
      
      // Extract text from PDF using FileReader
      try {
        const text = await extractTextFromPDF(file)
        setOriginalResumeText(text)
        
        // Parse the extracted text
        const parsed = parseResumeText(text)
        setExtractedData(parsed)
        
        // Check if user has work experience
        const hasExperience = parsed.experience && parsed.experience.length > 0
        setHasWorkExperience(hasExperience)
        
        // Update store with parsed data
        setResumeData(parsed)
        
        // Final step complete
        setCurrentStepIndex(parsingSteps.length - 1)
        
        // Wait a moment then transition
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Add initial AI message
        const initialMessage = hasExperience
          ? {
              role: 'ai',
              type: 'card',
              content: `I've analyzed your resume and found some great content to work with. I noticed you have experience at ${parsed.experience[0]?.company || 'your previous company'}. Let's make your achievements stand out even more.\n\nTo start, I'd like to understand your most impactful work. What would you say was your single biggest accomplishment in your most recent role?`,
            }
          : {
              role: 'ai',
              type: 'card', 
              content: `I've analyzed your resume. I notice you may be early in your career or transitioning to a new field - that's perfectly fine! We'll focus on highlighting your skills, projects, and potential.\n\nLet's start with what you're most proud of. What skill or project have you worked on that you feel demonstrates your capabilities best?`,
            }
        
        addMessage(initialMessage)
        setCurrentStep('interview')
        
      } catch (error) {
        console.error('Error parsing PDF:', error)
        // Still proceed to interview but with empty data
        setOriginalResumeText('')
        addMessage({
          role: 'ai',
          type: 'card',
          content: `I had some trouble reading your PDF, but no worries - we can build your resume from scratch! Let's start with the basics.\n\nWhat is your full name and what type of role are you targeting?`,
        })
        setCurrentStep('interview')
      }
    }
    
    parseResume()
  }, [])
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4 animate-pulse-soft">
              <FileSearch className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analyzing Your Resume
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Our AI is extracting and understanding your information
            </p>
          </div>
          
          <div className="space-y-4">
            {parsingSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStepIndex
              const isComplete = index < currentStepIndex
              const isPending = index > currentStepIndex
              
              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800' 
                      : isComplete
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border opacity-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? 'bg-primary-500 text-white' 
                      : isComplete
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                  }`}>
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                    )}
                  </div>
                  <span className={`font-medium ${
                    isActive 
                      ? 'text-primary-700 dark:text-primary-300' 
                      : isComplete
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
          
          {/* Progress bar */}
          <div className="mt-8">
            <div className="h-2 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
                style={{ width: `${((currentStepIndex + 1) / parsingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple text extraction from PDF (simplified version)
async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        // For now, we'll use a simplified approach
        // In production, you'd use pdf.js for proper extraction
        const arrayBuffer = e.target.result
        const text = await extractTextSimple(arrayBuffer)
        resolve(text)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

async function extractTextSimple(arrayBuffer) {
  // Convert to string and try to extract readable text
  const uint8Array = new Uint8Array(arrayBuffer)
  let text = ''
  
  // Simple text extraction - look for text streams in PDF
  const decoder = new TextDecoder('utf-8', { fatal: false })
  const pdfString = decoder.decode(uint8Array)
  
  // Extract text between parentheses (PDF text strings)
  const textMatches = pdfString.match(/\(([^)]+)\)/g)
  if (textMatches) {
    text = textMatches
      .map(match => match.slice(1, -1))
      .filter(t => t.length > 1 && !/^[0-9.]+$/.test(t))
      .join(' ')
  }
  
  return text
}

function parseResumeText(text) {
  const data = {
    contact: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
  }
  
  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/)
  if (emailMatch) data.contact.email = emailMatch[0]
  
  // Extract phone
  const phoneMatch = text.match(/(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/)
  if (phoneMatch) data.contact.phone = phoneMatch[0]
  
  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/)
  if (linkedinMatch) data.contact.linkedin = 'https://' + linkedinMatch[0]
  
  // Try to extract name (usually at the beginning)
  const lines = text.split(/\s+/)
  if (lines.length >= 2) {
    // Assume first few words might be name if they look like proper nouns
    const potentialName = lines.slice(0, 3).filter(word => 
      word.length > 1 && 
      word[0] === word[0].toUpperCase() &&
      !/[@.]/.test(word)
    ).join(' ')
    if (potentialName) data.contact.name = potentialName
  }
  
  return data
}

export default ParsingPage

