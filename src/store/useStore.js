import { create } from 'zustand'

const colorSchemes = [
  { id: 'navy', name: 'Classic Navy', primary: '#1e3a5f', secondary: '#ffffff', accent: '#3b82f6' },
  { id: 'slate', name: 'Slate Gray', primary: '#475569', secondary: '#fefce8', accent: '#64748b' },
  { id: 'forest', name: 'Forest Green', primary: '#166534', secondary: '#fefdf5', accent: '#22c55e' },
  { id: 'burgundy', name: 'Burgundy', primary: '#7f1d1d', secondary: '#fef7f7', accent: '#dc2626' },
  { id: 'royal', name: 'Royal Blue', primary: '#1d4ed8', secondary: '#f8fafc', accent: '#60a5fa' },
  { id: 'charcoal', name: 'Charcoal & Gold', primary: '#374151', secondary: '#fffbeb', accent: '#f59e0b' },
  { id: 'teal', name: 'Teal', primary: '#0f766e', secondary: '#f0fdfa', accent: '#14b8a6' },
  { id: 'plum', name: 'Plum', primary: '#6b21a8', secondary: '#faf5ff', accent: '#a855f7' },
  { id: 'bronze', name: 'Bronze & Cream', primary: '#78350f', secondary: '#fffbeb', accent: '#d97706' },
  { id: 'midnight', name: 'Midnight Blue', primary: '#1e1b4b', secondary: '#ffffff', accent: '#6366f1' },
  { id: 'hunter', name: 'Hunter Green', primary: '#14532d', secondary: '#fef9e7', accent: '#4ade80' },
  { id: 'maroon', name: 'Maroon', primary: '#881337', secondary: '#fff1f2', accent: '#fb7185' },
  { id: 'steel', name: 'Steel Blue', primary: '#334155', secondary: '#f1f5f9', accent: '#94a3b8' },
  { id: 'espresso', name: 'Espresso', primary: '#44403c', secondary: '#fafaf9', accent: '#a8a29e' },
  { id: 'sapphire', name: 'Sapphire', primary: '#1e40af', secondary: '#eff6ff', accent: '#3b82f6' },
  { id: 'graphite', name: 'Graphite', primary: '#27272a', secondary: '#ffffff', accent: '#71717a' },
]

const fontOptions = [
  { id: 'georgia', name: 'Georgia', family: 'Georgia, serif', type: 'serif' },
  { id: 'times', name: 'Times New Roman', family: '"Times New Roman", serif', type: 'serif' },
  { id: 'garamond', name: 'Garamond', family: 'Garamond, serif', type: 'serif' },
  { id: 'palatino', name: 'Palatino', family: 'Palatino, serif', type: 'serif' },
  { id: 'arial', name: 'Arial', family: 'Arial, sans-serif', type: 'sans' },
  { id: 'calibri', name: 'Calibri', family: 'Calibri, sans-serif', type: 'sans' },
  { id: 'helvetica', name: 'Helvetica', family: 'Helvetica, sans-serif', type: 'sans' },
]

const layoutOptions = [
  { id: 'single', name: 'Single Column', description: 'Classic, ATS-friendly' },
  { id: 'two-column', name: 'Two Column', description: 'Modern, space-efficient' },
  { id: 'sidebar', name: 'Sidebar', description: 'Skills on side' },
]

const initialResumeData = {
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

export const useStore = create((set, get) => ({
  // App state
  currentStep: 'upload', // 'upload' | 'parsing' | 'interview' | 'complete'
  darkMode: false,
  
  // Resume data
  resumeData: initialResumeData,
  originalResumeText: '',
  hasWorkExperience: true,
  
  // Customization
  colorScheme: colorSchemes[0],
  font: fontOptions[0],
  layout: layoutOptions[0],
  colorSchemes,
  fontOptions,
  layoutOptions,
  
  // Conversation
  messages: [],
  isAiTyping: false,
  interviewComplete: false,
  
  // Parsing state
  parsingProgress: 0,
  parsingStatus: '',
  
  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  
  setResumeData: (data) => set((state) => ({
    resumeData: { ...state.resumeData, ...data }
  })),
  
  updateResumeField: (field, value) => set((state) => ({
    resumeData: { ...state.resumeData, [field]: value }
  })),
  
  updateContactField: (field, value) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      contact: { ...state.resumeData.contact, [field]: value }
    }
  })),
  
  addExperience: (exp) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      experience: [...state.resumeData.experience, exp]
    }
  })),
  
  updateExperience: (index, exp) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      experience: state.resumeData.experience.map((e, i) => i === index ? exp : e)
    }
  })),
  
  addEducation: (edu) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      education: [...state.resumeData.education, edu]
    }
  })),
  
  addSkill: (skill) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      skills: [...state.resumeData.skills, skill]
    }
  })),
  
  setSkills: (skills) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      skills
    }
  })),
  
  addCertification: (cert) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      certifications: [...state.resumeData.certifications, cert]
    }
  })),
  
  addProject: (project) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      projects: [...state.resumeData.projects, project]
    }
  })),
  
  setColorScheme: (scheme) => set({ colorScheme: scheme }),
  setFont: (font) => set({ font: font }),
  setLayout: (layout) => set({ layout: layout }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setIsAiTyping: (typing) => set({ isAiTyping: typing }),
  setInterviewComplete: (complete) => set({ interviewComplete: complete }),
  
  setParsingProgress: (progress) => set({ parsingProgress: progress }),
  setParsingStatus: (status) => set({ parsingStatus: status }),
  
  setOriginalResumeText: (text) => set({ originalResumeText: text }),
  setHasWorkExperience: (has) => set({ hasWorkExperience: has }),
  
  resetStore: () => set({
    currentStep: 'upload',
    resumeData: initialResumeData,
    originalResumeText: '',
    messages: [],
    isAiTyping: false,
    interviewComplete: false,
    parsingProgress: 0,
    parsingStatus: '',
  }),
}))

