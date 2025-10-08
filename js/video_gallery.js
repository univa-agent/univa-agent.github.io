// Video Gallery Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    let currentGallerySlide = 0;
    const galleryCarouselInner = document.querySelector('.gallery-carousel-inner');
    const galleryItems = document.querySelectorAll('.gallery-carousel-item');
    const totalGallerySlides = galleryItems.length;
    const galleryDotsContainer = document.querySelector('.gallery-dots-container');

    // Create gallery dots
    function createGalleryDots() {
        for (let i = 0; i < totalGallerySlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToGallerySlide(i));
            galleryDotsContainer.appendChild(dot);
        }
    }

    // Update gallery carousel position
    function updateGalleryCarousel() {
        galleryCarouselInner.style.transform = `translateX(-${currentGallerySlide * 100}%)`;

        // Update dots
        const dots = document.querySelectorAll('.gallery-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentGallerySlide);
        });

        // Pause all videos and handle current slide videos with lazy loading
        const allVideos = document.querySelectorAll('.gallery-video');
        allVideos.forEach(video => video.pause());

        const currentSlide = galleryItems[currentGallerySlide];
        const currentVideos = currentSlide.querySelectorAll('.gallery-video');
        currentVideos.forEach(video => {
            // Ensure video is loaded before attempting to play
            if (window.videoLazyLoader && video.dataset.src && !video.dataset.loaded) {
                window.videoLazyLoader.loadVideo(video);
            }

            // Try to play the video (will work better if already loaded)
            video.play().catch(error => {
                console.log('Auto-play prevented:', error);
            });
        });
    }

    // Go to specific slide
    function goToGallerySlide(index) {
        currentGallerySlide = index;
        updateGalleryCarousel();
    }

    // Next slide
    window.nextGallerySlide = function() {
        currentGallerySlide = (currentGallerySlide + 1) % totalGallerySlides;
        updateGalleryCarousel();
    }

    // Previous slide
    window.prevGallerySlide = function() {
        currentGallerySlide = (currentGallerySlide - 1 + totalGallerySlides) % totalGallerySlides;
        updateGalleryCarousel();
    }

    // Initialize gallery carousel
    createGalleryDots();
    updateGalleryCarousel();

    // Auto-play videos in current slide
    const galleryVideos = document.querySelectorAll('.gallery-video');
    galleryVideos.forEach(video => {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        video.addEventListener('error', (e) => {
            console.error('Video playback error:', e);
        });
    });

    // Optional: Auto-advance carousel every 10 seconds
    setInterval(() => {
        currentGallerySlide = (currentGallerySlide + 1) % totalGallerySlides;
        updateGalleryCarousel();
    }, 10000);
});