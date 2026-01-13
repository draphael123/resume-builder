import { useStore } from '../store/useStore'
import { Mail, Phone, MapPin, Linkedin, Globe, FileText } from 'lucide-react'

// Helper to check if text is displayable (not garbled)
function isCleanText(text) {
  if (!text || typeof text !== 'string') return false
  const alphaNum = (text.match(/[a-zA-Z0-9\s.,!?@\-()]/g) || []).length
  return alphaNum / text.length > 0.7
}

// Clean any potentially garbled text
function cleanDisplayText(text) {
  if (!text) return ''
  if (!isCleanText(text)) return ''
  return text.replace(/[^\x20-\x7E\u00A0-\u00FF]/g, '').trim()
}

// Get bullet character based on style
function getBullet(style) {
  const bullets = {
    disc: '•',
    dash: '–',
    arrow: '›',
    square: '▪',
  }
  return bullets[style] || '•'
}

// Get font size multiplier
function getFontSizeMultiplier(size) {
  const sizes = { small: 0.9, medium: 1, large: 1.1 }
  return sizes[size] || 1
}

// Get line height based on spacing
function getLineHeight(spacing) {
  const heights = { compact: 1.3, normal: 1.5, relaxed: 1.7 }
  return heights[spacing] || 1.5
}

// Get margin size
function getMargin(margin) {
  const margins = { narrow: '0.5in', normal: '0.75in', wide: '1in' }
  return margins[margin] || '0.75in'
}

