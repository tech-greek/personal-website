/**
 * Command Registry
 * 
 * Maps command strings to their execution handlers.
 * Each handler receives the command and arguments, and returns
 * output content (string or JSX).
 */

import { content } from '../data/content.js'

export const commandRegistry = {
  help: () => {
    return `Available commands:
  help          - Show this help message
  about         - Display a brief bio
  stack         - Show technical skills
  projects      - List all projects
  projects <id> - Show details for a specific project
  experience    - Display work experience
  now           - What I'm currently working on
  contact       - Get in touch
  resume        - Download resume
  clear         - Clear terminal history

Tip: Use Tab for autocomplete, ↑/↓ for command history`
  },

  about: () => {
    return content.about
  },

  stack: () => {
    const { backend, frontend, data, infra } = content.stack
    return `Backend:    ${backend.join(', ')}
Frontend:   ${frontend.join(', ')}
Data:       ${data.join(', ')}
Infrastructure: ${infra.join(', ')}`
  },

  projects: (args) => {
    if (args.length === 0) {
      // List all projects
      const list = content.projects
        .map((p, i) => `${i + 1}. ${p.name}`)
        .join('\n')
      return `Projects:\n${list}\n\nType 'projects <id>' for details (e.g., 'projects 1')`
    }

    // Show specific project
    const id = parseInt(args[0])
    const project = content.projects.find((p) => p.id === id)

    if (!project) {
      return `Project with id ${id} not found. Available projects: ${content.projects.map((p) => p.id).join(', ')}`
    }

    return `Project: ${project.name}

Problem:   ${project.problem}
Solution:  ${project.solution}
Tech:      ${project.tech.join(', ')}
Impact:    ${project.impact}`
  },

  experience: () => {
    return content.experience
      .map((exp) => `${exp.role} @ ${exp.company} (${exp.period})\n  ${exp.description}`)
      .join('\n\n')
  },

  now: () => {
    return content.now
  },

  contact: () => {
    const { email, github, linkedin } = content.contact
    return `Email:   ${email}
GitHub:   ${github}
LinkedIn: ${linkedin}`
  },

  resume: () => {
    // This will trigger a download in the component
    return `Downloading resume...`
  },

  clear: () => {
    // This is handled in the component, but we return a message
    return ''
  },
}

/**
 * Parse command input and extract command + arguments
 */
export function parseCommand(input) {
  const trimmed = input.trim()
  if (!trimmed) return { command: null, args: [] }

  const parts = trimmed.split(/\s+/)
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)

  return { command, args }
}

/**
 * Get command suggestions for autocomplete
 */
export function getCommandSuggestions(partial) {
  const allCommands = Object.keys(commandRegistry)
  if (!partial) return allCommands

  return allCommands.filter((cmd) => cmd.startsWith(partial.toLowerCase()))
}
