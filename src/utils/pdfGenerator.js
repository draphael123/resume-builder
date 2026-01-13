import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(elementId) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Resume preview element not found')
    alert('Could not find resume to export. Please try again.')
    return
  }
  
  // Clone the element for PDF generation (to avoid affecting the displayed version)
  const clone = element.cloneNode(true)
  clone.id = 'resume-pdf-clone'
  
  // Style the clone for proper PDF rendering
  Object.assign(clone.style, {
    transform: 'none', // Remove any scaling
    width: '8.5in',
    minHeight: '11in',
    position: 'absolute',
    left: '-9999px',
    top: '0',
    backgroundColor: '#ffffff',
    padding: '0.5in',
    boxSizing: 'border-box',
  })
  
  // Add clone to document temporarily
  document.body.appendChild(clone)
  
  try {
    // Wait for fonts and styles to apply
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Create canvas from the clone
    const canvas = await html2canvas(clone, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 816, // 8.5 inches at 96 DPI
      height: 1056, // 11 inches at 96 DPI
      windowWidth: 816,
      windowHeight: 1056,
    })
    
    // Calculate dimensions for PDF (letter size: 8.5 x 11 inches)
    const imgWidth = 8.5
    const pageHeight = 11
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter'
    })
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/png', 1.0)
    
    // Handle multi-page if content is longer than one page
    let heightLeft = imgHeight
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // Download the PDF
    pdf.save('resume.pdf')
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('There was an error generating your PDF. Please try again.')
  } finally {
    // Clean up - remove the clone
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone)
    }
  }
}

// Alternative: Generate PDF from resume data directly (more reliable)
export function generatePDFFromData(resumeData, colorScheme, font) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  })
  
  const pageWidth = 612 // Letter width in points
  const pageHeight = 792 // Letter height in points
  const margin = 50
  const contentWidth = pageWidth - (margin * 2)
  let y = margin
  
  // Helper function to add text with word wrap
  const addText = (text, fontSize, isBold = false, color = '#1f2937') => {
    pdf.setFontSize(fontSize)
    pdf.setTextColor(color)
    if (isBold) {
      pdf.setFont('helvetica', 'bold')
    } else {
      pdf.setFont('helvetica', 'normal')
    }
    
    const lines = pdf.splitTextToSize(text, contentWidth)
    lines.forEach(line => {
      if (y > pageHeight - margin) {
        pdf.addPage()
        y = margin
      }
      pdf.text(line, margin, y)
      y += fontSize * 1.4
    })
  }
  
  // Helper for centered text
  const addCenteredText = (text, fontSize, isBold = false, color = '#1f2937') => {
    pdf.setFontSize(fontSize)
    pdf.setTextColor(color)
    if (isBold) {
      pdf.setFont('helvetica', 'bold')
    } else {
      pdf.setFont('helvetica', 'normal')
    }
    pdf.text(text, pageWidth / 2, y, { align: 'center' })
    y += fontSize * 1.4
  }
  
  // Helper for section headers
  const addSectionHeader = (text) => {
    y += 10
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(colorScheme?.primary || '#1e3a5f')
    pdf.text(text.toUpperCase(), margin, y)
    y += 4
    pdf.setDrawColor(colorScheme?.primary || '#1e3a5f')
    pdf.setLineWidth(1)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 14
  }
  
  const { contact, summary, experience, education, skills, certifications, projects } = resumeData
  
  // Name
  if (contact.name) {
    addCenteredText(contact.name, 22, true, colorScheme?.primary || '#1e3a5f')
    y += 4
  }
  
  // Contact info line
  const contactParts = []
  if (contact.email) contactParts.push(contact.email)
  if (contact.phone) contactParts.push(contact.phone)
  if (contact.location) contactParts.push(contact.location)
  if (contact.linkedin) contactParts.push(contact.linkedin.replace('https://', ''))
  
  if (contactParts.length > 0) {
    addCenteredText(contactParts.join('  •  '), 9, false, '#4b5563')
    y += 8
  }
  
  // Summary
  if (summary) {
    addSectionHeader('Professional Summary')
    addText(summary, 10)
  }
  
  // Experience
  if (experience && experience.length > 0) {
    addSectionHeader('Professional Experience')
    experience.forEach(exp => {
      // Title and dates on same line
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor('#1f2937')
      pdf.text(exp.title || 'Position', margin, y)
      
      const dateText = `${exp.startDate || ''} - ${exp.endDate || 'Present'}`
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor('#6b7280')
      pdf.text(dateText, pageWidth - margin, y, { align: 'right' })
      y += 14
      
      // Company
      pdf.setFontSize(10)
      pdf.setTextColor(colorScheme?.primary || '#1e3a5f')
      pdf.text(exp.company || 'Company', margin, y)
      y += 14
      
      // Achievements
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach(achievement => {
          if (achievement) {
            pdf.setFontSize(9)
            pdf.setTextColor('#374151')
            pdf.setFont('helvetica', 'normal')
            const bulletText = `• ${achievement}`
            const lines = pdf.splitTextToSize(bulletText, contentWidth - 10)
            lines.forEach(line => {
              if (y > pageHeight - margin) {
                pdf.addPage()
                y = margin
              }
              pdf.text(line, margin + 10, y)
              y += 12
            })
          }
        })
      }
      y += 6
    })
  }
  
  // Projects
  if (projects && projects.length > 0) {
    addSectionHeader('Projects')
    projects.forEach(project => {
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor('#1f2937')
      pdf.text(project.name || 'Project', margin, y)
      y += 14
      
      if (project.description) {
        addText(project.description, 9)
      }
      
      if (project.technologies) {
        pdf.setFontSize(8)
        pdf.setTextColor('#6b7280')
        pdf.text(`Technologies: ${project.technologies}`, margin, y)
        y += 12
      }
      y += 4
    })
  }
  
  // Education
  if (education && education.length > 0) {
    addSectionHeader('Education')
    education.forEach(edu => {
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor('#1f2937')
      pdf.text(edu.degree || 'Degree', margin, y)
      
      if (edu.graduationDate) {
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor('#6b7280')
        pdf.text(edu.graduationDate, pageWidth - margin, y, { align: 'right' })
      }
      y += 14
      
      pdf.setFontSize(10)
      pdf.setTextColor(colorScheme?.primary || '#1e3a5f')
      pdf.text(edu.school || 'School', margin, y)
      y += 14
      
      if (edu.details) {
        addText(edu.details, 9, false, '#6b7280')
      }
      y += 4
    })
  }
  
  // Skills
  if (skills && skills.length > 0) {
    addSectionHeader('Skills')
    const skillsText = skills.join('  •  ')
    addText(skillsText, 9)
  }
  
  // Certifications
  if (certifications && certifications.length > 0) {
    addSectionHeader('Certifications')
    certifications.forEach(cert => {
      let certText = cert.name || ''
      if (cert.issuer) certText += ` - ${cert.issuer}`
      if (cert.date) certText += ` (${cert.date})`
      addText(`• ${certText}`, 9)
    })
  }
  
  // Save
  pdf.save('resume.pdf')
}
