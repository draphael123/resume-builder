import { useStore } from '../store/useStore'

// Interview state tracking
let interviewState = {
  currentTopic: 'experience',
  experienceIndex: 0,
  questionsAsked: 0,
  maxQuestions: 15,
  usedPushbacks: [], // Track which pushbacks we've used
  usedQuestions: [], // Track which questions we've used
  lastPushbackIndex: -1,
  gatheredInfo: {
    experiences: [],
    skills: [],
    education: [],
    summary: '',
  }
}

// Varied question templates for different topics
const questionTemplates = {
  experience: [
    {
      id: 'exp1',
      question: (data) => `Tell me more about your role at ${data.company || 'your most recent company'}. What were your primary responsibilities?`,
    },
    {
      id: 'exp2',
      question: () => `What was your most significant achievement in this role? I'm looking for something that made a real difference.`,
    },
    {
      id: 'exp3',
      question: () => `Were there any challenges or problems you solved that you're particularly proud of?`,
    },
    {
      id: 'exp4',
      question: () => `Did you lead any initiatives, projects, or teams? Tell me about your leadership experience.`,
    },
    {
      id: 'exp5',
      question: () => `What processes or systems did you improve or create? Walk me through a specific example.`,
    },
    {
      id: 'exp6',
      question: () => `How did you contribute to revenue, cost savings, or efficiency gains in your role?`,
    },
    {
      id: 'exp7',
      question: () => `What's something you built or delivered that you're especially proud of?`,
    },
    {
      id: 'exp8',
      question: () => `Tell me about a time you went above and beyond your job description. What happened?`,
    },
  ],
  noExperience: [
    {
      id: 'noexp1',
      question: () => `What's a project you've worked on that you're most proud of? This could be academic, personal, or volunteer work.`,
    },
    {
      id: 'noexp2',
      question: () => `What skills have you been developing? Include both technical skills and soft skills.`,
    },
    {
      id: 'noexp3',
      question: () => `Tell me about any leadership roles you've had - clubs, organizations, team projects, or volunteer work.`,
    },
    {
      id: 'noexp4',
      question: () => `What certifications, courses, or self-directed learning have you completed recently?`,
    },
    {
      id: 'noexp5',
      question: () => `Describe a group project where you made a significant contribution. What was your role?`,
    },
  ],
  skills: [
    {
      id: 'skill1',
      question: () => `Let's talk about your technical skills. What tools, technologies, or methodologies are you proficient in?`,
    },
    {
      id: 'skill2',
      question: () => `What about soft skills? Communication, leadership, problem-solving - what sets you apart?`,
    },
    {
      id: 'skill3',
      question: () => `Which of your skills do you consider to be at an expert level? How did you develop that expertise?`,
    },
  ],
  education: [
    {
      id: 'edu1',
      question: () => `Tell me about your educational background. What degrees or certifications do you have?`,
    },
    {
      id: 'edu2',
      question: () => `Were there any academic achievements, honors, or relevant coursework worth highlighting?`,
    },
  ],
  summary: [
    {
      id: 'sum1',
      question: () => `Based on everything we've discussed, how would you describe your professional identity in one or two sentences?`,
    },
    {
      id: 'sum2',
      question: () => `What makes you unique compared to other candidates in your field?`,
    },
  ],
}

