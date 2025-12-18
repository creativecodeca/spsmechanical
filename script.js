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

    // Custom Plumbing CAPTCHA
    let captchaVerified = false;
    let targetSquare = null;
    const captchaGrid = document.getElementById('captcha-grid');
    const captchaPipe = document.getElementById('captcha-pipe');
    const captchaError = document.getElementById('captcha-error');

    if (captchaGrid && captchaPipe) {
        // Create 16 grid squares (4x4)
        for (let i = 0; i < 16; i++) {
            const square = document.createElement('div');
            square.className = 'border-2 border-border rounded-lg transition-all';
            square.dataset.index = i;
            captchaGrid.appendChild(square);
        }

        // Randomly select target square
        const randomIndex = Math.floor(Math.random() * 16);
        targetSquare = captchaGrid.children[randomIndex];
        targetSquare.classList.add('bg-primary/20', 'border-primary', 'animate-pulse');

        // Drag and drop logic
        captchaPipe.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
        });

        Array.from(captchaGrid.children).forEach(square => {
            square.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            square.addEventListener('drop', (e) => {
                e.preventDefault();
                if (square === targetSquare) {
                    // Correct square!
                    captchaVerified = true;
                    square.classList.remove('animate-pulse');
                    square.classList.add('bg-primary');
                    square.innerHTML = captchaPipe.innerHTML;
                    captchaPipe.style.display = 'none';
                    captchaError.classList.add('hidden');

                    // Success feedback
                    const successMsg = document.createElement('p');
                    successMsg.className = 'text-sm text-primary font-medium mt-2';
                    successMsg.textContent = '✓ Security check passed!';
                    document.getElementById('captcha-container').appendChild(successMsg);
                } else {
                    // Wrong square
                    captchaError.classList.remove('hidden');
                    captchaError.textContent = 'Wrong square! Try again.';
                }
            });
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
                captchaError.textContent = 'Please complete the security check first';
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
                if (targetSquare) {
                    targetSquare.innerHTML = '';
                    targetSquare.classList.remove('bg-primary');
                    targetSquare.classList.add('bg-primary/20', 'border-primary', 'animate-pulse');
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
