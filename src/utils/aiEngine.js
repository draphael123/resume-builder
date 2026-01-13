import { useStore } from '../store/useStore'

// Interview state tracking
let interviewState = {
  currentTopic: 'experience', // 'experience' | 'skills' | 'education' | 'summary' | 'complete'
  experienceIndex: 0,
  questionsAsked: 0,
  maxQuestions: 15,
  gatheredInfo: {
    experiences: [],
    skills: [],
    education: [],
    summary: '',
  }
}

// Question templates for different topics
const questionTemplates = {
  experience: [
    {
      question: (data) => `Tell me more about your role at ${data.company || 'your company'}. What were your primary responsibilities?`,
      followUp: `Can you quantify the impact? For example, percentages, dollar amounts, or team sizes affected?`
    },
    {
      question: () => `What was your most significant achievement in this role? I'm looking for something that made a real difference.`,
      followUp: `That's a good start. Can you be more specific about the outcome? What changed as a result of your work?`
    },
    {
      question: () => `Were there any challenges or problems you solved that you're particularly proud of?`,
      followUp: `How did you approach solving that? What was the result?`
    },
    {
      question: () => `Did you lead any initiatives, projects, or teams? Tell me about your leadership experience.`,
      followUp: `What was the scope? How many people were involved?`
    },
  ],
  noExperience: [
    {
      question: () => `What's a project you've worked on that you're most proud of? This could be academic, personal, or volunteer work.`,
      followUp: `What technologies or skills did you use? What was the outcome?`
    },
    {
      question: () => `What skills have you been developing? Include both technical skills and soft skills.`,
      followUp: `How have you applied these skills? Any certifications or courses?`
    },
    {
      question: () => `Tell me about any leadership roles you've had - clubs, organizations, team projects, or volunteer work.`,
      followUp: `What did you accomplish in that role?`
    },
  ],
  skills: [
    {
      question: () => `Let's talk about your technical skills. What tools, technologies, or methodologies are you proficient in?`,
      followUp: `What's your level of expertise with each? Beginner, intermediate, or expert?`
    },
    {
      question: () => `What about soft skills? Communication, leadership, problem-solving - what sets you apart?`,
      followUp: `Can you give me an example of demonstrating that skill?`
    },
  ],
  education: [
    {
      question: () => `Tell me about your educational background. What degrees or certifications do you have?`,
      followUp: `Any relevant coursework, honors, or activities worth mentioning?`
    },
  ],
  summary: [
    {
      question: () => `Based on everything we've discussed, how would you describe your professional identity in one or two sentences?`,
      followUp: `What makes you unique compared to other candidates in your field?`
    },
  ],
}

// Light pushback responses for vague answers
const pushbackResponses = [
  "That's a good start, but can you add more specifics? Numbers, percentages, or concrete outcomes make a big difference.",
  "I'd like to understand this better. Can you elaborate on the specific impact or result?",
  "To make this more compelling, could you quantify the impact? Even approximate numbers help.",
  "That's helpful context. What was the measurable outcome of this work?",
]

// Detect if an answer is vague
function isVagueAnswer(answer) {
  const vagueIndicators = [
    'helped', 'assisted', 'worked on', 'was involved', 'contributed to',
    'various', 'multiple', 'many', 'some', 'stuff', 'things'
  ]
  const lowered = answer.toLowerCase()
  
  // Check for vague language
  const hasVagueWords = vagueIndicators.some(word => lowered.includes(word))
  
  // Check for lack of numbers
  const hasNumbers = /\d/.test(answer)
  
  // Short answers are often vague
  const isShort = answer.split(' ').length < 10
  
  return (hasVagueWords && !hasNumbers) || (isShort && !hasNumbers)
}

