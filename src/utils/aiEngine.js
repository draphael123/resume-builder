import { useStore } from '../store/useStore'

// Interview state tracking
let interviewState = {
  phase: 'name', // 'name' | 'role' | 'experience' | 'achievements' | 'skills' | 'education' | 'summary' | 'complete'
  questionsAsked: 0,
  usedPushbacks: [],
  currentExperience: null,
  achievementCount: 0,
}

// Get the question for each phase
function getPhaseQuestion(phase, store) {
  const questions = {
    name: [
      "Let's start with the basics. What is your full name?",
      "First things first - what's your full name as you'd like it to appear on your resume?",
      "To get started, please tell me your full name.",
    ],
    role: [
      "Great! What's your current or most recent job title, and at which company?",
      "What position do you currently hold (or most recently held), and where?",
      "Tell me about your current or last role - what was your title and company?",
    ],
    experience: [
      "How long were you in this role? And what were the dates (start and end)?",
      "What was the timeframe for this position? When did you start and end (or are you still there)?",
    ],
    achievements: [
      "Now for the important part - what were your top achievements in this role? Think about impact, numbers, and results.",
      "What accomplishments are you most proud of in this position? Be specific with metrics if you can.",
      "Tell me about your biggest wins in this job. What did you achieve? How did you make a difference?",
      "What results did you deliver? Think revenue, efficiency, team growth, projects completed.",
      "What's another achievement from this role you'd like to highlight?",
    ],
    skills: [
      "Let's talk skills. What technical skills, tools, and technologies are you proficient in?",
      "What are your key skills? List the technical tools, software, and methodologies you know well.",
    ],
    education: [
      "Tell me about your education. What degree(s) do you have, from which school(s), and when did you graduate?",
      "What's your educational background? Include degrees, schools, and graduation years.",
    ],
    summary: [
      "Finally, how would you summarize yourself professionally in 2-3 sentences? What makes you stand out?",
      "To wrap up, give me a brief professional summary - who are you and what value do you bring?",
    ],
  }
  
  const phaseQuestions = questions[phase] || questions.achievements
  return phaseQuestions[Math.floor(Math.random() * phaseQuestions.length)]
}

// Pushback responses for vague answers
const pushbackResponses = [
  "Can you be more specific? Numbers and concrete results make a big difference.",
  "That's a start - can you quantify the impact? Percentages, dollars, time saved?",
  "Help me understand the scale. How many people/projects/dollars were involved?",
  "What was the measurable outcome? Even estimates help.",
  "Push yourself here - what's the most impressive way to describe this?",
  "I need specifics to make this shine. What were the actual results?",
  "Good foundation. Now add a number or concrete outcome to make it pop.",
  "Don't undersell yourself! What tangible difference did you make?",
]

function getUniquePushback() {
  const available = pushbackResponses.filter((_, i) => !interviewState.usedPushbacks.includes(i))
  if (available.length === 0) {
    interviewState.usedPushbacks = []
    return pushbackResponses[0]
  }
  const selected = available[Math.floor(Math.random() * available.length)]
  interviewState.usedPushbacks.push(pushbackResponses.indexOf(selected))
  return selected
}

