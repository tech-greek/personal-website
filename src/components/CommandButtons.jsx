/**
 * Command Buttons Component
 * 
 * GUI fallback for users who prefer clicking over typing.
 * Provides accessible button interface for all commands.
 */

export default function CommandButtons({ onCommandClick }) {
  const commands = [
    { label: 'About', cmd: 'about' },
    { label: 'Stack', cmd: 'stack' },
    { label: 'Projects', cmd: 'projects' },
    { label: 'Experience', cmd: 'experience' },
    { label: 'Now', cmd: 'now' },
    { label: 'Contact', cmd: 'contact' },
    { label: 'Resume', cmd: 'resume' },
    { label: 'Help', cmd: 'help' },
  ]

  return (
    <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6">
      <div className="text-[#b0b0b0] text-sm mb-3">
        Quick commands:
      </div>
      <div className="flex flex-wrap gap-2">
        {commands.map(({ label, cmd }) => (
          <button
            key={cmd}
            onClick={() => onCommandClick(cmd)}
            className="px-4 py-2 bg-[#2d2d2d] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-[#ffffff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:ring-offset-2 focus:ring-offset-[#1e1e1e]"
            aria-label={`Execute command: ${cmd}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
