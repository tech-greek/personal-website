import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { commandRegistry, parseCommand, getCommandSuggestions } from '../utils/commandRegistry.js'
import { content } from '../data/content.js'

/**
 * Terminal Component
 * 
 * Main interactive terminal interface with:
 * - Command input and execution
 * - Command history (arrow keys)
 * - Tab autocomplete
 * - Typing animation for output
 * - Scrollable history
 */
const Terminal = forwardRef(function Terminal(props, ref) {
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome! Type `help` to get started.' },
  ])
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)
  const terminalRef = useRef(null)
  const outputRefs = useRef({})

  // Expose executeCommand to parent via ref
  useImperativeHandle(ref, () => ({
    executeCommand: (command) => {
      executeCommand(command)
      // Clear input after executing from button
      setInput('')
      setHistoryIndex(-1)
      setShowSuggestions(false)
      // Refocus input
      setTimeout(() => inputRef.current?.focus(), 0)
    },
  }))

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Handle command execution
  const executeCommand = (commandInput) => {
    const trimmed = commandInput.trim()
    if (!trimmed) return

    // Add command to history
    setHistory((prev) => [...prev, { type: 'command', content: trimmed }])
    setCommandHistory((prev) => [...prev, trimmed])

    const { command, args } = parseCommand(trimmed)

    // Handle special commands
    if (command === 'clear') {
      setHistory([{ type: 'output', content: 'Terminal cleared.' }])
      return
    }

    if (command === 'resume') {
      // Trigger resume download
      const link = document.createElement('a')
      link.href = content.resume.url
      link.download = content.resume.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setHistory((prev) => [
        ...prev,
        { type: 'output', content: commandRegistry.resume() },
      ])
      return
    }

    // Execute command
    const handler = commandRegistry[command]
    if (!handler) {
      setHistory((prev) => [
        ...prev,
        { type: 'output', content: `Command not found: ${command}. Type 'help' for available commands.` },
      ])
      return
    }

    const output = handler(args)
    setHistory((prev) => [...prev, { type: 'output', content: output }])
  }

  // Handle input submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    executeCommand(input)
    setInput('')
    setHistoryIndex(-1)
    setShowSuggestions(false)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Arrow up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
      return
    }

    // Arrow down - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      }
      return
    }

    // Tab - autocomplete
    if (e.key === 'Tab') {
      e.preventDefault()
      const suggestions = getCommandSuggestions(input)
      if (suggestions.length === 1) {
        setInput(suggestions[0] + ' ')
        setShowSuggestions(false)
      } else if (suggestions.length > 1) {
        setShowSuggestions(true)
        setSuggestions(suggestions)
      }
      return
    }

    // Escape - clear suggestions
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      return
    }

    setShowSuggestions(false)
  }

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    setHistoryIndex(-1)

    // Update suggestions
    if (value.trim()) {
      const suggestions = getCommandSuggestions(value)
      if (suggestions.length > 0) {
        setSuggestions(suggestions)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  // Convert URLs and emails in text to clickable links
  const linkify = (text) => {
    // Match URLs and emails
    const urlRegex = /(https?:\/\/[^\s]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    const parts = text.split(urlRegex)
    
    return parts.map((part, i) => {
      if (!part) return null
      
      if (part.match(/^https?:\/\//)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066cc] hover:underline"
          >
            {part}
          </a>
        )
      }
      
      if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return (
          <a
            key={i}
            href={`mailto:${part}`}
            className="text-[#0066cc] hover:underline"
          >
            {part}
          </a>
        )
      }
      
      return <span key={i}>{part}</span>
    }).filter(Boolean)
  }

  // Render output with typing animation
  const renderOutput = (output, index) => {
    if (typeof output === 'string') {
      // Check if output contains URLs or emails
      const hasLinks = /(https?:\/\/|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(output)
      
      if (hasLinks) {
        // Split by newlines to preserve formatting
        const lines = output.split('\n')
        return (
          <div key={index} className="whitespace-pre-wrap break-words">
            {lines.map((line, lineIdx) => (
              <div key={lineIdx}>
                {linkify(line)}
                {lineIdx < lines.length - 1 && <br />}
              </div>
            ))}
          </div>
        )
      }
      
      return (
        <div
          key={index}
          className="whitespace-pre-wrap break-words"
        >
          {output}
        </div>
      )
    }
    return <div key={index}>{output}</div>
  }

  return (
    <div className="flex flex-col h-full">
      {/* Terminal Viewport */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 space-y-2 min-h-0"
        style={{ scrollBehavior: 'smooth', overscrollBehavior: 'contain' }}
        role="log"
        aria-label="Terminal output"
      >
        {history.map((item, index) => (
          <div key={index} className="flex flex-col">
            {item.type === 'command' && (
              <div className="flex items-center mb-1">
                <span className="text-[#ffffff]">$</span>
                <span className="ml-2 text-[#ffffff]">{item.content}</span>
              </div>
            )}
            {item.type === 'output' && (
              <div className="mb-2 text-[#ffffff]">
                {renderOutput(item.content, index)}
              </div>
            )}
          </div>
        ))}

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center mt-4">
          <span className="text-[#ffffff]">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="ml-2 flex-1 bg-transparent border-none outline-none text-[#ffffff] text-sm md:text-base"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            aria-label="Command input"
            aria-describedby="command-hint"
          />
        </form>

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="mt-2 text-[#ffffff] text-xs md:text-sm" role="listbox" aria-label="Command suggestions">
            Suggestions: {suggestions.join(', ')}
          </div>
        )}
        <div id="command-hint" className="sr-only">
          Type a command and press Enter. Use arrow keys for history, Tab for autocomplete.
        </div>
      </div>
    </div>
  )
})

export default Terminal
