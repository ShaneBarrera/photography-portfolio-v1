document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll('img.lazy');
    let observer;

    // Function to initialize the lazy loading observer
    const initializeObserver = () => {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const image = entry.target;

                    if (entry.isIntersecting) {
                        // Lazy load the image when it enters the viewport
                        if (!image.src) {
                            image.src = image.dataset.src; // Load the image
                            image.onload = () => {
                                image.classList.remove("hidden"); // Reveal the image
                            };
                        }
                        image.style.opacity = 1; // Fade in
                        image.style.visibility = "visible"; // Make sure it's visible

                    } else {
                        // If the image is no longer in the viewport, hide it again
                        image.classList.add("hidden");
                        image.style.opacity = 0; // Hide the image
                        image.style.visibility = "hidden"; // Fully hide from view
                    }
                });
            },
            {
                rootMargin: "100px", // Preload images 100px before they enter the viewport
                threshold: 0.05, // Trigger when at least 5% of the image is visible
            }
        );

        // Observe each lazy image
        lazyImages.forEach((image) => observer.observe(image));
    };

    // Prioritize above-the-fold images
    const loadPriorityImages = () => {
        document.querySelectorAll('img.priority').forEach((img) => {
            if (!img.src) {
                img.src = img.dataset.src;
                img.onload = () => img.classList.remove("hidden");
                img.style.opacity = 1;
                img.style.visibility = "visible";
            }
        });
    };

    // Smooth scrolling for anchor links
    const enableSmoothScroll = () => {
        const anchors = document.querySelectorAll('a[href^="#"]');

        anchors.forEach((anchor) => {
            anchor.addEventListener("click", function (event) {
                event.preventDefault();
                const targetID = this.getAttribute("href").slice(1);
                const targetElement = document.getElementById(targetID);

                if (targetElement) {
                    // Disconnect the observer temporarily
                    if (observer) observer.disconnect();

                    // Calculate smooth scroll duration dynamically
                    const distance = Math.abs(
                        targetElement.getBoundingClientRect().top - window.scrollY
                    );
                    const duration = Math.min(Math.max(distance / 2, 300), 800); // 300ms to 800ms

                    // Smooth scroll to the target section
                    targetElement.scrollIntoView({ behavior: "smooth" });

                    // Force lazy load images in the target section after scrolling
                    setTimeout(() => {
                        const targetImages = targetElement.querySelectorAll('img.lazy');
                        targetImages.forEach((img) => {
                            if (!img.src) {
                                img.src = img.dataset.src;
                                img.onload = () => img.classList.remove("hidden");
                                img.style.opacity = 1;
                                img.style.visibility = "visible";
                            }
                        });

                        // Re-enable observer after scrolling
                        initializeObserver();
                    }, duration);
                }
            });
        });
    };

    // Lazy loading script initialization
    const initLazyLoading = () => {
        // Load above-the-fold images first
        loadPriorityImages();

        // Initialize lazy loading observer
        initializeObserver();

        // Enable smooth scrolling for anchor links
        enableSmoothScroll();
    };

    // Defer initialization until after DOM is loaded
    initLazyLoading();
});
