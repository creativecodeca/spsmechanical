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

    // Contact Form AJAX Submission (prevents redirect)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i data-lucide="loader" class="mr-2 h-4 w-4 animate-spin"></i> Sending...';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            try {
                // Submit form via AJAX
                await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                // Reset form on success
                contactForm.reset();

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
