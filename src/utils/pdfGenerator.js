import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(elementId) {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Resume preview element not found')
  }
  
  // Create canvas from element
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  })
  
  // Calculate dimensions
  const imgWidth = 8.5 // inches
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  
  // Create PDF
  const pdf = new jsPDF({
    orientation: imgHeight > 11 ? 'portrait' : 'portrait',
    unit: 'in',
    format: 'letter'
  })
  
  // Add image to PDF
  const imgData = canvas.toDataURL('image/png')
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  
  // If content overflows, add additional pages
  if (imgHeight > 11) {
    let remainingHeight = imgHeight - 11
    let yOffset = -11
    
    while (remainingHeight > 0) {
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight)
      remainingHeight -= 11
      yOffset -= 11
    }
  }
  
  // Download
  pdf.save('resume.pdf')
}

