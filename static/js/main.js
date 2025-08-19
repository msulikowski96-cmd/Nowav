// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const cvUploadForm = document.getElementById('cv-upload-form');
    const cvFileInput = document.getElementById('cv-file');
    const jobTitleInput = document.getElementById('job-title');
    const jobDescriptionInput = document.getElementById('job-description');
    const jobUrlInput = document.getElementById('job-url');
    const processButton = document.getElementById('process-button');
    const uploadSuccessAlert = document.getElementById('upload-success');
    const uploadErrorAlert = document.getElementById('upload-error');
    const errorMessageSpan = document.getElementById('error-message');
    const processingIndicator = document.getElementById('processing-indicator');
    const resultsSection = document.getElementById('results-section');

    // CV preview and editor elements
    const cvPreview = document.getElementById('cv-preview');
    const cvEditor = document.getElementById('cv-editor');
    const cvTextEditor = document.getElementById('cv-text-editor');
    const editCvBtn = document.getElementById('edit-cv-btn');
    const saveCvBtn = document.getElementById('save-cv-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    // Result elements
    const resultContainer = document.getElementById('result-container');
    const copyResultBtn = document.getElementById('copy-result-btn');
    const compareVersionsBtn = document.getElementById('compare-versions-btn');

    // Options elements
    const optionInputs = document.querySelectorAll('input[name="optimization-option"]');

    // Store CV text
    let cvText = '';

    // Handle CV upload form submission
    if (cvUploadForm) {
        cvUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Check if a file is selected
            if (!cvFileInput || !cvFileInput.files[0]) {
                showError('Please select a PDF file to upload.');
                return;
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('cv_file', cvFileInput.files[0]);

            // Show loading state
            if (processButton) processButton.disabled = true;
            if (cvFileInput) cvFileInput.disabled = true;

            // Hide previous alerts
            if (uploadSuccessAlert) uploadSuccessAlert.style.display = 'none';
            if (uploadErrorAlert) uploadErrorAlert.style.display = 'none';

            // Send AJAX request to upload endpoint
            fetch('/upload-cv', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                // Check if we were redirected to login
                if (response.redirected && response.url.includes('/login')) {
                    throw new Error('You must be logged in to upload CV. Please log in first.');
                }

                // Check if response is ok
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Store the CV text
                    cvText = data.cv_text;

                    // Display the CV text in the preview
                    if (cvPreview) cvPreview.innerHTML = formatTextAsHtml(cvText);

                    // Enable editing and processing
                    if (editCvBtn) editCvBtn.disabled = false;
                    if (processButton) processButton.disabled = false;

                    // Show success message
                    if (uploadSuccessAlert) uploadSuccessAlert.style.display = 'block';

                    // Show results section and scroll to it
                    if (resultsSection) {
                        resultsSection.style.display = 'block';
                        setTimeout(() => {
                            resultsSection.scrollIntoView({ behavior: 'smooth' });
                        }, 500);
                    }
                } else {
                    showError(data.message || 'Error uploading CV');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                if (error.message.includes('logged in')) {
                    showError('You must be logged in to upload CV. Please log in first.');
                    // Optionally redirect to login
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    showError(error.message || 'Failed to upload CV. Please try again.');
                }
            })
            .finally(() => {
                // Re-enable the file input
                if (cvFileInput) cvFileInput.disabled = false;
            });
        });
    }

    // Improve CV button click
    const improveCVButton = document.getElementById('improve-cv-btn');
    if (improveCVButton) {
        improveCVButton.addEventListener('click', async function() {
            const cvText = document.getElementById('cv-text')?.value;
            if (!cvText) {
                showError('Najpierw prześlij CV');
                return;
            }

            const improvementFocus = document.getElementById('improvement-focus')?.value || 'general';
            const targetIndustry = document.getElementById('target-industry')?.value || '';

            try {
                setLoading(true);
                showProcessing('Poprawiam CV...');

                const response = await fetch('/generate-improve-cv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cv_text: cvText,
                        improvement_focus: improvementFocus,
                        target_industry: targetIndustry,
                        language: 'pl'
                    })
                });

                const data = await response.json();

                if (data.success) {
                    displayResults(data.result, 'improve_cv');
                    showSuccess(data.message);
                } else {
                    showError(data.message);
                }
            } catch (error) {
                console.error('Error improving CV:', error);
                showError('Wystąpił błąd podczas poprawy CV');
            } finally {
                setLoading(false);
                hideProcessing();
            }
        });
    }

    // Process CV button click
    if (processButton) {
        processButton.addEventListener('click', async function() {
            // Get selected option
            const selectedOptionElement = document.querySelector('input[name="optimization-option"]:checked');
            if (!selectedOptionElement) {
                showError('Please select an optimization option.');
                return;
            }
            const selectedOption = selectedOptionElement.value;

            // Get form values
            const jobTitle = jobTitleInput ? jobTitleInput.value.trim() : '';
            const jobDescription = jobDescriptionInput ? jobDescriptionInput.value.trim() : '';
            const jobUrl = jobUrlInput ? jobUrlInput.value.trim() : '';

            // Check if job description is required for certain options
            if ((selectedOption === 'optimize' || selectedOption === 'cover_letter' || selectedOption === 'feedback' || 
                 selectedOption === 'ats_check' || selectedOption === 'interview_questions' || selectedOption === 'keyword_analysis') 
                && !jobDescription && !jobUrl) {
                showError('Please provide a job description or URL for this option.');
                return;
            }

            // Check if job title is required for position optimization
            if (selectedOption === 'position_optimization' && !jobTitle) {
                showError('Please provide a job title for position-specific optimization.');
                return;
            }

            // Initialize empty roles array
            let roles = [];

            // Get selected language
            const selectedLanguageElement = document.querySelector('input[name="language"]:checked');
            const selectedLanguage = selectedLanguageElement ? selectedLanguageElement.value : 'pl';

            // Enhanced job description analysis for better CV optimization
            if (jobDescription && jobDescription.length > 100 && 
                (selectedOption === 'optimize' || selectedOption === 'position_optimization' || selectedOption === 'advanced_position_optimization')) {

                showStatus('Analizuję opis stanowiska...', 'info');

                try {
                    const jobAnalysisResponse = await fetch('/analyze-job-posting', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            job_description: jobDescription,
                            job_url: jobUrl,
                            language: selectedLanguage
                        })
                    });

                    const jobAnalysisData = await jobAnalysisResponse.json();

                    if (jobAnalysisData.success && jobAnalysisData.analysis) {
                        // Display job analysis insights
                        const analysis = jobAnalysisData.analysis;

                        let analysisHTML = '<div class="job-analysis-preview">';
                        analysisHTML += '<h4>🎯 Analiza Stanowiska:</h4>';

                        if (analysis.job_title) {
                            analysisHTML += `<p><strong>Stanowisko:</strong> ${analysis.job_title}</p>`;
                        }

                        if (analysis.industry) {
                            analysisHTML += `<p><strong>Branża:</strong> ${analysis.industry}</p>`;
                        }

                        if (analysis.key_requirements && Array.isArray(analysis.key_requirements) && analysis.key_requirements.length > 0) {
                            analysisHTML += '<p><strong>Kluczowe wymagania:</strong></p>';
                            analysisHTML += '<ul>';
                            analysis.key_requirements.slice(0, 3).forEach(req => {
                                analysisHTML += `<li>${req}</li>`;
                            });
                            analysisHTML += '</ul>';
                        }

                        if (analysis.industry_keywords && Array.isArray(analysis.industry_keywords) && analysis.industry_keywords.length > 0) {
                            analysisHTML += `<p><strong>Słowa kluczowe:</strong> ${analysis.industry_keywords.slice(0, 5).join(', ')}</p>`;
                        }

                        analysisHTML += '</div>';

                        showStatus(analysisHTML, 'success');

                        // Store analysis for CV optimization
                        if (typeof window !== 'undefined') {
                            window.jobAnalysis = analysis;
                        }
                    }
                } catch (error) {
                    console.log('Job analysis failed, proceeding with standard optimization:', error);
                }
            }

            // Prepare request data
            const requestData = {
                cv_text: cvText,
                job_title: jobTitle,
                job_description: jobDescription,
                job_url: jobUrl,
                selected_option: selectedOption,
                roles: roles,
                language: selectedLanguage
            };

            // Show processing indicator and disable buttons
            if (processingIndicator) processingIndicator.style.display = 'block';
            if (processButton) processButton.disabled = true;
            if (editCvBtn) editCvBtn.disabled = true;
            if (uploadSuccessAlert) uploadSuccessAlert.style.display = 'none';
            if (uploadErrorAlert) uploadErrorAlert.style.display = 'none';

            // Clear previous results
            if (resultContainer) resultContainer.innerHTML = '<p class="text-center">Processing your request...</p>';

            // Send AJAX request to process endpoint
            fetch('/process-cv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Display the result
                    if (resultContainer) resultContainer.innerHTML = formatTextAsHtml(data.result);

                    // If job description was extracted from URL, update the input
                    if (data.job_description && jobDescriptionInput) {
                        jobDescriptionInput.value = data.job_description;
                    }

                    // Enable copy button
                    if (copyResultBtn) copyResultBtn.disabled = false;

                    // Enable compare button if this was an optimization
                    if ((selectedOption === 'optimize' || selectedOption === 'position_optimization') && compareVersionsBtn) {
                        compareVersionsBtn.disabled = false;
                    }
                } else {
                    showError(data.message || 'Error processing CV');
                    if (resultContainer) resultContainer.innerHTML = '<p class="text-center text-danger">Processing failed. Please try again.</p>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Failed to process CV. Please try again.');
                if (resultContainer) resultContainer.innerHTML = '<p class="text-center text-danger">Processing failed. Please try again.</p>';
            })
            .finally(() => {
                // Hide processing indicator and re-enable buttons
                if (processingIndicator) processingIndicator.style.display = 'none';
                if (processButton) processButton.disabled = false;
                if (editCvBtn) editCvBtn.disabled = false;
            });
        });
    }

    // Edit CV button click
    if (editCvBtn) {
        editCvBtn.addEventListener('click', function() {
            // Set editor text and show editor
            if (cvTextEditor) cvTextEditor.value = cvText;
            if (cvPreview) cvPreview.style.display = 'none';
            if (cvEditor) cvEditor.style.display = 'block';
            editCvBtn.disabled = true;
        });
    }

    // Save CV button click
    if (saveCvBtn) {
        saveCvBtn.addEventListener('click', function() {
            // Update CV text and preview
            if (cvTextEditor) cvText = cvTextEditor.value;
            if (cvPreview) cvPreview.innerHTML = formatTextAsHtml(cvText);

            // Hide editor and show preview
            if (cvEditor) cvEditor.style.display = 'none';
            if (cvPreview) cvPreview.style.display = 'block';
            if (editCvBtn) editCvBtn.disabled = false;
        });
    }

    // Cancel edit button click
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            // Hide editor without saving changes
            if (cvEditor) cvEditor.style.display = 'none';
            if (cvPreview) cvPreview.style.display = 'block';
            if (editCvBtn) editCvBtn.disabled = false;
        });
    }

    // Copy result button click
    if (copyResultBtn) {
        copyResultBtn.addEventListener('click', function() {
            // Get the text content from the result container
            if (!resultContainer) return;
            const resultText = resultContainer.innerText;

            // Copy to clipboard
            navigator.clipboard.writeText(resultText).then(
                function() {
                    // Success - show temporary feedback
                    const originalText = copyResultBtn.innerHTML;
                    copyResultBtn.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';

                    setTimeout(function() {
                        copyResultBtn.innerHTML = originalText;
                    }, 2000);
                },
                function(err) {
                    console.error('Could not copy text: ', err);
                    showError('Failed to copy text. Please try manually selecting and copying.');
                }
            );
        });
    }

    // Compare CV versions button click
    if (compareVersionsBtn) {
        compareVersionsBtn.addEventListener('click', function() {
            fetch('/compare-cv-versions')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.has_both_versions) {
                    // Create comparison view
                    const comparisonHtml = `
                        <div class="row">
                            <div class="col-md-6">
                                <h5 class="text-primary"><i class="fas fa-file-alt me-2"></i>Original CV</h5>
                                <div class="border p-3 bg-light" style="max-height: 400px; overflow-y: auto;">
                                    ${formatTextAsHtml(data.original)}
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h5 class="text-success"><i class="fas fa-star me-2"></i>Optimized CV</h5>
                                <div class="border p-3 bg-light" style="max-height: 400px; overflow-y: auto;">
                                    ${formatTextAsHtml(data.optimized)}
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-3">
                            <button class="btn btn-secondary" onclick="location.reload()">
                                <i class="fas fa-arrow-left me-1"></i>Back to Results
                            </button>
                        </div>
                    `;
                    if (resultContainer) resultContainer.innerHTML = comparisonHtml;
                } else {
                    showError('No optimized CV available for comparison. Please optimize your CV first.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Failed to load CV versions for comparison.');
            });
        });
    }

    // Listen for option changes (just in case we need to add functionality in future)
    if (optionInputs && optionInputs.length > 0) {
        optionInputs.forEach(input => {
            input.addEventListener('change', function() {
                // Future option-specific logic can be added here
            });
        });
    }

    // Helper function to show error messages
    function showError(message) {
        if (errorMessageSpan) errorMessageSpan.textContent = message;
        if (uploadErrorAlert) uploadErrorAlert.style.display = 'block';
    }

    // Helper function to show success messages (used by improve CV)
    function showSuccess(message) {
        // Assuming there's a success alert specifically for improve CV or general success message
        // For now, we'll reuse uploadSuccessAlert logic, but ideally, a dedicated one might be better.
        if (uploadSuccessAlert) {
            // Find a more specific way to display this success message if needed, e.g., a different element
            uploadSuccessAlert.querySelector('.alert-message').textContent = message; // Assuming a structure like <div id="upload-success"><span class="alert-message"></span></div>
            uploadSuccessAlert.style.display = 'block';
        }
    }

    // Helper function to show status messages
    function showStatus(message, type = 'info') {
        // Create or update status container
        let statusContainer = document.getElementById('status-container');
        if (!statusContainer) {
            statusContainer = document.createElement('div');
            statusContainer.id = 'status-container';
            statusContainer.className = 'alert alert-info mb-3';
            statusContainer.style.display = 'none';

            // Insert before results section or at top of main content
            const resultsSection = document.getElementById('results-section');
            if (resultsSection) {
                resultsSection.parentNode.insertBefore(statusContainer, resultsSection);
            } else {
                const mainContainer = document.querySelector('.container');
                if (mainContainer) {
                    mainContainer.insertBefore(statusContainer, mainContainer.firstChild);
                }
            }
        }

        // Update status message and type - make job analysis collapsible
        if (message.includes('job-analysis-preview') || message.includes('Analiza Stanowiska')) {
            statusContainer.className = `alert alert-${type} mb-3`;
            statusContainer.innerHTML = createCollapsibleJobAnalysis(message);
        } else {
            statusContainer.className = `alert alert-${type} mb-3`;
            statusContainer.innerHTML = message;
        }

        statusContainer.style.display = 'block';

        // Auto-hide info messages after 8 seconds (longer for job analysis)
        if (type === 'info' && !message.includes('Analiza Stanowiska')) {
            setTimeout(() => {
                statusContainer.style.display = 'none';
            }, 8000);
        }
    }

    // Create collapsible job analysis
    function createCollapsibleJobAnalysis(message) {
        const collapseId = 'job-analysis-' + Date.now();

        return `
            <div class="job-analysis-container">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="fas fa-chart-line me-2"></i>
                        Analiza Stanowiska
                    </h5>
                    <button class="btn btn-sm btn-outline-light" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#${collapseId}"
                            aria-expanded="false" 
                            aria-controls="${collapseId}">
                        <i class="fas fa-chevron-down collapse-icon"></i>
                        <span class="ms-1">Pokaż szczegóły</span>
                    </button>
                </div>
                <div class="collapse mt-3" id="${collapseId}">
                    <div class="job-analysis-content">
                        ${message.replace('<div class="job-analysis-preview">', '').replace('</div>', '')}
                    </div>
                </div>
            </div>
        `;
    }

    // Helper function to format plain text as HTML with proper CV formatting
    function formatTextAsHtml(text) {
        if (!text) return '<p class="text-muted">No text available</p>';

        // Split text into lines for processing
        let lines = text.split('\n');
        let formattedHtml = '';

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            // Skip empty lines
            if (line === '') {
                formattedHtml += '<br>';
                continue;
            }

            // Check if line is a section header (ALL CAPS or starts with common CV sections)
            const cvSections = [
                'DANE OSOBOWE', 'PERSONAL DATA', 'CONTACT', 'KONTAKT',
                'PODSUMOWANIE', 'SUMMARY', 'PROFIL', 'PROFILE',
                'DOŚWIADCZENIE ZAWODOWE', 'WORK EXPERIENCE', 'EXPERIENCE', 'DOŚWIADCZENIE',
                'WYKSZTAŁCENIE', 'EDUCATION', 'EDUKACJA',
                'UMIEJĘTNOŚCI', 'SKILLS', 'KOMPETENCJE',
                'JĘZYKI', 'LANGUAGES', 'CERTYFIKATY', 'CERTIFICATES',
                'PROJEKTY', 'PROJECTS', 'HOBBY', 'ZAINTERESOWANIA', 'INTERESTS'
            ];

            const isHeader = cvSections.some(section => 
                line.toUpperCase().includes(section) || 
                (line === line.toUpperCase() && line.length > 3 && line.length < 50)
            );

            if (isHeader) {
                // Format as section header
                formattedHtml += `<h5 class="text-primary mt-4 mb-2 fw-bold">${line}</h5>`;
            } else if (line.match(/^\d{4}\s*-\s*\d{4}/) || line.match(/^\d{2}\/\d{4}/)) {
                // Date ranges - format as experience entries
                formattedHtml += `<p class="mb-1 fw-semibold text-dark">${line}</p>`;
            } else if (line.includes('@') || line.match(/^\+?\d[\d\s\-\(\)]+/) || line.includes('tel:') || line.includes('email:')) {
                // Contact information
                formattedHtml += `<p class="mb-1 text-muted">${line}</p>`;
            } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                // Bullet points
                formattedHtml += `<li class="mb-1">${line.substring(1).trim()}</li>`;
            } else {
                // Regular text
                formattedHtml += `<p class="mb-2">${line}</p>`;
            }
        }

        return `<div class="cv-formatted">${formattedHtml}</div>`;
    }

    // PWA Installation handling
    let deferredPrompt;

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', function() {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', function() {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Show update notification
    function showUpdateNotification() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'update-banner alert alert-warning position-fixed';
        updateBanner.style.cssText = 'bottom: 20px; right: 20px; z-index: 1050; max-width: 350px;';
        updateBanner.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>🔄 Dostępna aktualizacja!</strong><br>
                    <small>Odśwież aby załadować najnowszą wersję</small>
                </div>
                <button class="btn btn-sm btn-warning" onclick="updateApp()">Odśwież</button>
            </div>
        `;
        document.body.appendChild(updateBanner);
    }

    // Update app
    function updateApp() {
        window.location.reload();
    }

    // Handle share target
    if (window.location.search.includes('title=') || window.location.search.includes('text=')) {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedTitle = urlParams.get('title');
        const sharedText = urlParams.get('text');

        if (sharedTitle || sharedText) {
            console.log('Shared content received:', { title: sharedTitle, text: sharedText });
            // Handle shared content here
        }
    }

    // Request notification permission
    if ('Notification' in window && 'serviceWorker' in navigator) {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(function(permission) {
                console.log('Notification permission:', permission);
            });
        }
    }

    // Mobile menu handling
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse && navbarCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }
            }
        });

        // Close mobile menu when clicking nav links (but not dropdown toggles)
        const navLinks = navbarCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse && navbarCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // Initialize Bootstrap dropdowns
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));

    // Handle dropdown on mobile
    if (window.innerWidth <= 991) {
        dropdownElementList.forEach(dropdown => {
            dropdown.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdownMenu = this.nextElementSibling;
                if (dropdownMenu) {
                    dropdownMenu.classList.toggle('show');
                }
            });
        });
    }

    // CV URL analysis - sprawdź czy element istnieje
    const analyzeUrlBtn = document.getElementById('analyze-url-btn');
    if (analyzeUrlBtn) {
        analyzeUrlBtn.addEventListener('click', async function() {
            const jobUrl = document.getElementById('job-url').value;
            const jobDescription = document.getElementById('job-description').value;

            // Basic validation: check if jobUrl is not empty
            if (!jobUrl) {
                showError('Please enter a Job URL to analyze.');
                return;
            }

            // Disable the button and show a loading message
            analyzeUrlBtn.disabled = true;
            analyzeUrlBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...';

            try {
                const response = await fetch('/analyze-url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ job_url: jobUrl })
                });

                const data = await response.json();

                if (data.success) {
                    // Update the job description field with the scraped content
                    document.getElementById('job-description').value = data.job_description;
                    showStatus('Job description from URL successfully analyzed.', 'success');
                } else {
                    showError(data.message || 'Failed to analyze URL.');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('An unexpected error occurred. Please try again.');
            } finally {
                // Re-enable the button and reset the text
                analyzeUrlBtn.disabled = false;
                analyzeUrlBtn.innerHTML = '<i class="fas fa-link me-1"></i> Analyze URL';
            }
        });
    }

    // Analyze job posting button
    const analyzeJobBtn = document.getElementById('analyze-job-btn');
    if (analyzeJobBtn) {
        analyzeJobBtn.addEventListener('click', async function() {
            const jobDescription = document.getElementById('job-description').value;

            if (!jobDescription.trim()) {
                alert('Wprowadź opis stanowiska do analizy');
                return;
            }

            try {
                const response = await fetch('/analyze-job-posting', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        job_description: jobDescription,
                        language: 'pl'
                    })
                });

                const result = await response.json();

                if (result.success) {
                    console.log('Job analysis result:', result.analysis);
                    // Display analysis results
                    displayJobAnalysis(result.analysis);
                } else {
                    alert('Błąd analizy: ' + result.message);
                }
            } catch (error) {
                console.error('Error analyzing job:', error);
                alert('Wystąpił błąd podczas analizy stanowiska');
            }
        });
    }

    // CV processing form
    const processForm = document.getElementById('process-form');
});

// Helper function to display results (modified for 'improve_cv' type)
function displayResults(result, type) {
    const previewContainer = document.getElementById('cvDataPreview');
    if (previewContainer) {
        if (type === 'improve_cv') {
            // Handle improved CV result - może być string lub object
            if (typeof result === 'object' && result.improved_cv) {
                previewContainer.innerHTML = `<div class="improved-cv">${result.improved_cv}</div>`;
            } else if (typeof result === 'string') {
                previewContainer.innerHTML = `<div class="improved-cv">${result}</div>`;
            } else {
                previewContainer.innerHTML = '<div class="error">Nieprawidłowy format odpowiedzi</div>';
            }
        } else {
            previewContainer.innerHTML = result;
        }
    }
}

// Placeholder functions (assuming they are defined elsewhere or globally)
function setLoading(isLoading) {
    // Implementation for setting loading state
    console.log("Setting loading state:", isLoading);
}

function showProcessing(message) {
    // Implementation for showing processing message
    console.log("Showing processing:", message);
}

function hideProcessing() {
    // Implementation for hiding processing message
    console.log("Hiding processing.");
}

function displayJobAnalysis(analysis) {
    // Implementation for displaying job analysis
    console.log("Displaying job analysis:", analysis);
    const analysisContainer = document.getElementById('job-analysis-container'); // Assuming such a container exists
    if (analysisContainer) {
        let html = '<h4>Job Analysis</h4>';
        if (analysis.job_title) html += `<p><strong>Title:</strong> ${analysis.job_title}</p>`;
        if (analysis.industry) html += `<p><strong>Industry:</strong> ${analysis.industry}</p>`;
        if (analysis.key_requirements) {
            html += '<p><strong>Key Requirements:</strong></p><ul>';
            analysis.key_requirements.forEach(req => html += `<li>${req}</li>`);
            html += '</ul>';
        }
        if (analysis.industry_keywords) {
            html += '<p><strong>Keywords:</strong></p><ul>';
            analysis.industry_keywords.forEach(kw => html += `<li>${kw}</li>`);
            html += '</ul>';
        }
        analysisContainer.innerHTML = html;
        analysisContainer.style.display = 'block';
    }
}