// Extensive pushback responses - varied language for follow-up questions
const pushbackResponses = [
  // Asking for numbers/metrics
  "That sounds promising! Can you put a number on it? Even a rough estimate like 'about 20%' or 'around 50 people' helps paint the picture.",
  "Good foundation there. What were the actual results? Think metrics, percentages, dollar amounts, or time saved.",
  "I want to help you quantify this. How many people did this affect? What was the scale?",
  "Numbers really make achievements pop. Can you estimate the impact - maybe in terms of revenue, users, or percentage improvement?",
  "That's interesting context. What changed measurably as a result? Even ballpark figures work.",
  
  // Asking for specifics/details
  "Let's dig deeper into that. What specifically did YOU do versus the team?",
  "Walk me through the details a bit more. What was the situation, your action, and the outcome?",
  "Can you get more granular? I'd love to understand exactly what you contributed.",
  "That's a solid start. Now help me visualize it - what did success actually look like?",
  "Interesting! Tell me more about your specific role in making that happen.",
  
  // Encouraging stronger language
  "You might be underselling yourself here. What was the real impact of your work?",
  "Don't be modest! What tangible difference did this make for the business or team?",
  "I sense there's more to this story. What outcome are you most proud of?",
  "That sounds like there's a bigger win hiding in there. What results can you point to?",
  "Push yourself here - what's the strongest way you could describe this achievement?",
  
  // Probing for context
  "Help me understand the scope better. How big was this project? How long did it take?",
  "What problem were you actually solving? And how did your solution perform?",
  "Give me the before and after. What was the situation like before, and what changed?",
  "What would have happened if you hadn't done this work? That contrast can be powerful.",
  "Who benefited from this? Customers, teammates, the company? How many?",
  
  // Friendly but direct
  "I need a bit more here to make this shine on your resume. What concrete outcomes can you share?",
  "Almost there! Add one specific detail or number to make this really compelling.",
  "This has potential. Can you give me one measurable result to anchor it?",
  "Good direction! Now sharpen it with a specific example or metric.",
  "We can make this stronger. What's the most impressive thing about what you accomplished?",
]

// Transition phrases to vary the flow
const transitionPhrases = [
  "Great, let's explore another angle.",
  "Thanks for sharing that. Now,",
  "That's helpful context. Moving on,",
  "Perfect. Let me ask you about something else.",
  "Good stuff. Shifting gears a bit,",
  "Excellent. Here's another question for you:",
  "I appreciate that detail. Next,",
  "Got it. Let's talk about",
  "That gives me a good picture. Now,",
  "Noted. Let me ask you this:",
]

// Get a random item from array, avoiding recent picks
function getRandomUnused(array, usedIds, idKey = 'id') {
  const unused = array.filter(item => !usedIds.includes(item[idKey] || item))
  if (unused.length === 0) {
    // Reset if we've used everything
    usedIds.length = 0
    return array[Math.floor(Math.random() * array.length)]
  }
  return unused[Math.floor(Math.random() * unused.length)]
}

// Get pushback that hasn't been used recently
function getUniquePushback() {
  const available = pushbackResponses.filter((_, i) => !interviewState.usedPushbacks.includes(i))
  
  if (available.length === 0) {
    // Reset tracking if we've used all
    interviewState.usedPushbacks = []
    const index = Math.floor(Math.random() * pushbackResponses.length)
    interviewState.usedPushbacks.push(index)
    return pushbackResponses[index]
  }
  
  const randomIndex = pushbackResponses.indexOf(available[Math.floor(Math.random() * available.length)])
  interviewState.usedPushbacks.push(randomIndex)
  
  // Keep only last 10 to allow eventual reuse
  if (interviewState.usedPushbacks.length > 10) {
    interviewState.usedPushbacks.shift()
  }
  
  return pushbackResponses[randomIndex]
}