// Parse user response and update resume data
function parseAndUpdateResume(userMessage, topic) {
  const store = useStore.getState()
  
  // Extract skills if mentioned
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'leadership', 'communication',
    'project management', 'data analysis', 'machine learning', 'excel',
    'salesforce', 'marketing', 'design', 'photoshop', 'figma', 'html', 'css',
    'typescript', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin'
  ]
  
  const foundSkills = skillKeywords.filter(skill => 
    userMessage.toLowerCase().includes(skill.toLowerCase())
  )
  
  if (foundSkills.length > 0) {
    const currentSkills = store.resumeData.skills
    const newSkills = foundSkills.filter(s => !currentSkills.includes(s))
    if (newSkills.length > 0) {
      store.setSkills([...currentSkills, ...newSkills])
    }
  }
  
  // Extract achievements/bullet points from experience discussions
  if (topic === 'experience') {
    // Look for achievement-like statements
    const sentences = userMessage.split(/[.!]/).filter(s => s.trim().length > 10)
    
    sentences.forEach(sentence => {
      // Check if it sounds like an achievement
      const achievementIndicators = [
        'increased', 'decreased', 'improved', 'led', 'managed', 'created',
        'developed', 'launched', 'built', 'saved', 'generated', 'reduced',
        'achieved', 'delivered', 'implemented', 'designed', 'established'
      ]
      
      if (achievementIndicators.some(ind => sentence.toLowerCase().includes(ind))) {
        // This sounds like an achievement, could add to experience
        interviewState.gatheredInfo.experiences.push(sentence.trim())
      }
    })
  }
  
  return foundSkills.length > 0 || topic === 'experience'
}

// Get next question based on interview state
function getNextQuestion(userMessage) {
  const store = useStore.getState()
  const hasExperience = store.hasWorkExperience
  
  // Check if we should push back on vague answer
  if (isVagueAnswer(userMessage) && interviewState.questionsAsked > 1) {
    const pushback = pushbackResponses[Math.floor(Math.random() * pushbackResponses.length)]
    return {
      content: pushback,
      hint: 'Specific details make your resume stand out',
      isFollowUp: true
    }
  }
  
  // Parse the message and update resume data
  parseAndUpdateResume(userMessage, interviewState.currentTopic)
  
  interviewState.questionsAsked++
  
  // Determine current topic based on progress
  const topics = hasExperience 
    ? ['experience', 'experience', 'experience', 'skills', 'education', 'summary']
    : ['noExperience', 'noExperience', 'skills', 'education', 'summary']
  
  const topicIndex = Math.min(interviewState.questionsAsked - 1, topics.length - 1)
  interviewState.currentTopic = topics[topicIndex]
  
  // Check if interview should complete
  if (interviewState.questionsAsked >= interviewState.maxQuestions || 
      interviewState.currentTopic === 'summary' && interviewState.questionsAsked > topics.length) {
    return {
      content: `I think I have a good picture of your experience and skills now. Based on our conversation, I've built a resume that highlights:\n\n• Your key achievements and impact\n• Relevant skills and expertise\n• Your professional background\n\nTake a look at the preview on the right. You can customize the colors, fonts, and layout using the Customize button. When you're satisfied, click Download PDF to get your resume.\n\nIs there anything specific you'd like to add or change?`,
      isComplete: true
    }
  }
  
  // Get question for current topic
  const templates = questionTemplates[interviewState.currentTopic] || questionTemplates.experience
  const templateIndex = Math.floor(Math.random() * templates.length)
  const template = templates[templateIndex]
  
  const resumeData = store.resumeData
  const question = template.question(resumeData.experience[0] || {})
  
  return {
    content: question,
    hint: template.followUp ? 'Be specific with numbers and outcomes' : undefined
  }
}

// Main function to process user messages
export async function processUserMessage(userMessage) {
  const store = useStore.getState()
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
  
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

// Reset interview state (call when starting new interview)
export function resetInterviewState() {
  interviewState = {
    currentTopic: 'experience',
    experienceIndex: 0,
    questionsAsked: 0,
    maxQuestions: 15,
    gatheredInfo: {
      experiences: [],
      skills: [],
      education: [],
      summary: '',
    }
  }
}

