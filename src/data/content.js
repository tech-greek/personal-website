/**
 * Content Configuration
 * 
 * Customize your portfolio content here. All text content and links
 * can be easily updated without touching component logic.
 */

export const content = {
  about: `I'm a Computer Science student passionate about building 
innovative software solutions. I enjoy working across the full stack 
and am always learning new technologies to solve real-world problems.`,

  stack: {
    backend: ['Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB'],
    frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    data: ['Pandas', 'NumPy', 'SQL', 'Data Analysis'],
    infra: ['Docker', 'AWS', 'Git', 'CI/CD'],
  },

  projects: [
    {
      id: 1,
      name: 'Project Alpha',
      problem: 'Solving complex data processing challenges',
      solution: 'Built a scalable system using modern technologies',
      tech: ['React', 'Node.js', 'PostgreSQL'],
      impact: 'Improved processing time by 40%',
    },
    {
      id: 2,
      name: 'Project Beta',
      problem: 'User experience needed improvement',
      solution: 'Redesigned interface with focus on accessibility',
      tech: ['React', 'TypeScript', 'Tailwind CSS'],
      impact: 'Increased user engagement by 25%',
    },
    {
      id: 3,
      name: 'Project Gamma',
      problem: 'System needed better performance',
      solution: 'Optimized algorithms and database queries',
      tech: ['Python', 'PostgreSQL', 'Redis'],
      impact: 'Reduced response time by 60%',
    },
  ],

  experience: [
    {
      role: 'Software Engineering Intern',
      company: 'Tech Company',
      period: 'Summer 2024',
      description: 'Developed features for production applications',
    },
    {
      role: 'Research Assistant',
      company: 'University Lab',
      period: '2023 - Present',
      description: 'Working on machine learning research projects',
    },
  ],

  now: `Currently focused on building full-stack applications and 
exploring new technologies. Working on personal projects and 
contributing to open source.`,

  contact: {
    email: 'your.email@example.com',
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
  },

  resume: {
    url: '/resume.pdf', // Place your resume.pdf in the public folder
    filename: 'resume.pdf',
  },
}

export const commands = [
  'help',
  'about',
  'stack',
  'projects',
  'experience',
  'now',
  'contact',
  'resume',
  'clear',
]
