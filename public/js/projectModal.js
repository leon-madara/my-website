// Project Modal - Interactive Documentation System
// Handles modal opening, tab switching, data population, and animations

document.addEventListener('DOMContentLoaded', () => {
    // Get modal elements
    const modal = document.getElementById('project-modal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const tabButtons = modal.querySelectorAll('.tab-btn');
    const tabContents = modal.querySelectorAll('.tab-content');

    // Current active project
    let currentProject = null;

    // Initialize modal event listeners
    initModalListeners();

    // Make hexagons clickable
    initHexagonClicks();

    function initModalListeners() {
        // Close button
        modalClose.addEventListener('click', closeModal);

        // Overlay click to close
        modalOverlay.addEventListener('click', closeModal);

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                switchTab(tabName);
            });
        });

        // Keyboard navigation for tabs (Arrow keys)
        tabButtons.forEach((button, index) => {
            button.addEventListener('keydown', (e) => {
                let newIndex = index;

                if (e.key === 'ArrowRight') {
                    newIndex = (index + 1) % tabButtons.length;
                } else if (e.key === 'ArrowLeft') {
                    newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
                }

                if (newIndex !== index) {
                    tabButtons[newIndex].click();
                    tabButtons[newIndex].focus();
                }
            });
        });
    }

    function initHexagonClicks() {
        // Get all main hexagons
        const hexagons = document.querySelectorAll('.main-hexagon');

        hexagons.forEach(hexagon => {
            const projectId = hexagon.getAttribute('data-project');

            // Skip placeholder projects
            if (projectId && projectId.startsWith('placeholder')) {
                return;
            }

            hexagon.style.cursor = 'pointer';

            hexagon.addEventListener('click', () => {
                if (projectId && projectsData[projectId]) {
                    openModal(projectId);
                }
            });

            // Add keyboard accessibility
            hexagon.setAttribute('tabindex', '0');
            hexagon.setAttribute('role', 'button');
            hexagon.setAttribute('aria-label', `View ${projectId} project details`);

            hexagon.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (projectId && projectsData[projectId]) {
                        openModal(projectId);
                    }
                }
            });
        });
    }

    function openModal(projectId) {
        currentProject = projectsData[projectId];

        if (!currentProject) {
            console.error('Project not found:', projectId);
            return;
        }

        // Populate modal with project data
        populateModalData(currentProject);

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate modal in with GSAP
        gsap.from(modal.querySelector('.modal-container'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(1.5)'
        });

        // Reset to overview tab
        switchTab('overview');

        // Announce to screen readers
        announceToScreenReader(`Opened ${currentProject.name} project details`);
    }

    function closeModal() {
        // Animate modal out
        gsap.to(modal.querySelector('.modal-container'), {
            scale: 0.9,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                currentProject = null;
            }
        });
    }

    function switchTab(tabName) {
        // Update tab buttons
        tabButtons.forEach(button => {
            if (button.dataset.tab === tabName) {
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-selected', 'false');
            }
        });

        // Update tab content
        tabContents.forEach(content => {
            if (content.id === `tab-${tabName}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Scroll to top of content
        modal.querySelector('.modal-content').scrollTop = 0;
    }

    function populateModalData(project) {
        // Check if we're using the new case study layout
        const hasCaseStudyData = project.hero && project.challenge && project.solution;
        
        if (hasCaseStudyData) {
            populateCaseStudyModal(project);
        } else {
            populateTabbedModal(project);
        }
    }

    function populateCaseStudyModal(project) {
        // Hero Section
        const heroBadge = document.getElementById('hero-badge');
        if (heroBadge) heroBadge.textContent = project.tagline || 'Case Study';
        
        document.getElementById('modal-title').textContent = project.name;
        
        const heroRole = document.getElementById('hero-role');
        if (heroRole && project.hero) heroRole.textContent = project.hero.role;
        
        const heroClient = document.getElementById('hero-client');
        if (heroClient && project.hero) heroClient.textContent = project.hero.client;
        
        const heroDuration = document.getElementById('hero-duration');
        if (heroDuration && project.hero) heroDuration.textContent = `⏱️ ${project.hero.duration}`;
        
        const heroStatus = document.getElementById('hero-status');
        if (heroStatus && project.hero) heroStatus.textContent = `✅ ${project.hero.status}`;

        // Challenge Section
        const challengeList = document.getElementById('challenge-list');
        if (challengeList && project.challenge && project.challenge.problems) {
            challengeList.innerHTML = project.challenge.problems.map(problem => 
                `<li>${problem}</li>`
            ).join('');
        }

        // Solution Section
        const solutionDesc = document.getElementById('solution-description');
        if (solutionDesc && project.solution) {
            solutionDesc.textContent = project.solution.description;
        }
        
        const benefitsList = document.getElementById('benefits-list');
        if (benefitsList && project.solution && project.solution.benefits) {
            benefitsList.innerHTML = project.solution.benefits.map(benefit => 
                `<li>${benefit}</li>`
            ).join('');
        }

        // Features Table
        const featuresTable = document.getElementById('features-table');
        if (featuresTable && project.features) {
            featuresTable.innerHTML = project.features.map(feat => `
                <div class="feature-row">
                    <div class="feature-row-header">
                        <span class="feature-icon">${feat.icon}</span>
                        <span class="feature-name">${feat.feature}</span>
                    </div>
                    <div class="feature-impact">${feat.impact}</div>
                </div>
            `).join('');
        }

        // Research Section
        const researchList = document.getElementById('research-list');
        if (researchList && project.research && project.research.userInsights) {
            researchList.innerHTML = project.research.userInsights.map(insight => 
                `<li>${insight}</li>`
            ).join('');
        }

        // Technical Architecture
        const techStack = document.getElementById('tech-stack');
        if (techStack && project.technicalArchitecture && project.technicalArchitecture.stack) {
            techStack.innerHTML = project.technicalArchitecture.stack.map(tech => 
                `<span class="tech-stack-item">${tech}</span>`
            ).join('');
        }

        const archList = document.getElementById('architecture-list');
        if (archList && project.technicalArchitecture && project.technicalArchitecture.architecture) {
            archList.innerHTML = project.technicalArchitecture.architecture.map(item => 
                `<p>${item}</p>`
            ).join('');
        }

        // Results Section
        const resultsList = document.getElementById('results-list');
        if (resultsList && project.results && project.results.metrics) {
            resultsList.innerHTML = project.results.metrics.map(metric => 
                `<li>${metric}</li>`
            ).join('');
        }

        // Design Principles
        const principlesList = document.getElementById('principles-list');
        if (principlesList && project.designPrinciples) {
            principlesList.innerHTML = project.designPrinciples.map(principle => 
                `<li>${principle}</li>`
            ).join('');
        }

        // Future Enhancements
        const futureList = document.getElementById('future-list');
        if (futureList && project.futureEnhancements) {
            futureList.innerHTML = project.futureEnhancements.map(future => 
                `<li>${future}</li>`
            ).join('');
        }

        // Learnings
        const learningsList = document.getElementById('learnings-list');
        if (learningsList && project.learnings) {
            learningsList.innerHTML = project.learnings.map(learning => 
                `<li>${learning}</li>`
            ).join('');
        }

        // Footer Links
        populateModalLinks(project);
    }

    function populateTabbedModal(project) {
        // Header
        document.getElementById('modal-title').textContent = project.name;
        
        const tagline = document.querySelector('.modal-tagline');
        if (tagline) tagline.textContent = project.tagline;

        // Quick Stats
        document.getElementById('stat-duration').textContent = project.quickStats.duration;
        document.getElementById('stat-status').textContent = project.quickStats.status;
        document.getElementById('stat-impact').textContent = project.quickStats.impact;

        // Overview Tab
        document.getElementById('overview-hero').textContent = project.overview.hero;
        document.getElementById('overview-problem').textContent = project.overview.problem;
        document.getElementById('overview-solution').textContent = project.overview.solution;

        // Key Features
        const featuresContainer = document.getElementById('overview-features');
        featuresContainer.innerHTML = project.overview.keyFeatures.map(feature => `
            <div class="feature-card">
                <div class="feature-header">
                    <span class="feature-icon">${feature.icon}</span>
                    <h4 class="feature-title">${feature.title}</h4>
                </div>
                <p class="feature-description">${feature.description}</p>
            </div>
        `).join('');

        // Technical Tab
        const techStackContainer = document.getElementById('technical-stack');
        techStackContainer.innerHTML = project.technical.stack.map(tech => `
            <div class="tech-item">
                <span class="tech-name">${tech.name}</span>
                <span class="tech-version">${tech.version}</span>
                <span class="tech-purpose">${tech.purpose}</span>
            </div>
        `).join('');

        document.getElementById('technical-architecture').textContent = project.technical.architecture;

        // Key Decisions
        const decisionsContainer = document.getElementById('technical-decisions');
        decisionsContainer.innerHTML = project.technical.keyDecisions.map(decision => `
            <div class="decision-card">
                <div class="decision-question">${decision.question}</div>
                <div class="decision-answer">${decision.answer}</div>
            </div>
        `).join('');

        // Challenges
        const challengesContainer = document.getElementById('technical-challenges');
        challengesContainer.innerHTML = project.technical.challenges.map(challenge => `
            <div class="challenge-card">
                <div class="challenge-title">${challenge.challenge}</div>
                <div class="challenge-problem">
                    <div class="challenge-label">Problem</div>
                    <div class="challenge-description">${challenge.problem}</div>
                </div>
                <div class="challenge-solution">
                    <div class="challenge-label">Solution</div>
                    <div class="challenge-description">${challenge.solution}</div>
                </div>
                <div class="challenge-result">
                    <div class="challenge-label">Result</div>
                    <div class="challenge-description">${challenge.result}</div>
                </div>
            </div>
        `).join('');

        // Impact Tab
        const metricsContainer = document.getElementById('impact-metrics');
        metricsContainer.innerHTML = project.impact.metrics.map(metric => `
            <div class="metric-card">
                <div class="metric-value">${metric.value}</div>
                <div class="metric-label">${metric.label}</div>
                <div class="metric-description">${metric.description}</div>
            </div>
        `).join('');

        document.getElementById('impact-value').textContent = project.impact.businessValue;

        // Process Tab
        const researchContainer = document.getElementById('process-research');
        researchContainer.innerHTML = project.process.research.map(item => `
            <li>${item}</li>
        `).join('');

        document.getElementById('process-methodology').textContent = project.process.methodology;

        const timelineContainer = document.getElementById('process-timeline');
        timelineContainer.innerHTML = project.process.timeline.map(item => `
            <div class="timeline-item">
                <div class="timeline-phase">${item.phase}</div>
                <div class="timeline-tasks">${item.tasks}</div>
            </div>
        `).join('');

        const lessonsContainer = document.getElementById('process-lessons');
        lessonsContainer.innerHTML = project.process.lessonsLearned.map(lesson => `
            <li>${lesson}</li>
        `).join('');

        const linksContainer = document.getElementById('modal-links');
        if (linksContainer) populateModalLinks(project);
    }

    function populateModalLinks(project) {
        const linksContainer = document.getElementById('modal-links');
        let linksHTML = '';

        if (project.links && project.links.live) {
            linksHTML += `
                <a href="${project.links.live}" target="_blank" rel="noopener noreferrer" class="modal-link-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                    Live Demo
                </a>
            `;
        }

        if (project.links && project.links.github) {
            linksHTML += `
                <a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="modal-link-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Code
                </a>
            `;
        }

        if (linksContainer) linksContainer.innerHTML = linksHTML;
    }

    function announceToScreenReader(message) {
        const announcer = document.getElementById('sr-announcements') || createAnnouncer();
        announcer.textContent = message;

        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }

    function createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'sr-announcements';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
        return announcer;
    }

    // Console log for debugging
    console.log('Project modal system initialized');
    console.log('Available projects:', Object.keys(projectsData));
});
