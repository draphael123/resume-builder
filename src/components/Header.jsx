import { useStore } from '../store/useStore'
import { Moon, Sun, FileText, Sparkles } from 'lucide-react'

function Header() {
  const { darkMode, toggleDarkMode, currentStep } = useStore()
  
  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50">
      {/* Colorful top accent line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ResumeAI
                </span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-0.5">
                Interview-Powered Builder
              </p>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Step indicator */}
            {currentStep !== 'upload' && (
              <div className="hidden sm:flex items-center gap-1">
                {[
                  { id: 'parsing', label: 'Parse' },
                  { id: 'interview', label: 'Interview' },
                  { id: 'complete', label: 'Done' }
                ].map((step, index) => {
                  const isActive = currentStep === step.id
                  const isPast = ['parsing', 'interview', 'complete'].indexOf(currentStep) > index
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div 
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/25' 
                            : isPast
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                        }`}
                      >
                        {step.label}
                      </div>
                      {index < 2 && (
                        <div className={`w-6 h-0.5 mx-1 rounded ${
                          isPast ? 'bg-green-400' : 'bg-gray-200 dark:bg-slate-700'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 group overflow-hidden"
              aria-label="Toggle dark mode"
            >
              {/* Background glow */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 opacity-100' 
                  : 'bg-gradient-to-br from-indigo-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100'
              }`} />
              
              <div className="relative">
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500 transition-transform group-hover:rotate-45" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600 transition-transform group-hover:-rotate-12" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
