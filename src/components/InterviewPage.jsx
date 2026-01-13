import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import ChatInterface from './ChatInterface'
import ResumePreview from './ResumePreview'
import CustomizationPanel from './CustomizationPanel'
import { Settings, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { generatePDF } from '../utils/pdfGenerator'

function InterviewPage() {
  const { interviewComplete, resumeData } = useStore()
  const [showCustomization, setShowCustomization] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [previewCollapsed, setPreviewCollapsed] = useState(false)
  
  const handleDownload = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDF('resume-preview')
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
    setIsGeneratingPDF(false)
  }
  
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCustomization(!showCustomization)}
            className={`btn-secondary flex items-center gap-2 !py-2 !px-4 ${
              showCustomization ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Customize</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewCollapsed(!previewCollapsed)}
            className="btn-secondary !py-2 !px-3 lg:hidden"
          >
            {previewCollapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={handleDownload}
            disabled={isGeneratingPDF}
            className="btn-primary flex items-center gap-2 !py-2 !px-4"
          >
            <Download className={`w-4 h-4 ${isGeneratingPDF ? 'animate-bounce' : ''}`} />
            <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Customization Panel (overlay on mobile, sidebar on desktop) */}
        {showCustomization && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowCustomization(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-80 z-50 lg:relative lg:z-0 bg-white dark:bg-dark-bg border-r border-gray-200 dark:border-dark-border overflow-y-auto">
              <CustomizationPanel onClose={() => setShowCustomization(false)} />
            </div>
          </>
        )}
        
        {/* Chat Interface */}
        <div className={`flex-1 flex flex-col min-w-0 ${previewCollapsed ? '' : 'lg:max-w-[50%]'}`}>
          <ChatInterface />
        </div>
        
        {/* Resume Preview */}
        <div className={`border-l border-gray-200 dark:border-dark-border bg-gray-100 dark:bg-slate-900 overflow-hidden transition-all duration-300 ${
          previewCollapsed 
            ? 'w-0 opacity-0' 
            : 'hidden lg:flex lg:w-1/2 lg:opacity-100'
        }`}>
          <ResumePreview />
        </div>
      </div>
    </div>
  )
}

export default InterviewPage

