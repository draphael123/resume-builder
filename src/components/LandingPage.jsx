import { useCallback, useState } from 'react'
import { useStore } from '../store/useStore'
import { Upload, FileText, Sparkles, MessageSquare, Download, ArrowRight } from 'lucide-react'

function LandingPage() {
  const { setCurrentStep, setOriginalResumeText } = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  
  const handleFile = useCallback(async (file) => {
    setError('')
    
    if (!file) return
    
    // Check file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }
    
    // Store file for parsing
    window.uploadedFile = file
    setCurrentStep('parsing')
  }, [setCurrentStep])
  
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])
  
  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0]
    handleFile(file)
  }, [handleFile])
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Headline */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Building
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Build a Resume That
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                Gets You Hired
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Upload your existing resume and let our AI conduct a professional interview 
              to create a compelling, polished document that showcases your best.
            </p>
          </div>
          
          {/* Upload Zone */}
          <div 
            className={`relative card p-8 sm:p-12 transition-all duration-300 animate-slide-up ${
              isDragging 
                ? 'ring-4 ring-primary-500 ring-opacity-50 bg-primary-50 dark:bg-primary-900/20' 
                : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                isDragging 
                  ? 'bg-primary-500 scale-110' 
                  : 'bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50'
              }`}>
                <Upload className={`w-10 h-10 transition-colors ${
                  isDragging ? 'text-white' : 'text-primary-600 dark:text-primary-400'
                }`} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Upload Your Resume
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Drag and drop your PDF here, or click to browse
              </p>
              
              <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Choose PDF File
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </label>
              
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                PDF format only • English resumes • Max 10MB
              </p>
              
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
          
          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: MessageSquare,
                title: 'Smart Interview',
                description: 'AI asks probing questions to uncover your achievements'
              },
              {
                icon: Sparkles,
                title: 'Real-Time Preview',
                description: 'Watch your resume build as you answer questions'
              },
              {
                icon: Download,
                title: 'Instant Download',
                description: 'Get a polished PDF ready for applications'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white/50 dark:bg-dark-surface/50 border border-gray-100 dark:border-dark-border animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

