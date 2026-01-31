# Terminal Portfolio Website

A professional, terminal-themed personal portfolio website built with React, Vite, and Tailwind CSS.

## Features

- **Interactive Terminal Interface**: Type commands or click buttons
- **Command System**: Full command parser with history and autocomplete
- **GUI Fallback**: Clickable buttons for non-technical users
- **Mobile Responsive**: Optimized for all screen sizes
- **Accessible**: Keyboard navigation and ARIA labels
- **Fast Loading**: Optimized for performance (<2s load time)
- **Professional Design**: Clean, developer-focused aesthetic

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Customization

### Updating Content

All content is stored in `src/data/content.js`. Edit this file to customize:

- **About**: Your bio
- **Stack**: Technical skills organized by category
- **Projects**: Project details (id, name, problem, solution, tech, impact)
- **Experience**: Work history
- **Now**: Current focus/activities
- **Contact**: Email, GitHub, LinkedIn links
- **Resume**: Path to your resume PDF

### Adding Commands

1. Add command handler in `src/utils/commandRegistry.js`:
```javascript
export const commandRegistry = {
  // ... existing commands
  mycommand: (args) => {
    return 'Output for my command'
  },
}
```

2. Add to commands list in `src/data/content.js`:
```javascript
export const commands = [
  // ... existing commands
  'mycommand',
]
```

3. Optionally add button in `src/components/CommandButtons.jsx`

### Styling

- Colors are defined in Tailwind classes throughout components
- Main background: `#0d1117`
- Text color: `#c9d1d9`
- Accent color: `#58a6ff`
- Modify these in component files or extend Tailwind config

### Resume

Place your resume PDF in the `public/` folder and update the path in `src/data/content.js`:

```javascript
resume: {
  url: '/resume.pdf',
  filename: 'resume.pdf',
}
```

## Project Structure

```
personal-website/
├── public/           # Static assets (resume, etc.)
├── src/
│   ├── components/   # React components
│   │   ├── Terminal.jsx
│   │   └── CommandButtons.jsx
│   ├── data/        # Content configuration
│   │   └── content.js
│   ├── utils/       # Utilities
│   │   └── commandRegistry.js
│   ├── App.jsx      # Main app component
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Available Commands

- `help` - Show available commands
- `about` - Display bio
- `stack` - Show technical skills
- `projects` - List all projects
- `projects <id>` - Show project details
- `experience` - Display work experience
- `now` - Current focus
- `contact` - Contact information
- `resume` - Download resume
- `clear` - Clear terminal history

## Keyboard Shortcuts

- `↑/↓` - Navigate command history
- `Tab` - Autocomplete commands
- `Escape` - Clear suggestions
- `Enter` - Execute command

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge) with ES6+ support.

## License

MIT
