import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { FileSearch, User, Briefcase, GraduationCap, Wrench, CheckCircle } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'

// Set up pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

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
  
  useEffect(() => {
    const parseResume = async () => {
      const file = window.uploadedFile
      if (!file) {
        setCurrentStep('upload')
        return
      }
      
      // Progress through parsing steps
      for (let i = 0; i < parsingSteps.length - 1; i++) {
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300))
        setCurrentStepIndex(i + 1)
      }
      
      // Extract text from PDF
      try {
        const text = await extractTextFromPDF(file)
        const cleanedText = cleanText(text)
        setOriginalResumeText(cleanedText)
        
        // Parse the extracted text
        const parsed = parseResumeText(cleanedText)
        
        // Check if user has work experience
        const hasExperience = parsed.experience && parsed.experience.length > 0
        setHasWorkExperience(hasExperience)
        
        // Update store with parsed data
        setResumeData(parsed)
        
        // Final step complete
        setCurrentStepIndex(parsingSteps.length - 1)
        
        // Wait a moment then transition
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Add initial AI message - always start with name confirmation
        let initialMessage
        if (parsed.contact.name) {
          // Pre-populate the name and skip to role question
          initialMessage = {
            role: 'ai',
            type: 'card',
            content: `I found your name: **${parsed.contact.name}**. Is that correct?\n\nIf yes, tell me about your current or most recent job - what's your title and company?`,
          }
        } else {
          initialMessage = {
            role: 'ai',
            type: 'card',
            content: `Let's build an impressive resume together! I'll ask you a few questions to gather the key information.\n\n**First, what is your full name?**`,
          }
        }
        
        addMessage(initialMessage)
        setCurrentStep('interview')
        
      } catch (error) {
        console.error('Error parsing PDF:', error)
        // Proceed to interview with empty data
        setOriginalResumeText('')
        addMessage({
          role: 'ai',
          type: 'card',
          content: `I had some trouble reading your PDF, but no worries - we can build your resume together from scratch!\n\n**What is your full name?**`,
        })
        setCurrentStep('interview')
      }
    }
    
    parseResume()
  }, [])
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-main pattern-grid relative overflow-hidden">
      {/* Floating shapes */}
      <div className="floating-shapes" />
      
      <div className="relative z-10 max-w-lg w-full">
        <div className="card p-8 accent-border">
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse opacity-50 blur-xl" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                <FileSearch className="w-10 h-10 text-white" />
              </div>
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
              
              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-700 shadow-lg shadow-blue-500/10' 
                      : isComplete
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-300 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 opacity-50'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-110' 
                      : isComplete
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                  }`}>
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                    )}
                  </div>
                  <span className={`font-semibold ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                      : isComplete
                        ? 'text-green-700 dark:text-green-400'
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
            <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out relative"
                style={{ width: `${((currentStepIndex + 1) / parsingSteps.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
              {Math.round(((currentStepIndex + 1) / parsingSteps.length) * 100)}% complete
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Extract text from PDF using pdf.js
async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }
    
    return fullText
  } catch (error) {
    console.error('PDF.js extraction failed:', error)
    // Fallback: try simple extraction
    return fallbackExtraction(arrayBuffer)
  }
}

// Fallback text extraction
function fallbackExtraction(arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer)
  const decoder = new TextDecoder('utf-8', { fatal: false })
  const pdfString = decoder.decode(uint8Array)
  
  // Look for text in BT...ET blocks (PDF text objects)
  const textBlocks = []
  const btPattern = /BT[\s\S]*?ET/g
  const matches = pdfString.match(btPattern) || []
  
  for (const block of matches) {
    // Extract text from Tj and TJ operators
    const tjMatches = block.match(/\(([^)]*)\)\s*Tj/g) || []
    const tjTexts = tjMatches.map(m => {
      const match = m.match(/\(([^)]*)\)/)
      return match ? match[1] : ''
    })
    textBlocks.push(...tjTexts)
  }
  
  return textBlocks.join(' ')
}

// Clean extracted text - remove garbled characters
function cleanText(text) {
  if (!text) return ''
  
  // Remove non-printable characters and weird unicode
  let cleaned = text
    // Keep only printable ASCII and common unicode
    .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, ' ')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove isolated single characters (often noise)
    .replace(/\s[a-zA-Z]\s/g, ' ')
    .trim()
  
  // If the result is mostly garbage (high ratio of special chars), return empty
  const alphaNumCount = (cleaned.match(/[a-zA-Z0-9]/g) || []).length
  const totalCount = cleaned.length
  
  if (totalCount > 0 && alphaNumCount / totalCount < 0.5) {
    return ''
  }
  
  return cleaned
}

// Parse resume text into structured data
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
  
  if (!text || text.length < 10) return data
  
  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (emailMatch) data.contact.email = emailMatch[0]
  
  // Extract phone - various formats
  const phonePatterns = [
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/,
  ]
  for (const pattern of phonePatterns) {
    const match = text.match(pattern)
    if (match) {
      data.contact.phone = match[0]
      break
    }
  }
  
  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i)
  if (linkedinMatch) data.contact.linkedin = 'https://' + linkedinMatch[0].toLowerCase()
  
  // Extract name - look for capitalized words at the start
  const lines = text.split(/\n/)
  const firstLine = lines[0]?.trim() || ''
  
  // Name is usually the first prominent text
  const nameMatch = firstLine.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/)
  if (nameMatch) {
    data.contact.name = nameMatch[1]
  } else {
    // Try to find a name pattern anywhere in first few lines
    const namePattern = /([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const match = lines[i].match(namePattern)
      if (match && match[1].length < 40) {
        data.contact.name = match[1]
        break
      }
    }
  }
  
  // Look for common skills
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'Agile', 'Scrum', 'TypeScript', 'HTML', 'CSS',
    'Machine Learning', 'Data Analysis', 'Excel', 'Salesforce', 'Marketing',
    'Project Management', 'Leadership', 'Communication', 'C++', 'C#', 'Ruby',
    'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'MongoDB', 'PostgreSQL', 'Redis'
  ]
  
  const foundSkills = commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  )
  data.skills = foundSkills
  
  return data
}

export default ParsingPage
