import { useStore } from '../store/useStore'
import { X, Palette, Type, Layout, Check } from 'lucide-react'

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
    setLayout
  } = useStore()
  
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
        
        {/* Tips */}
        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            💡 Pro Tips
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Serif fonts convey tradition and reliability</li>
            <li>• Single column layouts are most ATS-friendly</li>
            <li>• Navy and charcoal themes are universally professional</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default CustomizationPanel

