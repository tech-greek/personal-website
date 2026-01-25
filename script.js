/**
 * Dot-based Typography
 * 
 * Architecture:
 * - Each character is represented as a grid of true circular divs
 * - Circles maintain perfect geometry (border-radius: 50%, equal width/height)
 * - Text is constructed from white circular dots on black background
 */

class DotTypography {
    constructor(containerId, text, options = {}) {
        this.container = document.getElementById(containerId);
        this.text = text;
        
        // Configuration
        this.dotSize = options.dotSize || 8;
        this.dotSpacing = options.dotSpacing || 6;
        this.color = options.color || '#ffffff';
        
        // State
        this.circles = [];
        this.characterGroups = []; // Store references to character group elements
        
        // Initialize
        this.init();
    }
    
    init() {
        this.createDotPattern();
        this.revealText();
    }
    
    /**
     * Character pattern definitions
     * Each character is a 7x7 grid where 1 = dot, 0 = empty
     */
    getCharacterPattern(char) {
        const patterns = {
            'H': [
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1],
                [1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1]
            ],
            'i': [
                [0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0]
            ],
            'I': [
                [1,1,1,1,1,1,1],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0],
                [1,1,1,1,1,1,1]
            ],
            'a': [
                [0,0,1,1,1,0,0],
                [0,1,0,0,0,1,0],
                [0,1,0,0,0,1,0],
                [0,1,1,1,1,1,0],
                [0,1,0,0,0,1,0],
                [0,1,0,0,0,1,0],
                [0,1,0,0,0,1,0]
            ],
            'm': [
                [1,0,0,0,0,0,1],
                [1,1,0,0,0,1,1],
                [1,0,1,0,1,0,1],
                [1,0,0,1,0,0,1],
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1]
            ],
            'e': [
                [0,1,1,1,1,1,0],
                [0,1,0,0,0,0,0],
                [0,1,0,0,0,0,0],
                [0,1,1,1,1,0,0],
                [0,1,0,0,0,0,0],
                [0,1,0,0,0,0,0],
                [0,1,1,1,1,1,0]
            ],
            'y': [
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1],
                [0,1,0,0,0,1,0],
                [0,0,1,0,1,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0]
            ],
            'A': [
                [0,0,1,1,1,0,0],
                [0,1,0,0,0,1,0],
                [1,0,0,0,0,0,1],
                [1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1]
            ],
            ' ': [
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0]
            ],
            ',': [
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,1,0,0,0,0]
            ]
        };
        
        return patterns[char] || patterns[char.toUpperCase()] || patterns[' '];
    }
    
    /**
     * Creates the dot pattern for the entire text
     * Each dot is a true circular div element with perfect geometry
     */
    createDotPattern() {
        this.container.innerHTML = '';
        this.circles = [];
        this.characterGroups = [];
        
        const text = this.text;
        
        // Create character groups
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const pattern = this.getCharacterPattern(char);
            
            // Create character group container
            const charGroup = document.createElement('div');
            charGroup.className = 'character-group';
            charGroup.setAttribute('data-char-index', i);
            charGroup.setAttribute('data-char', char);
            
            // Create dots for this character in proper grid order
            // We need to create all positions (including empty ones) to maintain grid structure
            for (let row = 0; row < pattern.length; row++) {
                for (let col = 0; col < pattern[row].length; col++) {
                    // Create a grid cell (even if empty, to maintain structure)
                    const cell = document.createElement('div');
                    cell.style.width = `${this.dotSize}px`;
                    cell.style.height = `${this.dotSize}px`;
                    
                    if (pattern[row][col] === 1) {
                        // Create circle wrapper (for 3D transforms)
                        const wrapper = document.createElement('div');
                        wrapper.className = 'circle-wrapper';
                        
                        // Create the actual circle element
                        // Critical: This maintains perfect circular shape
                        const circle = document.createElement('div');
                        circle.className = 'circle';
                        circle.style.width = `${this.dotSize}px`;
                        circle.style.height = `${this.dotSize}px`;
                        circle.style.backgroundColor = this.color;
                        
                        wrapper.appendChild(circle);
                        cell.appendChild(wrapper);
                    }
                    
                    charGroup.appendChild(cell);
                }
            }
            
            this.container.appendChild(charGroup);
            this.characterGroups.push({
                element: charGroup,
                char: char,
                index: i
            });
        }
    }
    
    /**
     * Reveals text letter by letter with varying speeds
     * Fast for first and last word, slow for middle words
     */
    revealText() {
        const text = this.text;
        const firstWordSpeed = 150; // ms per character for "Hi" (slower, clearly visible)
        const otherWordsSpeed = 125; // ms per character for "I am Amey" (faster)
        const wordPause = 188; // ms pause between words
        
        // Parse text into words (split by spaces)
        // "Hi, I am Amey" becomes ["Hi,", "I", "am", "Amey"]
        const words = text.split(/\s+/).filter(word => word.length > 0);
        
        let currentTime = 0;
        let charGroupIndex = 0;
        
        // Process each word
        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            const word = words[wordIndex];
            
            // First word "Hi" uses slower speed, all other words use faster speed
            const isFirstWord = wordIndex === 0;
            const speed = isFirstWord ? firstWordSpeed : otherWordsSpeed;
            
            // Process each character in the word
            for (let i = 0; i < word.length; i++) {
                // Reveal the character group at current time
                if (charGroupIndex < this.characterGroups.length) {
                    const charGroup = this.characterGroups[charGroupIndex];
                    
                    setTimeout(() => {
                        charGroup.element.classList.add('revealed');
                    }, currentTime);
                    
                    charGroupIndex++;
                }
                
                // Increment time for next character
                currentTime += speed;
            }
            
            // Skip space character after word (except for last word)
            if (wordIndex < words.length - 1) {
                // Reveal space immediately (no delay)
                if (charGroupIndex < this.characterGroups.length) {
                    const charGroup = this.characterGroups[charGroupIndex];
                    setTimeout(() => {
                        charGroup.element.classList.add('revealed');
                    }, currentTime);
                    charGroupIndex++;
                }
                
                // Add pause after word
                currentTime += wordPause;
            }
        }
    }
    
    /**
     * Handles window resize
     */
    handleResize() {
        // Text container will naturally reflow with flexbox
        // No special handling needed for responsive design
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const dotTypography = new DotTypography('textContainer', 'Hi, I am Amey', {
        dotSize: 8,
        dotSpacing: 6,
        color: '#ffffff'
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        dotTypography.handleResize();
    });
});

