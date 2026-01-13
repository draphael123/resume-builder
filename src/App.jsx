import { useEffect } from 'react'
import { useStore } from './store/useStore'
import LandingPage from './components/LandingPage'
import ParsingPage from './components/ParsingPage'
import InterviewPage from './components/InterviewPage'
import Header from './components/Header'

function App() {
  const { currentStep, darkMode } = useStore()
  
  // Handle dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  
  // Browser warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentStep === 'interview' || currentStep === 'complete') {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [currentStep])
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return <LandingPage />
      case 'parsing':
        return <ParsingPage />
      case 'interview':
      case 'complete':
        return <InterviewPage />
      default:
        return <LandingPage />
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {renderCurrentStep()}
      </main>
    </div>
  )
}

export default App

