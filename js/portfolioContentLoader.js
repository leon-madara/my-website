/**
 * Portfolio Content Loader
 * Dynamically loads project content based on selected project
 * Uses projectsData from projectData.js
 */

const PortfolioContentLoader = {
    // Project ID mapping (1-indexed to match toggle buttons)
    projectMap: {
        1: 'eastleigh',
        2: 'delivah',
        3: 'edumanage'
    },

    /**
     * Load content for a specific project
     * @param {number} projectNumber - Project number (1, 2, or 3)
     */
    loadProjectContent(projectNumber) {
        const projectId = this.projectMap[projectNumber];
        if (!projectId || typeof projectsData === 'undefined') {
            console.warn('Project data not available');
            return;
        }

        const project = projectsData[projectId];
        if (!project) {
            console.warn(`Project ${projectId} not found in projectsData`);
            return;
        }

        console.log(`Loading content for project: ${project.name}`);

        // Update all content pages
        this.updateOverviewPage(project);
        this.updateRoleTimelinePage(project);
        this.updateTechStackPage(project);
        this.updateChallengePage(project);
        this.updatePainPointsPage(project);
        this.updateObjectivesPage(project);
        this.updateSuccessCriteriaPage(project);
        this.updateMetricsPage(project);
        this.updateUserFeedbackPage(project);
        this.updateBetaTestingPage(project);
        this.updateIterationsPage(project);
        this.updateQAProcessPage(project);
        this.updateUsabilityPage(project);
        this.updateUIShowcasePage(project);
        this.updateDesignSystemPage(project);
        this.updateArchitecturePage(project);
        this.updateImplementationPage(project);
        this.updateRoadmapPage(project);
        this.updateEnhancementsPage(project);
    },

    /**
     * Update Overview Page (Page 0)
     */
    updateOverviewPage(project) {
        const page = document.getElementById('overview');
        if (!page) return;

        const title = page.querySelector('.page-title');
        const subtitle = page.querySelector('.page-subtitle');
        const description = page.querySelector('.page-content > p');
        const infoItems = page.querySelectorAll('.info-item');

        if (title) title.textContent = project.name;
        if (subtitle) subtitle.textContent = project.tagline?.split('|')[0]?.trim() || '';
        if (description && project.overview?.hero) {
            description.textContent = project.overview.hero;
        }

        // Update info grid
        if (infoItems.length >= 3) {
            const timeline = infoItems[0].querySelector('.info-value');
            const role = infoItems[1].querySelector('.info-value');
            const status = infoItems[2].querySelector('.info-value');

            if (timeline) timeline.textContent = project.timeline || project.quickStats?.duration || '';
            if (role) role.textContent = project.hero?.role || 'Full Stack Developer';
            if (status) status.textContent = project.status || project.quickStats?.status || '';
        }
    },

    /**
     * Update Role & Timeline Page (Page 1)
     */
    updateRoleTimelinePage(project) {
        const page = document.getElementById('role-timeline');
        if (!page) return;

        const roleDesc = page.querySelector('.role-description');
        if (roleDesc && project.overview?.hero) {
            roleDesc.textContent = `As the sole developer on this project, I was responsible for end-to-end system design, implementation, and deployment.`;
        }

        // Update responsibilities based on project type
        const responsibilityCards = page.querySelectorAll('.responsibility-card');
        if (responsibilityCards.length > 0 && project.technical?.stack) {
            this.updateResponsibilityCards(responsibilityCards, project);
        }

        // Update timeline
        if (project.process?.timeline) {
            this.updateTimelineSection(page, project.process.timeline);
        }
    },

    /**
     * Update responsibility cards based on project
     */
    updateResponsibilityCards(cards, project) {
        const stack = project.technical?.stack || [];
        const isEduManage = project.id === 'edumanage';
        const isDelivah = project.id === 'delivah';

        // Frontend card
        if (cards[0]) {
            const ul = cards[0].querySelector('ul');
            if (ul) {
                if (isEduManage) {
                    ul.innerHTML = `
                        <li>React 18 with TypeScript for type-safe UI</li>
                        <li>Interactive timetable visualization grid</li>
                        <li>CSV upload workflow for student data</li>
                        <li>Real-time progress indicators during generation</li>
                    `;
                } else if (isDelivah) {
                    ul.innerHTML = `
                        <li>React 18 component architecture with TypeScript</li>
                        <li>Responsive UI/UX design using Tailwind CSS</li>
                        <li>State management with TanStack Query</li>
                        <li>Accessible components (WCAG 2.1 AA)</li>
                    `;
                }
            }
        }

        // Backend card
        if (cards[1]) {
            const ul = cards[1].querySelector('ul');
            if (ul) {
                if (isEduManage) {
                    ul.innerHTML = `
                        <li>FastAPI (Python 3.11) async API</li>
                        <li>PostgreSQL with JSONB for flexible data</li>
                        <li>Constraint satisfaction algorithm engine</li>
                        <li>Multi-format export (PDF, Excel, CSV)</li>
                    `;
                } else if (isDelivah) {
                    ul.innerHTML = `
                        <li>Supabase database schema design (PostgreSQL)</li>
                        <li>Row-Level Security (RLS) policies</li>
                        <li>Cloud storage system for document management</li>
                        <li>Email integration with SendGrid</li>
                    `;
                }
            }
        }
    },

    /**
     * Update timeline section
     */
    updateTimelineSection(page, timeline) {
        const timelineContainer = page.querySelector('.timeline');
        if (!timelineContainer || !timeline) return;

        timelineContainer.innerHTML = timeline.map(item => `
            <div class="timeline-item">
                <div class="timeline-marker">${item.phase}</div>
                <div class="timeline-content">
                    <h4>${item.tasks.split(',')[0]}</h4>
                    <ul>
                        ${item.tasks.split(',').map(task => `<li>${task.trim()}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    },

    /**
     * Update Tech Stack Page (Page 2)
     */
    updateTechStackPage(project) {
        const page = document.getElementById('tech-stack');
        if (!page || !project.technical?.stack) return;

        const stackCategories = page.querySelectorAll('.stack-category');
        const stack = project.technical.stack;

        // Group stack items by category
        const frontend = stack.filter(t => 
            ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'TanStack Query', 'Framer Motion'].includes(t.name)
        );
        const backend = stack.filter(t => 
            ['FastAPI', 'PostgreSQL', 'Supabase', 'NumPy/Pandas', 'Docker'].includes(t.name) ||
            t.name.includes('Supabase')
        );

        if (stackCategories[0] && frontend.length > 0) {
            this.updateStackCategory(stackCategories[0], frontend, '⚛️ Frontend');
        }
        if (stackCategories[1] && backend.length > 0) {
            this.updateStackCategory(stackCategories[1], backend, '🗄️ Backend & Database');
        }
    },

    /**
     * Update a stack category section
     */
    updateStackCategory(container, items, title) {
        const h3 = container.querySelector('h3');
        if (h3) h3.textContent = title;

        const techList = container.querySelector('.tech-list');
        if (techList) {
            techList.innerHTML = items.map(tech => `
                <div class="tech-item">
                    <div class="tech-name">${tech.name}</div>
                    <div class="tech-description">${tech.purpose}</div>
                    <div class="tech-version">${tech.version}</div>
                </div>
            `).join('');
        }
    },

    /**
     * Update Challenge Page (Page 3)
     */
    updateChallengePage(project) {
        const page = document.getElementById('challenge');
        if (!page) return;

        const leadText = page.querySelector('.lead-text');
        if (leadText && project.overview?.problem) {
            leadText.textContent = project.overview.problem.split('.')[0] + '.';
        }

        // Update challenge cards
        const challengeGrid = page.querySelector('.challenge-grid');
        if (challengeGrid && project.technical?.challenges) {
            challengeGrid.innerHTML = project.technical.challenges.map((challenge, index) => `
                <article class="challenge-card">
                    <div class="card-index">0${index + 1}</div>
                    <div>
                        <h3>${challenge.challenge}</h3>
                        <p>${challenge.problem}</p>
                    </div>
                </article>
            `).join('');
        }

        // Update summary cards for EduManage
        if (project.id === 'edumanage') {
            const summaryCards = page.querySelectorAll('.summary-card');
            if (summaryCards.length >= 3) {
                this.updateEduManageSummaryCards(summaryCards);
            }
        }
    },

    /**
     * Update EduManage summary cards
     */
    updateEduManageSummaryCards(cards) {
        const summaryData = [
            { label: 'Time savings', value: '99.9%', text: 'From 2-3 weeks to 45 seconds generation time.' },
            { label: 'TSC Compliance', value: '100%', text: 'Automated validation against all regulatory constraints.' },
            { label: 'Conflict rate', value: '<1%', text: 'Near-zero scheduling conflicts vs 15-20% manual.' }
        ];

        cards.forEach((card, index) => {
            if (summaryData[index]) {
                const label = card.querySelector('.summary-label');
                const value = card.querySelector('.summary-value');
                const text = card.querySelector('.summary-text');
                if (label) label.textContent = summaryData[index].label;
                if (value) value.textContent = summaryData[index].value;
                if (text) text.textContent = summaryData[index].text;
            }
        });
    },

    /**
     * Update Pain Points Page (Page 4)
     */
    updatePainPointsPage(project) {
        const page = document.getElementById('pain-points');
        if (!page) return;

        const leadText = page.querySelector('.lead-text');
        
        if (project.id === 'edumanage') {
            if (leadText) {
                leadText.textContent = 'Research with school administrators revealed critical operational challenges:';
            }
            this.updateEduManagePainPoints(page);
        } else if (project.process?.research) {
            if (leadText) {
                leadText.textContent = project.process.research[0] || '';
            }
        }
    },

    /**
     * Update EduManage-specific pain points
     */
    updateEduManagePainPoints(page) {
        const painPointCards = page.querySelectorAll('.pain-point-card');
        const painPoints = [
            { stat: '810+', title: 'Elective Clustering Complexity', quote: 'Students choosing from multiple electives create impossible scheduling conflicts. Manual grouping is a logistical nightmare.', cite: '— School Administrator' },
            { stat: '25/6', title: 'TSC Regulatory Compliance', quote: 'Maximum 25 periods per teacher per week, 6 per day. Manual compliance checking is error-prone and time-consuming.', cite: '— Deputy Principal' },
            { stat: '15-20%', title: 'High Conflict Rate', quote: 'Our manually created timetables have a 15-20% conflict rate, requiring weeks of frustrating revisions.', cite: '— Academic Dean' },
            { stat: '2-3 wks', title: 'Manual Process Time', quote: 'Creating a timetable takes 2-3 weeks every term. That\'s time we could spend on actual education.', cite: '— Principal' }
        ];

        painPointCards.forEach((card, index) => {
            if (painPoints[index]) {
                const stat = card.querySelector('.pain-point-stat');
                const title = card.querySelector('h3');
                const quote = card.querySelector('blockquote');
                const cite = card.querySelector('cite');

                if (stat) stat.textContent = painPoints[index].stat;
                if (title) title.textContent = painPoints[index].title;
                if (quote) quote.innerHTML = `"${painPoints[index].quote}" <cite>${painPoints[index].cite}</cite>`;
            }
        });
    },

    /**
     * Update Objectives Page (Page 5)
     */
    updateObjectivesPage(project) {
        const page = document.getElementById('objectives');
        if (!page) return;

        const objectiveGrid = page.querySelector('.objective-grid');
        if (!objectiveGrid) return;

        if (project.id === 'edumanage') {
            objectiveGrid.innerHTML = `
                <div class="objective-card">
                    <div class="objective-icon">⚡</div>
                    <h3>Sub-60-Second Generation</h3>
                    <p><strong>Target:</strong> Generate complete timetable in under 60 seconds</p>
                    <p><strong>Approach:</strong> Optimized constraint satisfaction algorithm</p>
                    <p class="result-badge success">✅ 45.2 seconds achieved</p>
                </div>
                <div class="objective-card">
                    <div class="objective-icon">✅</div>
                    <h3>100% TSC Compliance</h3>
                    <p><strong>Target:</strong> Zero regulatory violations</p>
                    <p><strong>Approach:</strong> Real-time validation during generation</p>
                    <p class="result-badge success">✅ 100% compliance achieved</p>
                </div>
                <div class="objective-card">
                    <div class="objective-icon">🎯</div>
                    <h3>85%+ Elective Satisfaction</h3>
                    <p><strong>Target:</strong> Students get their preferred electives</p>
                    <p><strong>Approach:</strong> Intelligent clustering algorithm</p>
                    <p class="result-badge success">✅ 85% satisfaction achieved</p>
                </div>
                <div class="objective-card">
                    <div class="objective-icon">📊</div>
                    <h3>Near-Zero Conflict Rate</h3>
                    <p><strong>Target:</strong> Less than 1% scheduling conflicts</p>
                    <p><strong>Approach:</strong> Comprehensive validation suite</p>
                    <p class="result-badge success">✅ <1% conflict rate achieved</p>
                </div>
            `;
        }
    },

    /**
     * Update Success Criteria Page (Page 6)
     */
    updateSuccessCriteriaPage(project) {
        const page = document.getElementById('success-criteria');
        if (!page || !project.impact?.metrics) return;

        const metricsComparison = page.querySelector('.metrics-comparison');
        if (metricsComparison) {
            metricsComparison.innerHTML = project.impact.metrics.slice(0, 4).map(metric => `
                <div class="metric-row">
                    <div class="metric-label">${metric.label}</div>
                    <div class="metric-bar">
                        <div class="metric-target">Target: ${metric.value}</div>
                        <div class="metric-achieved" style="width: 100%;">Achieved: ${metric.value}</div>
                    </div>
                </div>
            `).join('');
        }
    },

    /**
     * Update Metrics Page (Page 7)
     */
    updateMetricsPage(project) {
        const page = document.getElementById('metrics');
        if (!page || !project.impact?.metrics) return;

        const statGrid = page.querySelector('.impact-stat-grid');
        if (statGrid) {
            statGrid.innerHTML = project.impact.metrics.map(metric => `
                <div class="impact-stat-card">
                    <div class="stat-value">${metric.value}</div>
                    <div class="stat-label">${metric.label}</div>
                    <div class="stat-description">${metric.description}</div>
                </div>
            `).join('');
        }

        // Update business value section
        const businessValue = page.querySelector('.business-value-text');
        if (businessValue && project.impact?.businessValue) {
            businessValue.textContent = project.impact.businessValue;
        }
    },

    /**
     * Update User Feedback Page (Page 8)
     */
    updateUserFeedbackPage(project) {
        const page = document.getElementById('user-feedback');
        if (!page) return;

        if (project.id === 'edumanage') {
            const testimonialGrid = page.querySelector('.testimonial-grid');
            if (testimonialGrid) {
                testimonialGrid.innerHTML = `
                    <div class="testimonial-card">
                        <div class="testimonial-quote">"This system has transformed how we approach timetabling. What used to take weeks now takes less than a minute."</div>
                        <div class="testimonial-author">— School Administrator</div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-quote">"The TSC compliance validation alone is worth it. No more worrying about regulatory violations."</div>
                        <div class="testimonial-author">— Deputy Principal</div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-quote">"Students are happier because they're getting their preferred elective combinations."</div>
                        <div class="testimonial-author">— Academic Dean</div>
                    </div>
                `;
            }
        }
    },

    /**
     * Update Beta Testing Page (Page 9)
     */
    updateBetaTestingPage(project) {
        const page = document.getElementById('beta-testing');
        if (!page) return;

        if (project.id === 'edumanage' && project.process?.research) {
            const betaPhases = page.querySelector('.beta-phases');
            if (betaPhases) {
                betaPhases.innerHTML = `
                    <div class="beta-phase">
                        <h4>Phase 1: Domain Research</h4>
                        <p>Analyzed Kenyan education system documentation (KICD, TSC regulations)</p>
                    </div>
                    <div class="beta-phase">
                        <h4>Phase 2: Algorithm Prototyping</h4>
                        <p>Studied constraint satisfaction algorithms and timetabling research</p>
                    </div>
                    <div class="beta-phase">
                        <h4>Phase 3: User Validation</h4>
                        <p>Interviewed 3 school administrators about current processes</p>
                    </div>
                    <div class="beta-phase">
                        <h4>Phase 4: Performance Testing</h4>
                        <p>Tested with real school data (270 students, 24 teachers)</p>
                    </div>
                `;
            }
        }
    },

    /**
     * Update Iterations Page (Page 10)
     */
    updateIterationsPage(project) {
        const page = document.getElementById('iterations');
        if (!page || !project.process?.lessonsLearned) return;

        const iterationTimeline = page.querySelector('.iteration-timeline');
        if (iterationTimeline) {
            iterationTimeline.innerHTML = project.process.lessonsLearned.map((lesson, index) => `
                <div class="iteration-item">
                    <div class="iteration-number">${index + 1}</div>
                    <div class="iteration-content">
                        <p>${lesson}</p>
                    </div>
                </div>
            `).join('');
        }
    },

    /**
     * Update QA Process Page (Page 11)
     */
    updateQAProcessPage(project) {
        const page = document.getElementById('qa-process');
        if (!page) return;

        if (project.id === 'edumanage') {
            const qaLayers = page.querySelector('.qa-layers');
            if (qaLayers) {
                qaLayers.innerHTML = `
                    <div class="qa-layer">
                        <h4>Hard Constraints (Must Satisfy)</h4>
                        <ul>
                            <li>No teacher double-booking</li>
                            <li>Room capacity limits</li>
                            <li>TSC workload compliance (25/week, 6/day)</li>
                        </ul>
                    </div>
                    <div class="qa-layer">
                        <h4>Soft Constraints (Optimize)</h4>
                        <ul>
                            <li>Morning priority for core subjects (92.9% achieved)</li>
                            <li>Room utilization optimization</li>
                            <li>Workload balance across teachers</li>
                        </ul>
                    </div>
                    <div class="qa-layer">
                        <h4>Validation Suite</h4>
                        <ul>
                            <li>Comprehensive data validation on CSV upload</li>
                            <li>Real-time constraint checking during generation</li>
                            <li>Post-generation conflict detection</li>
                        </ul>
                    </div>
                `;
            }
        }
    },

    /**
     * Update Usability Testing Page (Page 12)
     */
    updateUsabilityPage(project) {
        const page = document.getElementById('usability');
        if (!page) return;

        if (project.id === 'edumanage') {
            const usabilityFindings = page.querySelector('.usability-findings');
            if (usabilityFindings) {
                usabilityFindings.innerHTML = `
                    <div class="finding-card">
                        <h4>User-Friendly Interface</h4>
                        <p>Designed for non-technical school administrators with step-by-step wizard workflow.</p>
                    </div>
                    <div class="finding-card">
                        <h4>Clear Progress Indicators</h4>
                        <p>45-second generation process includes real-time progress feedback.</p>
                    </div>
                    <div class="finding-card">
                        <h4>Intuitive Timetable View</h4>
                        <p>View schedules by class, teacher, or room with clear grid format.</p>
                    </div>
                `;
            }
        }
    },

    /**
     * Update UI Showcase Page (Page 13)
     */
    updateUIShowcasePage(project) {
        const page = document.getElementById('ui-showcase');
        if (!page || !project.overview?.keyFeatures) return;

        const uiFeatures = page.querySelector('.ui-features');
        if (uiFeatures) {
            uiFeatures.innerHTML = project.overview.keyFeatures.map(feature => `
                <div class="ui-feature-card">
                    <div class="feature-icon">${feature.icon}</div>
                    <h4>${feature.title}</h4>
                    <p>${feature.description}</p>
                </div>
            `).join('');
        }
    },

    /**
     * Update Design System Page (Page 14)
     */
    updateDesignSystemPage(project) {
        const page = document.getElementById('design-system');
        if (!page) return;

        if (project.id === 'edumanage') {
            const designSection = page.querySelector('.design-system-section');
            if (designSection) {
                designSection.innerHTML = `
                    <div class="design-principle">
                        <h4>Component-Based Architecture</h4>
                        <p>Reusable React components with TypeScript for maintainability.</p>
                    </div>
                    <div class="design-principle">
                        <h4>Data Visualization</h4>
                        <p>Clear, intuitive timetable grid format with color-coded subjects.</p>
                    </div>
                    <div class="design-principle">
                        <h4>Responsive Design</h4>
                        <p>Works across desktop and tablet for administrative use.</p>
                    </div>
                    <div class="design-principle">
                        <h4>Accessibility</h4>
                        <p>Designed for non-technical users with clear workflows.</p>
                    </div>
                `;
            }
        }
    },

    /**
     * Update Architecture Page (Page 15)
     */
    updateArchitecturePage(project) {
        const page = document.getElementById('architecture');
        if (!page || !project.technical) return;

        const archDiagram = page.querySelector('.architecture-diagram');
        if (archDiagram && project.technical.architecture) {
            archDiagram.innerHTML = `
                <div class="arch-description">
                    <p>${project.technical.architecture}</p>
                </div>
            `;
        }

        // Update key decisions
        const decisionsSection = page.querySelector('.key-decisions');
        if (decisionsSection && project.technical.keyDecisions) {
            decisionsSection.innerHTML = project.technical.keyDecisions.map(decision => `
                <div class="decision-card">
                    <h4>${decision.question}</h4>
                    <p>${decision.answer}</p>
                </div>
            `).join('');
        }
    },

    /**
     * Update Implementation Page (Page 16)
     */
    updateImplementationPage(project) {
        const page = document.getElementById('implementation');
        if (!page || !project.technical?.challenges) return;

        const implementationSection = page.querySelector('.implementation-section');
        if (implementationSection) {
            implementationSection.innerHTML = project.technical.challenges.map(challenge => `
                <div class="implementation-highlight">
                    <h4>${challenge.challenge}</h4>
                    <div class="highlight-problem">
                        <strong>Problem:</strong> ${challenge.problem}
                    </div>
                    <div class="highlight-solution">
                        <strong>Solution:</strong> ${challenge.solution}
                    </div>
                    <div class="highlight-result">
                        <strong>Result:</strong> ${challenge.result}
                    </div>
                </div>
            `).join('');
        }
    },

    /**
     * Update Roadmap Page (Page 17)
     */
    updateRoadmapPage(project) {
        const page = document.getElementById('roadmap');
        if (!page) return;

        if (project.id === 'edumanage') {
            const roadmapTimeline = page.querySelector('.roadmap-timeline');
            if (roadmapTimeline) {
                roadmapTimeline.innerHTML = `
                    <div class="roadmap-item">
                        <div class="roadmap-phase">Phase 1</div>
                        <div class="roadmap-content">
                            <h4>Multi-School Support</h4>
                            <p>Scale to support multiple schools with centralized management.</p>
                        </div>
                    </div>
                    <div class="roadmap-item">
                        <div class="roadmap-phase">Phase 2</div>
                        <div class="roadmap-content">
                            <h4>Mobile App</h4>
                            <p>Teacher and student mobile apps for schedule access.</p>
                        </div>
                    </div>
                    <div class="roadmap-item">
                        <div class="roadmap-phase">Phase 3</div>
                        <div class="roadmap-content">
                            <h4>AI Optimization</h4>
                            <p>Machine learning for improved scheduling predictions.</p>
                        </div>
                    </div>
                    <div class="roadmap-item">
                        <div class="roadmap-phase">Phase 4</div>
                        <div class="roadmap-content">
                            <h4>Integration APIs</h4>
                            <p>Connect with existing school management systems.</p>
                        </div>
                    </div>
                `;
            }
        }
    },

    /**
     * Update Enhancements Page (Page 18)
     */
    updateEnhancementsPage(project) {
        const page = document.getElementById('enhancements');
        if (!page) return;

        if (project.id === 'edumanage') {
            const enhancementGrid = page.querySelector('.enhancement-grid');
            if (enhancementGrid) {
                enhancementGrid.innerHTML = `
                    <div class="enhancement-card">
                        <div class="enhancement-icon">🎯</div>
                        <h4>95% Elective Satisfaction</h4>
                        <p>Improve algorithm to achieve 95% student elective satisfaction (currently 85%).</p>
                    </div>
                    <div class="enhancement-card">
                        <div class="enhancement-icon">📱</div>
                        <h4>Mobile Notifications</h4>
                        <p>Push notifications for schedule changes and updates.</p>
                    </div>
                    <div class="enhancement-card">
                        <div class="enhancement-icon">📊</div>
                        <h4>Analytics Dashboard</h4>
                        <p>Detailed analytics on resource utilization and scheduling patterns.</p>
                    </div>
                    <div class="enhancement-card">
                        <div class="enhancement-icon">🔄</div>
                        <h4>Real-time Adjustments</h4>
                        <p>Support for mid-term schedule modifications with conflict detection.</p>
                    </div>
                `;
            }
        }
    }
};

// Make available globally
window.PortfolioContentLoader = PortfolioContentLoader;
