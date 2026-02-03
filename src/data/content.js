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
      name: 'News2Sentiment',
      description: 'AI-driven financial news and sentiment platform. Aggregates real-time financial news and applies transformer-based sentiment analysis to surface actionable market insights through an interactive dashboard.',
      problem: 'Solving complex data processing challenges',
      solution: 'Built a scalable system using modern technologies',
      tech: ['Python', 'Streamlit', 'FinBERT', 'Gemini API', 'yfinance'],
      impact: 'Improved processing time by 40%',
      link: 'https://github.com/ameymalhotra/News2Sentiment',
      liveUrl: null,
    },
    {
      id: 2,
      name: 'Transformer-Based Malignant Cell Detection',
      description: 'Developed an end-to-end machine learning system that preprocesses large-scale pathology slide images and trains transformer-based vision models to classify malignant cells, improving data efficiency and model performance in computational oncology research.',
      problem: 'Accurate malignant cell classification in pathology imaging',
      solution: 'Transformer-based vision models for medical image analysis',
      tech: ['Python', 'PyTorch', 'Vision Transformers', 'Computer Vision', 'Medical Imaging (SVS)'],
      impact: 'Improved data efficiency and model performance in oncology research',
      link: null,
      liveUrl: null,
    },
    {
      id: 3,
      name: 'Project Management System',
      description: 'Scalable full-stack task and team platform. Designed and deployed a secure, cloud-hosted project management application with authentication, real-time task tracking, and RESTful APIs.',
      problem: 'Coordinating tasks and teams at scale',
      solution: 'Cloud-hosted app with auth, real-time tracking, and REST APIs',
      tech: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'AWS (EC2, VPC)'],
      impact: 'Secure, scalable task and team management',
      link: null,
      liveUrl: null,
    },
    {
      id: 4,
      name: 'Climate Resilience Decision Dashboard',
      description: 'Built a geospatial decision-support dashboard for the SCALE-R Lab at the University of Miami, transforming climate and socio-economic data into interactive climate risk visualizations and predictive resilience models for public planning and research.',
      problem: 'Climate risk and resilience planning for public stakeholders',
      solution: 'Geospatial dashboard with interactive visualizations and predictive models',
      tech: ['React', 'JavaScript', 'Mapbox', 'Python', 'GIS', 'Data Pipelines', 'Machine Learning'],
      impact: 'Actionable climate risk insights for public planning and research',
      link: 'https://github.com/ameymalhotra/scale-r',
      liveUrl: 'https://scaler-app.vercel.app',
    },
  ],

  experience: [
    {
      role: 'Undergraduate Research Assistant',
      company: 'Data Science and Computational Biology Lab',
      period: 'Sep 2025 - Present',
      description: 'Engineering ML pipelines for cancer pathology image classification using transformer architectures',
    },
    {
      role: 'Undergraduate Research Assistant',
      company: 'SCALE-R Lab, Department of Geography',
      period: 'Sep 2025 - Present',
      description: 'Building interactive web dashboards for coastal resilience visualization using React and MapBox',
    },
    {
      role: 'Project Lead',
      company: 'Unlock AI',
      period: 'May 2025 - Present',
      description: 'Leading development of a privacy-focused academic advising system using small language models',
    },
    {
      role: 'Teaching Assistant',
      company: 'Department of Computer Science',
      period: 'Aug - Dec 2025',
      description: 'Delivered Python programming support to 65+ students, improving comprehension scores by 20%',
    },
  ],

  now: `Currently focused on building full-stack applications and 
exploring new technologies. Working on personal projects and 
contributing to open source.`,

  contact: {
    email: 'axm8832@miami.edu',
    github: 'https://github.com/tech-greek',
    linkedin: 'https://www.linkedin.com/in/amey-malhotra/',
    formEndpoint: null, // e.g. 'https://formspree.io/f/YOUR_FORM_ID' or null to hide form
    tagline: "Let's get in touch and build together.",
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
