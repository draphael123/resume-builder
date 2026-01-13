import { useCallback, useState } from 'react'
import { useStore } from '../store/useStore'
import { Upload, FileText, Sparkles, MessageSquare, Download, ArrowRight, Zap, Target, Award } from 'lucide-react'

function LandingPage() {
  const { setCurrentStep } = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  
  const handleFile = useCallback(async (file) => {
    setError('')
    
    if (!file) return
    
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }
    
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-main pattern-grid relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="floating-shapes" />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 shadow-lg">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Resume Builder
              </span>
            </div>
          </div>
          
          {/* Headline */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
              Create a Resume
              <span className="block gradient-text">
                That Stands Out
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Our AI interviews you to uncover your 
              <span className="text-blue-600 dark:text-blue-400 font-semibold"> best achievements</span>, then crafts a 
              <span className="text-purple-600 dark:text-purple-400 font-semibold"> compelling resume</span> that gets noticed.
            </p>
          </div>
          
          {/* Upload Zone */}
          <div 
            className={`relative card p-10 sm:p-14 transition-all duration-500 accent-border ${
              isDragging 
                ? 'ring-4 ring-blue-400 ring-opacity-50 scale-[1.02]' 
                : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Gradient border on drag */}
            {isDragging && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-pulse" />
            )}
            
            <div className="relative text-center">
              <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
                isDragging 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 scale-110 rotate-3' 
                  : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-pink-900/50'
              }`}>
                <Upload className={`w-12 h-12 transition-all duration-300 ${
                  isDragging ? 'text-white scale-110' : 'text-blue-600 dark:text-blue-400'
                }`} />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Drop Your Resume Here
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                or click below to browse your files
              </p>
              
              <label className="btn-primary cursor-pointer inline-flex items-center gap-3 text-lg glow-on-hover">
                <FileText className="w-6 h-6" />
                Choose PDF File
                <ArrowRight className="w-5 h-5" />
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </label>
              
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  PDF format
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  English only
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Max 10MB
                </span>
              </div>
              
              {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>
          </div>
          
          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: MessageSquare,
                title: 'Smart Interview',
                description: 'AI asks the right questions to uncover achievements you might overlook',
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-500/10 to-cyan-500/10',
              },
              {
                icon: Zap,
                title: 'Real-Time Preview',
                description: 'Watch your resume take shape as you answer each question',
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-500/10 to-pink-500/10',
              },
              {
                icon: Download,
                title: 'Instant PDF',
                description: 'Download a polished, ATS-friendly resume ready for applications',
                color: 'from-orange-500 to-red-500',
                bgColor: 'from-orange-500/10 to-red-500/10',
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 hover:border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Stats / Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center">
            {[
              { number: '50+', label: 'Color Themes', icon: Target },
              { number: '15+', label: 'AI Questions', icon: MessageSquare },
              { number: '100%', label: 'Free to Use', icon: Award },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.number}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