function ResumePreview() {
  const { resumeData, colorScheme, font, settings } = useStore()
  const { contact, summary, experience, education, skills, certifications, projects } = resumeData
  
  // Default settings
  const currentSettings = settings || {
    fontSize: 'medium',
    lineSpacing: 'normal',
    margins: 'normal',
    headerStyle: 'centered',
    bulletStyle: 'disc',
    showIcons: true,
    dateFormat: 'short',
    hiddenSections: [],
  }
  
  const fontMultiplier = getFontSizeMultiplier(currentSettings.fontSize)
  const lineHeight = getLineHeight(currentSettings.lineSpacing)
  const margin = getMargin(currentSettings.margins)
  const bullet = getBullet(currentSettings.bulletStyle)
  const isHidden = (section) => (currentSettings.hiddenSections || []).includes(section)
  
  // Clean all text fields
  const cleanContact = {
    name: cleanDisplayText(contact.name),
    email: cleanDisplayText(contact.email),
    phone: cleanDisplayText(contact.phone),
    location: cleanDisplayText(contact.location),
    linkedin: cleanDisplayText(contact.linkedin),
    website: cleanDisplayText(contact.website),
  }
  
  const cleanSummary = cleanDisplayText(summary)
  
  const hasContent = cleanContact.name || cleanSummary || experience.length > 0 || 
                     education.length > 0 || skills.length > 0 || projects.length > 0
  
  // Base font sizes
  const baseSizes = {
    name: 28,
    sectionHeader: 14,
    jobTitle: 13,
    company: 11,
    body: 11,
    small: 10,
    tiny: 9,
  }
  
  // Apply multiplier
  const sizes = Object.fromEntries(
    Object.entries(baseSizes).map(([k, v]) => [k, v * fontMultiplier])
  )
  
  return (
    <div className="w-full h-full overflow-auto p-6 flex justify-center">
      <div 
        id="resume-preview"
        className="resume-preview w-[8.5in] min-h-[11in] shadow-2xl"
        style={{
          fontFamily: font.family,
          backgroundColor: colorScheme.secondary,
          color: '#1f2937',
          padding: margin,
          transform: 'scale(0.7)',
          transformOrigin: 'top center',
          lineHeight: lineHeight,
        }}
      >
        {!hasContent ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FileText size={48} strokeWidth={1} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Your resume preview</p>
            <p className="text-sm mt-2 text-center max-w-xs">
              Answer the interview questions and watch your resume build in real-time
            </p>
          </div>
        ) : (
          <>
            {/* Header / Contact */}
            <header 
              className={`mb-6 ${currentSettings.headerStyle === 'centered' ? 'text-center' : 'text-left'}`}
              style={{ borderBottom: `2px solid ${colorScheme.primary}`, paddingBottom: '12px' }}
            >
              {cleanContact.name && (
                <h1 style={{ color: colorScheme.primary, fontSize: `${sizes.name}px`, fontWeight: 700, marginBottom: '8px' }}>
                  {cleanContact.name}
                </h1>
              )}
              <div 
                className={`flex flex-wrap gap-4 text-sm ${currentSettings.headerStyle === 'centered' ? 'justify-center' : 'justify-start'}`}
                style={{ color: '#4b5563', fontSize: `${sizes.small}px` }}
              >
                {cleanContact.email && (
                  <span className="flex items-center gap-1">
                    {currentSettings.showIcons && <Mail size={12} />}
                    {cleanContact.email}
                  </span>
                )}
                {cleanContact.phone && (
                  <span className="flex items-center gap-1">
                    {currentSettings.showIcons && <Phone size={12} />}
                    {cleanContact.phone}
                  </span>
                )}
                {cleanContact.location && (
                  <span className="flex items-center gap-1">
                    {currentSettings.showIcons && <MapPin size={12} />}
                    {cleanContact.location}
                  </span>
                )}
                {cleanContact.linkedin && (
                  <span className="flex items-center gap-1">
                    {currentSettings.showIcons && <Linkedin size={12} />}
                    {cleanContact.linkedin.replace('https://', '')}
                  </span>
                )}
                {cleanContact.website && (
                  <span className="flex items-center gap-1">
                    {currentSettings.showIcons && <Globe size={12} />}
                    {cleanContact.website.replace('https://', '')}
                  </span>
                )}
              </div>
            </header>
            
            {/* Summary */}
            {cleanSummary && !isHidden('summary') && (
              <section className="mb-5">
                <h2 style={{ 
                  color: colorScheme.primary, 
                  fontSize: `${sizes.sectionHeader}px`,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `2px solid ${colorScheme.primary}`,
                  paddingBottom: '4px',
                  marginBottom: '8px'
                }}>
                  Professional Summary
                </h2>
                <p style={{ fontSize: `${sizes.body}px` }}>{cleanSummary}</p>
              </section>
            )}
            
            {/* Experience */}
            {experience.length > 0 && !isHidden('experience') && (
              <section className="mb-5">
                <h2 style={{ 
                  color: colorScheme.primary, 
                  fontSize: `${sizes.sectionHeader}px`,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `2px solid ${colorScheme.primary}`,
                  paddingBottom: '4px',
                  marginBottom: '8px'
                }}>
                  Professional Experience
                </h2>
                {experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 style={{ fontSize: `${sizes.jobTitle}px`, fontWeight: 600 }}>
                          {cleanDisplayText(exp.title) || 'Position'}
                        </h3>
                        <p style={{ fontSize: `${sizes.company}px`, color: colorScheme.primary, fontWeight: 500 }}>
                          {cleanDisplayText(exp.company) || 'Company'}
                        </p>
                      </div>
                      <p style={{ fontSize: `${sizes.small}px`, color: '#6b7280' }}>
                        {cleanDisplayText(exp.startDate)} - {cleanDisplayText(exp.endDate) || 'Present'}
                      </p>
                    </div>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul style={{ marginTop: '6px', paddingLeft: '16px', listStyle: 'none' }}>
                        {exp.achievements.map((achievement, i) => {
                          const cleanAchievement = cleanDisplayText(achievement)
                          return cleanAchievement ? (
                            <li key={i} style={{ fontSize: `${sizes.body}px`, marginBottom: '3px' }}>
                              <span style={{ marginRight: '8px' }}>{bullet}</span>
                              {cleanAchievement}
                            </li>
                          ) : null
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}
            
            {/* Projects */}
            {projects.length > 0 && !isHidden('projects') && (
              <section className="mb-5">
                <h2 style={{ 
                  color: colorScheme.primary, 
                  fontSize: `${sizes.sectionHeader}px`,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `2px solid ${colorScheme.primary}`,
                  paddingBottom: '4px',
                  marginBottom: '8px'
                }}>
                  Projects
                </h2>
                {projects.map((project, index) => (
                  <div key={index} className="mb-3">
                    <h3 style={{ fontSize: `${sizes.jobTitle}px`, fontWeight: 600 }}>
                      {cleanDisplayText(project.name)}
                    </h3>
                    <p style={{ fontSize: `${sizes.body}px` }}>
                      {cleanDisplayText(project.description)}
                    </p>
                    {project.technologies && (
                      <p style={{ fontSize: `${sizes.tiny}px`, color: '#6b7280', marginTop: '2px' }}>
                        Technologies: {cleanDisplayText(project.technologies)}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}
            
            {/* Education */}
            {education.length > 0 && !isHidden('education') && (
              <section className="mb-5">
                <h2 style={{ 
                  color: colorScheme.primary, 
                  fontSize: `${sizes.sectionHeader}px`,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `2px solid ${colorScheme.primary}`,
                  paddingBottom: '4px',
                  marginBottom: '8px'
                }}>
                  Education
                </h2>
                {education.map((edu, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 style={{ fontSize: `${sizes.jobTitle}px`, fontWeight: 600 }}>
                          {cleanDisplayText(edu.degree)}
                        </h3>
                        <p style={{ fontSize: `${sizes.company}px`, color: colorScheme.primary }}>
                          {cleanDisplayText(edu.school)}
                        </p>
                      </div>
                      <p style={{ fontSize: `${sizes.small}px`, color: '#6b7280' }}>
                        {cleanDisplayText(edu.graduationDate)}
                      </p>
                    </div>
                    {edu.details && (
                      <p style={{ fontSize: `${sizes.tiny}px`, color: '#6b7280', marginTop: '2px' }}>
                        {cleanDisplayText(edu.details)}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}
            
            {/* Skills */}
            {skills.length > 0 && !isHidden('skills') && (
              <section className="mb-5">
                <h2 style={{ 
                  color: colorScheme.primary, 
                  fontSize: `${sizes.sectionHeader}px`,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `2px solid ${colorScheme.primary}`,
                  paddingBottom: '4px',
                  marginBottom: '8px'
                }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => {
                    const cleanSkill = cleanDisplayText(skill)
                    return cleanSkill ? (
                      <span 
                        key={index}
                        style={{ 
                          fontSize: `${sizes.small}px`,
                          padding: '3px 10px',
                          backgroundColor: `${colorScheme.primary}15`,
                          color: colorScheme.primary,
                          borderRadius: '4px',
                          fontWeight: 500
                        }}
                      >
                        {cleanSkill}
                      </span>
                    ) : null
                  })}
                </div>
              </section>
            )}
            
            {/* Certifications */}
            {certifications.length > 0 && !isHidden('certifications') && (
              <section className="mb-5">
                <h2 style={{ 
                  color: colorScheme.primary, 
                  fontSize: `${sizes.sectionHeader}px`,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `2px solid ${colorScheme.primary}`,
                  paddingBottom: '4px',
                  marginBottom: '8px'
                }}>
                  Certifications
                </h2>
                <ul style={{ paddingLeft: '16px', listStyle: 'none' }}>
                  {certifications.map((cert, index) => {
                    const cleanName = cleanDisplayText(cert.name)
                    return cleanName ? (
                      <li key={index} style={{ fontSize: `${sizes.body}px`, marginBottom: '3px' }}>
                        <span style={{ marginRight: '8px' }}>{bullet}</span>
                        <strong>{cleanName}</strong>
                        {cert.issuer && ` - ${cleanDisplayText(cert.issuer)}`}
                        {cert.date && ` (${cleanDisplayText(cert.date)})`}
                      </li>
                    ) : null
                  })}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ResumePreview