// Detect if an answer is vague
function isVagueAnswer(answer) {
  const vagueIndicators = [
    'helped', 'assisted', 'worked on', 'was involved', 'contributed to',
    'various', 'multiple', 'many', 'some', 'stuff', 'things', 'etc',
    'responsibilities included', 'responsible for', 'duties'
  ]
  const lowered = answer.toLowerCase()
  
  // Check for vague language
  const hasVagueWords = vagueIndicators.some(word => lowered.includes(word))
  
  // Check for lack of numbers
  const hasNumbers = /\d/.test(answer)
  
  // Short answers are often vague
  const wordCount = answer.split(' ').length
  const isShort = wordCount < 12
  
  // Very short answers are always considered vague
  if (wordCount < 6) return true
  
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
    'typescript', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest api',
    'tensorflow', 'pytorch', 'tableau', 'power bi', 'jira', 'confluence'
  ]
  
  const foundSkills = skillKeywords.filter(skill => 
    userMessage.toLowerCase().includes(skill.toLowerCase())
  )
  
  if (foundSkills.length > 0) {
    const currentSkills = store.resumeData.skills
    const newSkills = foundSkills.filter(s => 
      !currentSkills.map(cs => cs.toLowerCase()).includes(s.toLowerCase())
    )
    if (newSkills.length > 0) {
      store.setSkills([...currentSkills, ...newSkills.map(s => 
        s.charAt(0).toUpperCase() + s.slice(1)
      )])
    }
  }
  
  // Extract achievements from experience discussions
  if (topic === 'experience' || topic === 'noExperience') {
    const sentences = userMessage.split(/[.!]/).filter(s => s.trim().length > 15)
    
    sentences.forEach(sentence => {
      const achievementIndicators = [
        'increased', 'decreased', 'improved', 'led', 'managed', 'created',
        'developed', 'launched', 'built', 'saved', 'generated', 'reduced',
        'achieved', 'delivered', 'implemented', 'designed', 'established',
        'grew', 'streamlined', 'automated', 'optimized', 'transformed'
      ]
      
      if (achievementIndicators.some(ind => sentence.toLowerCase().includes(ind))) {
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
  
  // Check if we should push back on vague answer (but not too often)
  const shouldPushback = isVagueAnswer(userMessage) && 
                         interviewState.questionsAsked > 1 &&
                         Math.random() > 0.3 // 70% chance to pushback on vague answers
  
  if (shouldPushback) {
    return {
      content: getUniquePushback(),
      hint: 'Specific details help your resume stand out',
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
      (interviewState.currentTopic === 'summary' && interviewState.questionsAsked > topics.length + 1)) {
    
    const completionMessages = [
      `I think I have a solid picture of your background now. Based on our conversation, I've built a resume highlighting your key achievements and skills.\n\nCheck out the preview on the right - you can customize colors, fonts, and layout using the Customize button. When you're happy with it, hit Download PDF.\n\nAnything you'd like to add or change?`,
      `Excellent! I've gathered enough to create a compelling resume for you. Take a look at the preview and feel free to customize the styling.\n\nThe Customize panel lets you adjust colors, fonts, and layout. Once it looks good, download your PDF.\n\nWant to add anything else before we wrap up?`,
      `We've covered a lot of ground! Your resume is taking shape in the preview panel. Use the Customize button to tweak the design to your liking.\n\nWhen you're satisfied, click Download PDF to get your finished resume.\n\nAny final additions or changes?`,
    ]
    
    return {
      content: completionMessages[Math.floor(Math.random() * completionMessages.length)],
      isComplete: true
    }
  }
  
  // Get question for current topic, avoiding repeats
  const templates = questionTemplates[interviewState.currentTopic] || questionTemplates.experience
  const question = getRandomUnused(templates, interviewState.usedQuestions, 'id')
  interviewState.usedQuestions.push(question.id)
  
  // Add transition phrase occasionally (not on first question)
  let content = question.question(store.resumeData.experience[0] || {})
  if (interviewState.questionsAsked > 2 && Math.random() > 0.5) {
    const transition = transitionPhrases[Math.floor(Math.random() * transitionPhrases.length)]
    content = `${transition} ${content.charAt(0).toLowerCase() + content.slice(1)}`
  }
  
  return {
    content,
    hint: interviewState.questionsAsked <= 3 ? 'Be specific with numbers and outcomes' : undefined
  }
}

// Main function to process user messages
export async function processUserMessage(userMessage) {
  const store = useStore.getState()
  
  // Simulate AI processing delay (varied)
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))
  
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
    usedPushbacks: [],
    usedQuestions: [],
    lastPushbackIndex: -1,
    gatheredInfo: {
      experiences: [],
      skills: [],
      education: [],
      summary: '',
    }
  }
}
