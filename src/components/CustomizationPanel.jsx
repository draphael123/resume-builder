import { useStore } from '../store/useStore'
import { X, Palette, Type, Layout, Check, SlidersHorizontal, AlignLeft, List, FileText, Eye, EyeOff, Minus, Circle, ChevronRight, Square } from 'lucide-react'

function CustomizationPanel({ onClose }) {
  const { 
    colorSchemes, 
    fontOptions, 
    layoutOptions,
    colorScheme,
    font,
    layout,
    setColorScheme,
    setFont,
    setLayout,
    // New settings
    settings,
    updateSettings,
  } = useStore()
  
  // Default settings if not in store
  const currentSettings = settings || {
    fontSize: 'medium',
    lineSpacing: 'normal',
    margins: 'normal',
    headerStyle: 'centered',
    bulletStyle: 'disc',
    showIcons: true,
    dateFormat: 'short',
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications'],
    hiddenSections: [],
  }
  
  const handleSettingChange = (key, value) => {
    updateSettings({ ...currentSettings, [key]: value })
  }
  
  const toggleSection = (section) => {
    const hidden = currentSettings.hiddenSections || []
    if (hidden.includes(section)) {
      handleSettingChange('hiddenSections', hidden.filter(s => s !== section))
    } else {
      handleSettingChange('hiddenSections', [...hidden, section])
    }
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Customize Resume
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors lg:hidden"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Color Schemes */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Color Theme</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setColorScheme(scheme)}
                className={`relative p-1 rounded-lg transition-all ${
                  colorScheme.id === scheme.id 
                    ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-dark-bg' 
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
                title={scheme.name}
              >
                <div className="w-full aspect-square rounded-md overflow-hidden flex">
                  <div 
                    className="w-1/2 h-full" 
                    style={{ backgroundColor: scheme.primary }}
                  />
                  <div 
                    className="w-1/2 h-full" 
                    style={{ backgroundColor: scheme.secondary }}
                  />
                </div>
                {colorScheme.id === scheme.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Selected: {colorScheme.name}
          </p>
        </section>
        
        {/* Fonts */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Type className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Font Style</h3>
          </div>
          <div className="space-y-2">
            {fontOptions.map((fontOption) => (
              <button
                key={fontOption.id}
                onClick={() => setFont(fontOption)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  font.id === fontOption.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500'
                    : 'bg-gray-50 dark:bg-dark-surface border-2 border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                }`}
              >
                <span 
                  className="text-base text-gray-900 dark:text-white"
                  style={{ fontFamily: fontOption.family }}
                >
                  {fontOption.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  ({fontOption.type})
                </span>
              </button>
            ))}
          </div>
        </section>
        
        {/* Layout */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Layout className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Layout Style</h3>
          </div>
          <div className="space-y-2">
            {layoutOptions.map((layoutOption) => (
              <button
                key={layoutOption.id}
                onClick={() => setLayout(layoutOption)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  layout.id === layoutOption.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500'
                    : 'bg-gray-50 dark:bg-dark-surface border-2 border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                }`}
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {layoutOption.name}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {layoutOption.description}
                </p>
              </button>
            ))}
          </div>
        </section>
        
        {/* Typography Settings */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Typography</h3>
          </div>
          
          {/* Font Size */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Font Size</label>
            <div className="flex gap-2">
              {[
                { id: 'small', label: 'S' },
                { id: 'medium', label: 'M' },
                { id: 'large', label: 'L' },
              ].map(size => (
                <button
                  key={size.id}
                  onClick={() => handleSettingChange('fontSize', size.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    currentSettings.fontSize === size.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Line Spacing */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Line Spacing</label>
            <div className="flex gap-2">
              {[
                { id: 'compact', label: 'Compact' },
                { id: 'normal', label: 'Normal' },
                { id: 'relaxed', label: 'Relaxed' },
              ].map(spacing => (
                <button
                  key={spacing.id}
                  onClick={() => handleSettingChange('lineSpacing', spacing.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    currentSettings.lineSpacing === spacing.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {spacing.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Margins */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Page Margins</label>
            <div className="flex gap-2">
              {[
                { id: 'narrow', label: 'Narrow' },
                { id: 'normal', label: 'Normal' },
                { id: 'wide', label: 'Wide' },
              ].map(margin => (
                <button
                  key={margin.id}
                  onClick={() => handleSettingChange('margins', margin.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    currentSettings.margins === margin.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {margin.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Header & Style Settings */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlignLeft className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Header Style</h3>
          </div>
          
          <div className="flex gap-2 mb-4">
            {[
              { id: 'centered', label: 'Centered' },
              { id: 'left', label: 'Left Aligned' },
            ].map(style => (
              <button
                key={style.id}
                onClick={() => handleSettingChange('headerStyle', style.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  currentSettings.headerStyle === style.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
          
          {/* Bullet Style */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Bullet Style</label>
            <div className="flex gap-2">
              {[
                { id: 'disc', icon: Circle, label: '•' },
                { id: 'dash', icon: Minus, label: '–' },
                { id: 'arrow', icon: ChevronRight, label: '›' },
                { id: 'square', icon: Square, label: '▪' },
              ].map(bullet => (
                <button
                  key={bullet.id}
                  onClick={() => handleSettingChange('bulletStyle', bullet.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-lg font-medium transition-all ${
                    currentSettings.bulletStyle === bullet.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {bullet.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Show Icons Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-surface rounded-xl">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show contact icons
            </span>
            <button
              onClick={() => handleSettingChange('showIcons', !currentSettings.showIcons)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                currentSettings.showIcons ? 'bg-primary-600' : 'bg-gray-300 dark:bg-slate-600'
              }`}
            >
              <div 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  currentSettings.showIcons ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </section>
        
        {/* Section Visibility */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Show/Hide Sections</h3>
          </div>
          
          <div className="space-y-2">
            {[
              { id: 'summary', label: 'Professional Summary' },
              { id: 'experience', label: 'Work Experience' },
              { id: 'education', label: 'Education' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'certifications', label: 'Certifications' },
            ].map(section => {
              const isHidden = (currentSettings.hiddenSections || []).includes(section.id)
              return (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    isHidden
                      ? 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                      : 'bg-gray-50 dark:bg-dark-surface text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">{section.label}</span>
                  {isHidden ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4 text-primary-600" />
                  )}
                </button>
              )
            })}
          </div>
        </section>
        
        {/* Date Format */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <List className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Date Format</h3>
          </div>
          
          <div className="space-y-2">
            {[
              { id: 'short', label: '2020 - 2023', example: 'Year only' },
              { id: 'medium', label: 'Jan 2020 - Dec 2023', example: 'Month & Year' },
              { id: 'full', label: 'January 2020 - December 2023', example: 'Full month' },
            ].map(format => (
              <button
                key={format.id}
                onClick={() => handleSettingChange('dateFormat', format.id)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  currentSettings.dateFormat === format.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500'
                    : 'bg-gray-50 dark:bg-dark-surface border-2 border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                }`}
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {format.label}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format.example}
                </p>
              </button>
            ))}
          </div>
        </section>
        
        {/* Tips */}
        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            💡 Pro Tips
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Serif fonts convey tradition and reliability</li>
            <li>• Single column layouts are most ATS-friendly</li>
            <li>• Navy and charcoal themes are universally professional</li>
            <li>• Compact spacing helps fit more on one page</li>
            <li>• Hide unused sections for a cleaner look</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default CustomizationPanel
