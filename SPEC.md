# AI Resume Builder - Product Specification

## Overview
An AI-powered resume builder website that conducts intelligent interviews to create compelling, professional resumes. Users upload their existing resume, engage in a conversational interview with AI, and receive a polished, customized resume with real-time preview.

---

## Core User Flow

### 1. Landing & Upload
- **Immediate upload prompt** on landing page
- Supported format: PDF (English only)
- Show **parsing progress** with status indicators:
  - "Extracting contact information..."
  - "Analyzing work experience..."
  - "Identifying skills..."

### 2. AI Interview
- **Conversational back-and-forth** that adapts based on user responses
- AI asks confirmation when it believes it has enough information: "I think I have everything. Ready to generate your resume?"
- User can continue adding information or confirm completion

### 3. Real-Time Preview
- **Side-by-side layout**: Chat interface on left, resume preview on right
- Resume updates live as user provides information
- Full customization controls accessible during interview

### 4. Generation & Export
- Preview final resume with editing option
- Download as PDF
- Browser warning on accidental tab close

---

## AI Behavior Specification

### Tone & Style
- **Professional and formal** communication
- **Probing depth** - asks follow-up questions to extract compelling details
- **Light pushback** on vague answers:
  - Example: User says "I helped improve sales"
  - AI responds: "Great! Can you add any specific numbers or percentages to make this more compelling?"

### Interview Focus Areas
**Priority 1: Work Experience with Achievements**
- Specific accomplishments, not just responsibilities
- Quantifiable metrics and impact
- Context about challenges overcome

**Alternative Flow (No Work Experience):**
- Triggered when resume shows no professional experience
- Focus shifts to:
  1. Skills and certifications (self-taught, formal)
  2. Projects (personal, academic, open source)
  3. Education and relevant coursework
  4. Leadership and volunteer experience

### Special Handling
- **Career gaps**: AI helps reframe positively (skill development, caregiving, entrepreneurship attempts)
- **Weak content**: Gentle coaching to strengthen bullet points
- **Language**: English only - reject non-English uploads gracefully

---

## UI/UX Design

### Visual Design
- **Style**: Bold and modern
- **Primary colors**: Blue and white
- **Accent colors**: User-selectable (gold, coral, teal, etc.)
- **Dark mode**: Supported with toggle
- **Animations**: Subtle micro-interactions for polish

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo | Dark Mode Toggle | Customization Panel      │
├─────────────────────────────┬───────────────────────────────┤
│                             │                               │
│   AI Conversation           │   Resume Preview              │
│   (Hybrid Interface)        │   (Real-time updates)         │
│                             │                               │
│   ┌─────────────────────┐   │   ┌───────────────────────┐   │
│   │ AI Question Card    │   │   │                       │   │
│   │ with context        │   │   │   Live Resume         │   │
│   └─────────────────────┘   │   │   Document            │   │
│                             │   │                       │   │
│   ┌─────────────────────┐   │   │   Updates as user     │   │
│   │ User Response       │   │   │   provides info       │   │
│   │ (chat bubble)       │   │   │                       │   │
│   └─────────────────────┘   │   └───────────────────────────┘   │
│                             │                               │
│   ┌─────────────────────┐   │   Customization Controls:     │
│   │ Type response...    │   │   • Color theme selector     │
│   └─────────────────────┘   │   • Font style picker        │
│                             │   • Layout options           │
└─────────────────────────────┴───────────────────────────────┘
```

### Conversation Interface (Hybrid)
- **AI messages**: Formal Q&A cards with context and guidance
- **User messages**: Chat-style input bubbles
- **Typing indicator**: "AI is analyzing your response..."
- **Message history**: Scrollable, but users cannot edit past messages

---

## Customization System

### Color Schemes (15+ Curated Options)
Professional themes vetted for readability and ATS compatibility:

1. Classic Navy & White
2. Slate Gray & Cream
3. Forest Green & Ivory
4. Burgundy & Pearl
5. Royal Blue & Silver
6. Charcoal & Gold
7. Teal & White
8. Plum & Lavender
9. Bronze & Cream
10. Midnight Blue & White
11. Hunter Green & Tan
12. Maroon & Champagne
13. Steel Blue & Gray
14. Espresso & Cream
15. Sapphire & Ice
16. Graphite & White

### Font Options
- **Serif (Default)**: Georgia, Garamond, Palatino, Times New Roman
- **Sans-serif**: Arial, Calibri, Helvetica, Open Sans
- **Mixed**: Serif headers with sans-serif body

### Layout Options
- **Single Column (Classic)**: Traditional, ATS-friendly
- **Two Column**: Modern, space-efficient
- **Sidebar**: Skills/contact in sidebar, experience in main area

---

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **PDF Generation**: jsPDF + html2canvas (client-side)

### AI Integration
- **Provider**: Anthropic Claude API
- **Architecture**: Serverless function proxy (API key security)
- **Conversation State**: Managed client-side in Zustand store

### Resume Parsing
- **Library**: pdf.js for text extraction
- **Approach**: Hybrid parsing
  - Extract structured data where possible
  - AI fills gaps through interview questions

### Data Handling
- **Persistence**: Ephemeral (session only)
- **Storage**: Browser memory only
- **Privacy**: No server-side storage
- **Warning**: Browser beforeunload event for unsaved changes

---

## Resume Output Specifications

### Page Handling
- **Target**: One page (user preference)
- **Overflow**: Allowed - content can extend to multiple pages
- **Compression**: System suggests edits rather than forcing fit

### PDF Quality
- **Fonts**: Web-safe fonts embedded for compatibility
- **Resolution**: High-quality for printing
- **ATS Compatibility**: Text-based, parseable structure

---

## Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Non-English resume | Graceful rejection with message |
| Corrupted PDF | Error message, prompt re-upload |
| No extractable text | Start interview from scratch |
| Empty sections | AI specifically asks about missing areas |
| Very long content | Allow overflow, suggest prioritization |
| Browser close | Warning dialog before losing data |
| API failure | Retry logic, graceful degradation message |

---

## Success Metrics

1. **Completion rate**: % of users who generate a resume
2. **Interview depth**: Average questions answered
3. **Customization usage**: % who modify default theme
4. **Download rate**: % who download final PDF
5. **Session duration**: Time spent refining resume

---

## Future Considerations (Out of Scope for V1)

- User accounts and saved resumes
- Multiple resume versions
- Cover letter generation
- LinkedIn import
- Job description matching
- Multi-language support
- DOCX export format
- Collaboration features

---

## Design Tokens

```css
/* Primary Palette */
--color-primary: #2563eb;        /* Blue 600 */
--color-primary-dark: #1d4ed8;   /* Blue 700 */
--color-primary-light: #3b82f6;  /* Blue 500 */

/* Neutral Palette */
--color-white: #ffffff;
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-900: #111827;

/* Dark Mode */
--color-dark-bg: #0f172a;
--color-dark-surface: #1e293b;
--color-dark-text: #f1f5f9;

/* Accent Options */
--accent-gold: #f59e0b;
--accent-coral: #f97316;
--accent-teal: #14b8a6;
--accent-purple: #8b5cf6;

/* Typography */
--font-serif: 'Georgia', 'Times New Roman', serif;
--font-sans: 'Inter', 'Arial', sans-serif;

/* Spacing */
--spacing-page-margin: 1in;
--spacing-section-gap: 16px;
--spacing-item-gap: 8px;
```

---

*Specification Version: 1.0*
*Created: January 12, 2026*

