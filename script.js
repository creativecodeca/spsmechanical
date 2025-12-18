document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Mobile Menu Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    }

    // Simple Plumbing CAPTCHA
    let captchaVerified = false;
    const captchaPipe = document.getElementById('captcha-pipe');
    const captchaDropzone = document.getElementById('captcha-dropzone');
    const captchaError = document.getElementById('captcha-error');

    if (captchaPipe && captchaDropzone) {
        // Drag start
        captchaPipe.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            captchaPipe.style.opacity = '0.5';
        });

        captchaPipe.addEventListener('dragend', () => {
            captchaPipe.style.opacity = '1';
        });

        // Drop zone events
        captchaDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            captchaDropzone.classList.add('border-primary', 'bg-primary/10');
            captchaDropzone.classList.remove('border-primary/30');
        });

        captchaDropzone.addEventListener('dragleave', () => {
            captchaDropzone.classList.remove('border-primary', 'bg-primary/10');
            captchaDropzone.classList.add('border-primary/30');
        });

        captchaDropzone.addEventListener('drop', (e) => {
            e.preventDefault();

            // Success!
            captchaVerified = true;
            captchaPipe.style.display = 'none';
            captchaDropzone.classList.remove('border-primary/30', 'bg-muted/50');
            captchaDropzone.classList.add('border-primary', 'bg-primary/20');
            captchaDropzone.innerHTML = `
                <div class="flex items-center gap-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span class="font-medium">Security check passed!</span>
                </div>
            `;
            captchaError.classList.add('hidden');
        });
    }

    // Contact Form AJAX Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check CAPTCHA
            if (!captchaVerified) {
                captchaError.classList.remove('hidden');
                captchaError.textContent = 'Please drag the wrench into the box to verify you\'re human';
                captchaDropzone.classList.add('border-destructive');
                setTimeout(() => {
                    captchaDropzone.classList.remove('border-destructive');
                }, 2000);
                return;
            }

            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            const formAction = contactForm.getAttribute('data-action');

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i data-lucide="loader" class="mr-2 h-4 w-4 animate-spin"></i> Sending...';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            try {
                // Submit form via AJAX
                await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                // Reset form on success
                contactForm.reset();

                // Show success notification
                const notification = document.getElementById('success-notification');
                notification.classList.remove('hidden');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Auto-hide after 5 seconds
                setTimeout(() => {
                    notification.classList.add('hidden');
                }, 5000);

                // Reset CAPTCHA
                captchaVerified = false;
                if (captchaPipe) {
                    captchaPipe.style.display = 'flex';
                }
                if (captchaDropzone) {
                    captchaDropzone.classList.remove('border-primary', 'bg-primary/20');
                    captchaDropzone.classList.add('border-primary/30', 'bg-muted/50');
                    captchaDropzone.innerHTML = '<p class="text-muted-foreground text-sm">Drop the wrench here</p>';
                }

                // Re-enable button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

            } catch (error) {
                // Re-enable button on error
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }
});
