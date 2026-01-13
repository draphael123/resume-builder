import { useStore } from '../store/useStore'
import { Moon, Sun, FileText } from 'lucide-react'

function Header() {
  const { darkMode, toggleDarkMode, currentStep } = useStore()
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                ResumeAI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">
                Interview-Powered Builder
              </p>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Step indicator */}
            {currentStep !== 'upload' && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className={`px-3 py-1 rounded-full ${currentStep === 'parsing' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-gray-400'}`}>
                  Parsing
                </span>
                <span className="text-gray-300 dark:text-gray-600">→</span>
                <span className={`px-3 py-1 rounded-full ${currentStep === 'interview' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-gray-400'}`}>
                  Interview
                </span>
                <span className="text-gray-300 dark:text-gray-600">→</span>
                <span className={`px-3 py-1 rounded-full ${currentStep === 'complete' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'text-gray-400'}`}>
                  Complete
                </span>
              </div>
            )}
            
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