/**
 * Horizontal Scroll Tracking and Timeline Updates
 */
class ScrollTracker {
    constructor() {
        this.scrollContainer = document.getElementById('scrollContainer');
        this.sections = document.querySelectorAll('.portfolio-section');
        this.markers = document.querySelectorAll('.timeline-marker');
        this.currentSection = 0;
        
        this.init();
    }
    
    init() {
        if (!this.scrollContainer) {
            return;
        }
        
        // Track scroll position
        this.scrollContainer.addEventListener('scroll', () => {
            this.updateActiveSection();
        });
        
        // Keyboard navigation (arrow keys)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.scrollToSection(this.currentSection - 1);
            } else if (e.key === 'ArrowRight') {
                this.scrollToSection(this.currentSection + 1);
            }
        });
        
        // Initial update
        this.updateActiveSection();
    }
    
    /**
     * Updates which section is currently active based on scroll position
     */
    updateActiveSection() {
        const scrollLeft = this.scrollContainer.scrollLeft;
        const containerWidth = this.scrollContainer.clientWidth;
        
        // Calculate which section is in view
        const sectionIndex = Math.round(scrollLeft / containerWidth);
        const clampedIndex = Math.max(0, Math.min(sectionIndex, this.sections.length - 1));
        
        if (clampedIndex !== this.currentSection) {
            this.currentSection = clampedIndex;
            this.updateTimelineMarkers();
        }
    }
    
    /**
     * Updates timeline markers to highlight active section
     * Updates both left and right markers
     */
    updateTimelineMarkers() {
        // Get all markers (both left and right)
        const allMarkers = document.querySelectorAll('.timeline-marker');
        const sections = Array.from(this.sections);
        
        allMarkers.forEach((marker) => {
            const sectionId = marker.getAttribute('data-section');
            const sectionIndex = sections.findIndex(section => 
                section.id === sectionId || section.getAttribute('data-section') === sectionId
            );
            
            if (sectionIndex === this.currentSection) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    }
    
    /**
     * Smoothly scrolls to a specific section
     */
    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        const section = this.sections[index];
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    }
}

// Initialize scroll tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ScrollTracker();
});