// Parse and save user responses based on current phase
function parseAndSaveResponse(userMessage, phase) {
  const store = useStore.getState()
  const message = userMessage.trim()
  
  switch (phase) {
    case 'name': {
      // Extract name - usually the whole message or first proper nouns
      let name = message
      // Clean up common prefixes
      name = name.replace(/^(my name is|i'm|i am|it's|its)\s+/i, '')
      // Capitalize properly
      name = name.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')
      // Limit to reasonable length
      if (name.length > 50) name = name.substring(0, 50)
      
      store.updateContactField('name', name)
      return true
    }
    
    case 'role': {
      // Extract job title and company
      let title = ''
      let company = ''
      
      // Common patterns: "Title at Company", "Title, Company", "Title @ Company"
      const patterns = [
        /^(.+?)\s+at\s+(.+)$/i,
        /^(.+?)\s*@\s*(.+)$/i,
        /^(.+?),\s*(.+)$/,
        /^(.+?)\s+for\s+(.+)$/i,
        /^(.+?)\s+with\s+(.+)$/i,
      ]
      
      let matched = false
      for (const pattern of patterns) {
        const match = message.match(pattern)
        if (match) {
          title = match[1].trim()
          company = match[2].trim()
          matched = true
          break
        }
      }
      
      if (!matched) {
        // Just use the whole thing as title if no pattern matches
        title = message
      }
      
      // Clean up
      title = title.replace(/^(i am|i'm|i was|as)\s+(a|an)?\s*/i, '')
      
      // Store in current experience
      interviewState.currentExperience = {
        title: title,
        company: company || 'Company',
        startDate: '',
        endDate: 'Present',
        achievements: []
      }
      
      return true
    }
    
    case 'experience': {
      // Extract dates
      const exp = interviewState.currentExperience
      if (!exp) return false
      
      // Look for date patterns
      const datePatterns = [
        /(\d{4})\s*[-–to]+\s*(present|\d{4}|current|now)/i,
        /(\w+\s+\d{4})\s*[-–to]+\s*(present|\w+\s+\d{4}|current|now)/i,
        /from\s+(\d{4}|\w+\s+\d{4})\s*(?:to|until|-)?\s*(present|\d{4}|\w+\s+\d{4}|current|now)?/i,
        /since\s+(\d{4}|\w+\s+\d{4})/i,
        /(\d+)\s*(?:years?|yrs?)/i,
      ]
      
      for (const pattern of datePatterns) {
        const match = message.match(pattern)
        if (match) {
          if (match[1]) exp.startDate = match[1]
          if (match[2]) exp.endDate = match[2].replace(/current|now/i, 'Present')
          break
        }
      }
      
      // Default if nothing found
      if (!exp.startDate) exp.startDate = '2020'
      
      return true
    }
    
    case 'achievements': {
      const exp = interviewState.currentExperience
      if (!exp) return false
      
      // Split by sentences or bullet-like patterns
      const achievements = message
        .split(/[.;]|\n|•|·|-(?=\s)/)
        .map(s => s.trim())
        .filter(s => s.length > 10)
      
      if (achievements.length > 0) {
        // Clean up and add each achievement
        achievements.forEach(achievement => {
          let cleaned = achievement
            .replace(/^(i\s+|we\s+)/i, '')
            .replace(/^(also\s+|and\s+)/i, '')
          
          // Capitalize first letter
          cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
          
          // Add if not duplicate
          if (!exp.achievements.includes(cleaned) && cleaned.length > 10) {
            exp.achievements.push(cleaned)
          }
        })
        
        interviewState.achievementCount++
        return true
      }
      
      return false
    }
    
    case 'skills': {
      // Extract skills from the message
      const skillsList = message
        .split(/[,;]|\band\b|\n/)
        .map(s => s.trim())
        .filter(s => s.length > 1 && s.length < 50)
        .map(s => {
          // Capitalize first letter
          return s.charAt(0).toUpperCase() + s.slice(1)
        })
      
      if (skillsList.length > 0) {
        store.setSkills(skillsList)
        return true
      }
      
      // Fallback: look for known skills
      const knownSkills = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
        'Kubernetes', 'Git', 'Agile', 'Scrum', 'TypeScript', 'HTML', 'CSS',
        'Machine Learning', 'Data Analysis', 'Excel', 'Salesforce', 'Marketing',
        'Project Management', 'Leadership', 'Communication', 'C++', 'C#', 'Ruby',
        'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'MongoDB', 'PostgreSQL', 'Redis',
        'Angular', 'Vue', 'GraphQL', 'REST API', 'TensorFlow', 'PyTorch'
      ]
      
      const found = knownSkills.filter(skill => 
        message.toLowerCase().includes(skill.toLowerCase())
      )
      
      if (found.length > 0) {
        store.setSkills(found)
        return true
      }
      
      return false
    }
    
    case 'education': {
      // Extract education info
      let degree = ''
      let school = ''
      let year = ''
      
      // Look for degree
      const degreePatterns = [
        /(bachelor'?s?|master'?s?|phd|ph\.d|doctorate|associate'?s?|mba|bs|ba|ms|ma)\s*(of|in|degree)?\s*([^,from]+)?/i,
        /(b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|m\.?b\.?a\.?)\s*(in)?\s*([^,from]+)?/i,
      ]
      
      for (const pattern of degreePatterns) {
        const match = message.match(pattern)
        if (match) {
          degree = match[0].trim()
          break
        }
      }
      
      // Look for school
      const schoolPatterns = [
        /(?:from|at)\s+([A-Z][^,.\d]+(?:University|College|Institute|School)[^,.\d]*)/i,
        /(?:from|at)\s+([A-Z][^,.]+)/i,
        /(University\s+of\s+[A-Z][^,.]+)/i,
        /([A-Z][a-z]+\s+(?:University|College|Institute|School))/i,
      ]
      
      for (const pattern of schoolPatterns) {
        const match = message.match(pattern)
        if (match) {
          school = match[1].trim()
          break
        }
      }
      
      // Look for year
      const yearMatch = message.match(/\b(19|20)\d{2}\b/)
      if (yearMatch) {
        year = yearMatch[0]
      }
      
      // Default if nothing parsed
      if (!degree) degree = message.substring(0, 50)
      
      store.addEducation({
        degree: degree,
        school: school || 'University',
        graduationDate: year || '',
        details: ''
      })
      
      return true
    }
    
    case 'summary': {
      // Save as professional summary
      let summary = message
        .replace(/^(i am|i'm|i would describe myself as)\s*/i, '')
        .trim()
      
      summary = summary.charAt(0).toUpperCase() + summary.slice(1)
      
      store.updateResumeField('summary', summary)
      return true
    }
    
    default:
      return false
  }
}

// Determine if answer is too vague
function isVagueAnswer(message) {
  const words = message.trim().split(/\s+/)
  return words.length < 5
}

// Get next question and advance phase
function getNextQuestion(userMessage) {
  const store = useStore.getState()
  
  // Save the response for current phase
  const saved = parseAndSaveResponse(userMessage, interviewState.phase)
  
  // Check for vague answers in achievement phase
  if (interviewState.phase === 'achievements' && isVagueAnswer(userMessage)) {
    return {
      content: getUniquePushback(),
      isFollowUp: true
    }
  }
  
  interviewState.questionsAsked++
  
  // Determine next phase
  const phaseOrder = ['name', 'role', 'experience', 'achievements', 'skills', 'education', 'summary', 'complete']
  const currentIndex = phaseOrder.indexOf(interviewState.phase)
  
  // Special handling for achievements - ask multiple times
  if (interviewState.phase === 'achievements' && interviewState.achievementCount < 3) {
    // Stay on achievements for a few more questions
    return {
      content: getPhaseQuestion('achievements', store),
      hint: 'Add another achievement or say "done" to move on'
    }
  }
  
  // Move to next phase
  if (interviewState.phase === 'achievements') {
    // Save the experience before moving on
    const exp = interviewState.currentExperience
    if (exp && exp.achievements.length > 0) {
      store.addExperience(exp)
    }
  }
  
  const nextPhase = phaseOrder[currentIndex + 1]
  interviewState.phase = nextPhase
  
  // Check if complete
  if (nextPhase === 'complete') {
    return {
      content: `Excellent! I've built your resume based on our conversation.\n\n✅ **${store.resumeData.contact.name}**\n✅ ${store.resumeData.experience.length} role(s) with achievements\n✅ ${store.resumeData.skills.length} skills\n✅ Education added\n\nCheck out the preview on the right! You can customize colors and fonts using the **Customize** button, then click **Download PDF** when you're ready.`,
      isComplete: true
    }
  }
  
  return {
    content: getPhaseQuestion(nextPhase, store),
  }
}

// Main function to process user messages
export async function processUserMessage(userMessage) {
  const store = useStore.getState()
  
  // Check for "done" or "skip" commands in achievements phase
  if (interviewState.phase === 'achievements') {
    const lower = userMessage.toLowerCase()
    if (lower.includes('done') || lower.includes('skip') || lower.includes('next') || lower.includes("that's all") || lower.includes("thats all")) {
      // Force move to next phase
      interviewState.achievementCount = 10 // Trigger phase change
    }
  }
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800))
  
  // Get next question
  const response = getNextQuestion(userMessage)
  
  // Add AI response
  store.addMessage({
    role: 'ai',
    type: 'card',
    content: response.content,
    hint: response.hint
  })
  
  // Check if interview is complete
  if (response.isComplete) {
    store.setInterviewComplete(true)
  }
}

// Reset interview state
export function resetInterviewState() {
  interviewState = {
    phase: 'name',
    questionsAsked: 0,
    usedPushbacks: [],
    currentExperience: null,
    achievementCount: 0,
  }
}
