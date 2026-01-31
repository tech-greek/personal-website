# Quick Start Guide

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Customize your content:**
   - Open `src/data/content.js`
   - Update all placeholder information:
     - Your bio in `about`
     - Your skills in `stack`
     - Your projects in `projects`
     - Your experience in `experience`
     - Your contact info in `contact`
     - Your resume path in `resume`

3. **Add your resume:**
   - Place your resume PDF in the `public/` folder
   - Update the filename in `src/data/content.js` if different from `resume.pdf`

4. **Start development:**
   ```bash
   npm run dev
   ```

5. **Test all commands:**
   - Type `help` to see all commands
   - Try clicking the command buttons
   - Test keyboard shortcuts (↑/↓, Tab)

## Customization Tips

### Changing Colors
Edit Tailwind classes in components:
- Background: `bg-[#0d1117]` in `App.jsx` and `index.css`
- Text: `text-[#c9d1d9]` throughout components
- Accent: `text-[#58a6ff]` for prompts and links

### Adding a New Command

1. Add handler in `src/utils/commandRegistry.js`:
```javascript
mycommand: (args) => {
  return 'My command output'
}
```

2. Add to `src/data/content.js` commands array (optional, for autocomplete)

3. Add button in `src/components/CommandButtons.jsx` (optional)

### Styling Adjustments

- Font size: Modify `text-sm md:text-base` classes
- Spacing: Adjust padding in `Terminal.jsx` (`p-4 md:p-6 lg:p-8`)
- Cursor: Edit animation in `src/index.css` `.cursor-blink`

## Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Preview build:**
   ```bash
   npm run preview
   ```

3. **Deploy:**
   - Deploy the `dist/` folder to any static hosting:
     - Vercel: `vercel --prod`
     - Netlify: Drag `dist/` folder
     - GitHub Pages: Push `dist/` to gh-pages branch
     - Any static host

## Troubleshooting

**Resume download not working?**
- Check that `public/resume.pdf` exists
- Verify the path in `src/data/content.js` matches

**Commands not working?**
- Check browser console for errors
- Verify command is in `commandRegistry` in `src/utils/commandRegistry.js`

**Styling issues?**
- Clear browser cache
- Run `npm run build` to regenerate CSS
