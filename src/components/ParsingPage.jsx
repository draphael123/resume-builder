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
        
        // Add initial AI message based on what we found
        let initialMessage
        if (parsed.contact.name) {
          initialMessage = {
            role: 'ai',
            type: 'card',
            content: `Great, ${parsed.contact.name}! I've extracted some information from your resume. Now let's make it really shine.\n\nTo start, tell me about your most recent role. What was your biggest achievement or impact there? Be as specific as possible - numbers and outcomes help a lot.`,
          }
        } else {
          initialMessage = {
            role: 'ai',
            type: 'card',
            content: `I've processed your resume. Let's build something compelling together.\n\nFirst, let's get the basics right. What is your full name, and what type of role are you targeting with this resume?`,
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
          content: `I had some trouble reading your PDF, but no worries - we can build your resume together from scratch!\n\nLet's start with the basics. What is your full name and what type of role are you targeting?`,
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
