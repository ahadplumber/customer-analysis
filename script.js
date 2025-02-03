document.addEventListener('DOMContentLoaded', () => {
    const infoPanel = document.querySelector('.info-panel');
    const infoPanelContent = document.querySelector('.info-content');
    const segmentButtons = document.querySelectorAll('.segment-btn');
    let activeStep = null;
    let currentSegment = 'smb-unmanaged'; // Default segment

    // Debug function to verify data integrity
    function debugCheckDataIntegrity() {
        console.group('Data Integrity Check');
        
        // Check all DOM elements have corresponding data
        document.querySelectorAll('.step').forEach(step => {
            const stepId = step.id;
            const stepData = journeyData.steps.find(s => s.id === stepId);
            if (!stepData) {
                console.error(`Missing data for step: ${stepId}`);
            } else {
                // Verify required properties
                const requiredProps = ['id', 'title', 'userGoal', 'painPoints'];
                requiredProps.forEach(prop => {
                    if (!stepData[prop]) {
                        console.error(`Missing ${prop} for step: ${stepId}`);
                    }
                });
            }
        });

        // Check all data has corresponding DOM elements
        journeyData.steps.forEach(step => {
            const element = document.getElementById(step.id);
            if (!element) {
                console.error(`Missing DOM element for step data: ${step.id}`);
            }
        });

        console.groupEnd();
    }

    // Debug function to test segment visibility
    function debugCheckSegmentVisibility(segment) {
        console.group(`Segment Visibility Check: ${segment}`);
        
        document.querySelectorAll('.step').forEach(step => {
            const stepId = step.id;
            const stepData = journeyData.steps.find(s => s.id === stepId);
            
            if (!stepData) {
                console.error(`No data found for step: ${stepId}`);
                return;
            }
            
            const segments = stepData.segments;
            const shouldBeVisible = segments.includes('all') || segments.includes(segment);
            const isVisible = !step.classList.contains('hidden');
            
            if (shouldBeVisible !== isVisible) {
                console.error(`Visibility mismatch for step: ${stepId}`);
                console.error(`Should be visible: ${shouldBeVisible}, Is visible: ${isVisible}`);
                console.error(`Segments: ${segments.join(',')}, Current segment: ${segment}`);
            }
        });

        console.groupEnd();
    }

    // Add this debug function at the top level
    function debugProductCreationPath(segment) {
        console.group('Product Creation Path Debug');
        console.log(`Current segment: ${segment}`);
        
        const productCreationSteps = [
            'create-product',
            'product-hub',
            'product-catalog',
            'select-sku',
            'upload-artwork',
            'download-mockup',
            'publish-product'
        ];
        
        productCreationSteps.forEach(stepId => {
            const stepData = journeyData.steps.find(s => s.id === stepId);
            if (stepData) {
                const element = document.getElementById(stepId);
                const isVisible = element && !element.classList.contains('hidden');
                console.log(`Step: ${stepId}`);
                console.log(`  Segments: ${stepData.segments.join(',')}`);
                console.log(`  Should be visible: ${stepData.segments.includes('all') || stepData.segments.includes(segment)}`);
                console.log(`  Is visible: ${isVisible}`);
            } else {
                console.error(`No data found for step: ${stepId}`);
            }
        });
        
        console.groupEnd();
    }

    // Add event listeners to segment buttons
    segmentButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            segmentButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update current segment
            currentSegment = button.dataset.segment;
            console.log(`Segment changed to: ${currentSegment}`);
            
            // Update visible steps
            updateVisibleSteps(currentSegment);

            // Debug checks
            debugCheckSegmentVisibility(currentSegment);
            debugProductCreationPath(currentSegment);
        });
    });

    function updateVisibleSteps(segment) {
        console.log("Segment Visibility Check:", segment);

        // Hide all paths first
        document.querySelectorAll('.path').forEach(path => {
            const pathSegments = path.getAttribute('data-path-segments');
            if (pathSegments) {
                path.style.display = (pathSegments.includes(segment) || pathSegments.includes('all')) ? 'block' : 'none';
            }
        });

        // Process each step
        document.querySelectorAll('.step').forEach(step => {
            const stepId = step.id;
            const stepData = findStepData(stepId);
            
            // Get segments from journeyData instead of HTML attribute
            const segments = stepData ? stepData.segments : [];
            
            // Determine if step should be visible
            const shouldBeVisible = segments.includes('all') || segments.includes(segment);
            
            // Debug logging for Product Creation Path
            if (step.closest('.path-steps')?.parentElement?.querySelector('h3')?.textContent === 'Product Creation') {
                console.log('Product Creation Path Debug');
                console.log('Step:', stepId);
                console.log('  Segments:', segments);
                console.log('  Should be visible:', shouldBeVisible);
            }
            
            // Set visibility
            step.style.display = shouldBeVisible ? 'block' : 'none';
            console.log('  Is visible:', step.style.display === 'block');
        });
    }

    // Helper function to find step data from journeyData
    function findStepData(stepId) {
        return journeyData.steps.find(step => step.id === stepId);
    }

    // Add event listeners to all steps
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('mouseenter', (e) => {
            console.log('Mouse enter on step:', step.id);
            const stepData = journeyData.steps.find(s => s.id === step.id);
            console.log('Found step data:', stepData);
            
            if (stepData) {
                if (!stepData.title || !stepData.userGoal || !stepData.painPoints || !stepData.stage) {
                    console.error('Missing required data for step:', {
                        id: step.id,
                        title: !!stepData.title,
                        userGoal: !!stepData.userGoal,
                        painPoints: !!stepData.painPoints,
                        stage: !!stepData.stage
                    });
                }
                showStepInfo(stepData, e);
            } else {
                console.error(`No data found for step: ${step.id}`);
            }
        });

        step.addEventListener('mouseleave', () => {
            hideStepInfo();
            if (activeStep !== step.id) {
                step.classList.remove('active');
            }
        });
    });

    // Show step information in the floating panel
    function showStepInfo(stepData, event) {
        // Data validation with detailed logging
        if (!stepData || !stepData.title || !stepData.userGoal || !stepData.painPoints || !stepData.stage) {
            console.error('Invalid step data:', {
                hasStepData: !!stepData,
                title: stepData?.title,
                userGoal: stepData?.userGoal,
                painPoints: stepData?.painPoints,
                stage: stepData?.stage
            });
            return;
        }

        // Get stage information with validation
        const stageInfo = journeyData.stages[stepData.stage];
        if (!stageInfo) {
            console.error('Missing stage info for step:', {
                stepId: stepData.id,
                stage: stepData.stage,
                availableStages: Object.keys(journeyData.stages)
            });
            return;
        }

        // Remove active class from previous step
        if (activeStep) {
            const prevElement = document.getElementById(activeStep);
            if (prevElement) {
                prevElement.classList.remove('active');
            }
        }

        // Add active class to current step
        const currentElement = document.getElementById(stepData.id);
        if (currentElement) {
            currentElement.classList.add('active');
            activeStep = stepData.id;
            
            // Update info panel content with step title, stage, and details
            infoPanel.innerHTML = `
                <h3>
                    ${stepData.title}
                    <span class="stage-badge ${stepData.stage}">${stageInfo.name}</span>
                </h3>
                <div class="info-content">
                    <div class="info-section">
                        <h4>User Goal</h4>
                        <p>${stepData.userGoal}</p>
                    </div>
                    <div class="info-section">
                        <h4>Pain Points</h4>
                        <ul>
                            ${stepData.painPoints.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;

            // Position and show the panel
            positionInfoPanel(event);
            infoPanel.classList.add('visible');
        } else {
            console.error('Could not find DOM element for step:', stepData.id);
        }
    }

    function hideStepInfo() {
        infoPanel.classList.remove('visible');
    }

    function positionInfoPanel(event) {
        const padding = 20; // Padding from the cursor
        const panelWidth = 350; // Width of the info panel
        const panelHeight = infoPanel.offsetHeight;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate position
        let left = event.clientX + padding;
        let top = event.clientY + padding;
        
        // Adjust if panel would overflow right side
        if (left + panelWidth > viewportWidth) {
            left = event.clientX - panelWidth - padding;
        }
        
        // Adjust if panel would overflow bottom
        if (top + panelHeight > viewportHeight) {
            top = event.clientY - panelHeight - padding;
        }
        
        // Set the position
        infoPanel.style.left = `${left}px`;
        infoPanel.style.top = `${top}px`;
    }

    // Export Functions
    function exportToExcel() {
        // Redirect to Google Sheets
        window.open('https://docs.google.com/spreadsheets/d/1vZY1wjK-6jfE-wN4uzIGtFaHldcKNABwWWVgLZysSY8/edit?gid=1991605521#gid=1991605521&range=A1', '_blank');
    }

    // Add export button event listeners
    document.getElementById('export-excel').addEventListener('click', exportToExcel);

    // Run initial debug checks
    debugCheckDataIntegrity();
    debugCheckSegmentVisibility(currentSegment);

    // Initialize visible steps
    updateVisibleSteps(currentSegment);

    // Chat functionality
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.querySelector('.chat-messages');
    let threadId = null;

    // Initialize chat thread
    async function initializeChat() {
        try {
            console.log('Initializing chat...');
            const response = await fetch('/api/chat/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Chat initialized with thread:', data.threadId);
            threadId = data.threadId;
            
            // Add initial welcome message
            addMessage("Hi! I'm your AI assistant. I can help you understand the user journey map. What would you like to know?", 'assistant');
        } catch (error) {
            console.error('Error initializing chat:', error);
            addMessage("Sorry, I'm having trouble connecting to the server. Please try refreshing the page.", 'assistant');
        }
    }

    async function handleUserMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        if (!threadId) {
            console.error('No thread ID available');
            addMessage("Sorry, the chat hasn't been properly initialized. Please refresh the page.", 'assistant');
            return;
        }

        // Disable input while processing
        chatInput.disabled = true;
        sendButton.disabled = true;

        // Add user message to chat
        addMessage(message, 'user');
        chatInput.value = '';

        try {
            // Add loading indicator
            const loadingMessage = addMessage("Thinking...", 'assistant');

            console.log('Sending message:', { threadId, message });
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    threadId,
                    message
                })
            });

            // Remove loading message
            loadingMessage.remove();

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.response) {
                console.error('Invalid response format:', data);
                throw new Error('Invalid response from server');
            }
            addMessage(data.response, 'assistant');
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage("Sorry, I encountered an error. Please try again or refresh the page.", 'assistant');
        } finally {
            // Re-enable input
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }

    function addMessage(text, type) {
        console.log('Adding message:', { text, type });
        
        const message = document.createElement('div');
        message.classList.add('message', type);

        // For assistant messages, preserve the text formatting
        if (type === 'assistant') {
            const textContainer = document.createElement('div');
            textContainer.classList.add('assistant-response');
            
            // Get the content from the response object or use text directly
            const content = (typeof text === 'object' && text.mainResponse) ? text.mainResponse : text;
            console.log('Content to render:', content);
            
            // Split by double newlines to separate paragraphs
            const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(p => p);
            console.log('Parsed paragraphs:', paragraphs);
            
            paragraphs.forEach((paragraph, index) => {
                const p = document.createElement('p');
                // Preserve single line breaks within paragraphs
                const lines = paragraph.split('\n').map(line => line.trim()).filter(line => line);
                console.log(`Paragraph ${index} lines:`, lines);
                
                p.innerHTML = lines.join('<br>');
                textContainer.appendChild(p);
            });
            
            message.appendChild(textContainer);
        } else {
            // For user messages, just display the text
            const textContainer = document.createElement('div');
            textContainer.textContent = text;
            message.appendChild(textContainer);
        }

        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return message;
    }

    // Initialize chat when page loads
    initializeChat();

    // Event listeners for chat
    sendButton.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    });

    // Fullscreen chat functionality
    const chatContainer = document.querySelector('.chat-container');
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    
    fullscreenToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('fullscreen');
        
        // Adjust main container margin
        const mainContainer = document.querySelector('.container');
        if (chatContainer.classList.contains('fullscreen')) {
            mainContainer.style.marginRight = '0';
        } else {
            mainContainer.style.marginRight = '440px';
        }
        
        // Force scroll to bottom of chat messages
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Add escape key listener for exiting fullscreen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatContainer.classList.contains('fullscreen')) {
            chatContainer.classList.remove('fullscreen');
            document.querySelector('.container').style.marginRight = '440px';
        }
    });

    // Add this function near the top with other debug functions
    function validateJourneyData() {
        console.group('Journey Data Validation');
        
        // Validate stages
        console.log('Validating stages...');
        if (!journeyData.stages) {
            console.error('Missing stages data');
        } else {
            Object.entries(journeyData.stages).forEach(([stageId, stage]) => {
                if (!stage.name) {
                    console.error(`Stage ${stageId} is missing name property`);
                }
            });
        }
        
        // Validate steps
        console.log('Validating steps...');
        if (!journeyData.steps) {
            console.error('Missing steps data');
        } else {
            journeyData.steps.forEach(step => {
                const missingFields = [];
                if (!step.id) missingFields.push('id');
                if (!step.title) missingFields.push('title');
                if (!step.userGoal) missingFields.push('userGoal');
                if (!step.painPoints) missingFields.push('painPoints');
                if (!step.stage) missingFields.push('stage');
                
                if (missingFields.length > 0) {
                    console.error(`Step ${step.id || 'unknown'} is missing required fields:`, missingFields);
                }
                
                // Validate stage reference
                if (step.stage && !journeyData.stages[step.stage]) {
                    console.error(`Step ${step.id} references non-existent stage: ${step.stage}`);
                }
                
                // Validate DOM element exists
                const element = document.getElementById(step.id);
                if (!element) {
                    console.error(`No DOM element found for step ${step.id}`);
                }
            });
        }
        
        console.groupEnd();
    }

    // Add this line after the existing debug checks
    // ... existing code ...
    debugCheckDataIntegrity();
    debugCheckSegmentVisibility(currentSegment);
    validateJourneyData(); // Add this line
    // ... rest of the code ...
}); 