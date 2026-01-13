import { useStore } from '../store/useStore'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

function ResumePreview() {
  const { resumeData, colorScheme, font, layout } = useStore()
  const { contact, summary, experience, education, skills, certifications, projects } = resumeData
  
  const hasContent = contact.name || summary || experience.length > 0 || education.length > 0 || skills.length > 0
  
  return (
    <div className="w-full h-full overflow-auto p-6 flex justify-center">
      <div 
        id="resume-preview"
        className="resume-preview w-[8.5in] min-h-[11in] shadow-2xl"
        style={{
          fontFamily: font.family,
          backgroundColor: colorScheme.secondary,
          color: '#1f2937',
          padding: '0.75in',
          transform: 'scale(0.75)',
          transformOrigin: 'top center',
        }}
      >
        {!hasContent ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg">Your resume will appear here</p>
              <p className="text-sm mt-2">Answer questions to build your content</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header / Contact */}
            <header className="text-center mb-6" style={{ borderBottom: `2px solid ${colorScheme.primary}`, paddingBottom: '12px' }}>
              {contact.name && (
                <h1 style={{ color: colorScheme.primary, fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
                  {contact.name}
                </h1>
              )}
              <div className="flex flex-wrap justify-center gap-4 text-sm" style={{ color: '#4b5563' }}>
                {contact.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={12} />
                    {contact.email}
                  </span>
                )}
                {contact.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} />
                    {contact.phone}
                  </span>
                )}
                {contact.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {contact.location}
                  </span>
                )}
                {contact.linkedin && (
                  <span className="flex items-center gap-1">
                    <Linkedin size={12} />
                    {contact.linkedin.replace('https://', '')}
                  </span>
                )}
                {contact.website && (
                  <span className="flex items-center gap-1">
                    <Globe size={12} />
                    {contact.website.replace('https://', '')}
                  </span>
                )}
              </div>
            </header>
            
            {/* Summary */}
            {summary && (
              <section className="mb-5">
                <h2 style={{ color: colorScheme.primary }}>Professional Summary</h2>
                <p style={{ fontSize: '11px', lineHeight: 1.6 }}>{summary}</p>
              </section>
            )}
            
            {/* Experience */}
            {experience.length > 0 && (
              <section className="mb-5">
                <h2 style={{ color: colorScheme.primary }}>Professional Experience</h2>
                {experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 style={{ fontSize: '13px', fontWeight: 600 }}>{exp.title}</h3>
                        <p style={{ fontSize: '11px', color: colorScheme.primary, fontWeight: 500 }}>
                          {exp.company}
                        </p>
                      </div>
                      <p style={{ fontSize: '10px', color: '#6b7280' }}>
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </p>
                    </div>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul style={{ marginTop: '6px' }}>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} style={{ fontSize: '11px', marginBottom: '3px' }}>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}
            
            {/* Projects */}
            {projects.length > 0 && (
              <section className="mb-5">
                <h2 style={{ color: colorScheme.primary }}>Projects</h2>
                {projects.map((project, index) => (
                  <div key={index} className="mb-3">
                    <h3 style={{ fontSize: '13px', fontWeight: 600 }}>{project.name}</h3>
                    <p style={{ fontSize: '11px', lineHeight: 1.5 }}>{project.description}</p>
                    {project.technologies && (
                      <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                        Technologies: {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}
            
            {/* Education */}
            {education.length > 0 && (
              <section className="mb-5">
                <h2 style={{ color: colorScheme.primary }}>Education</h2>
                {education.map((edu, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 style={{ fontSize: '13px', fontWeight: 600 }}>{edu.degree}</h3>
                        <p style={{ fontSize: '11px', color: colorScheme.primary }}>{edu.school}</p>
                      </div>
                      <p style={{ fontSize: '10px', color: '#6b7280' }}>{edu.graduationDate}</p>
                    </div>
                    {edu.details && (
                      <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{edu.details}</p>
                    )}
                  </div>
                ))}
              </section>
            )}
            
            {/* Skills */}
            {skills.length > 0 && (
              <section className="mb-5">
                <h2 style={{ color: colorScheme.primary }}>Skills</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <span 
                      key={index}
                      style={{ 
                        fontSize: '10px',
                        padding: '3px 10px',
                        backgroundColor: `${colorScheme.primary}15`,
                        color: colorScheme.primary,
                        borderRadius: '4px',
                        fontWeight: 500
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
            
            {/* Certifications */}
            {certifications.length > 0 && (
              <section className="mb-5">
                <h2 style={{ color: colorScheme.primary }}>Certifications</h2>
                <ul>
                  {certifications.map((cert, index) => (
                    <li key={index} style={{ fontSize: '11px', marginBottom: '3px' }}>
                      <strong>{cert.name}</strong>
                      {cert.issuer && ` - ${cert.issuer}`}
                      {cert.date && ` (${cert.date})`}
                    </li>
                  ))}
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

