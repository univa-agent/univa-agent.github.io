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

        // Pause all videos and only load current slide videos (don't auto-play)
        const allVideos = document.querySelectorAll('.gallery-video');
        allVideos.forEach(video => video.pause());

        const currentSlide = galleryItems[currentGallerySlide];
        const currentVideos = currentSlide.querySelectorAll('.gallery-video');
        currentVideos.forEach(video => {
            // Only load the video, don't auto-play
            if (window.videoLazyLoader && video.dataset.src && !video.dataset.loaded) {
                window.videoLazyLoader.loadVideo(video);
            }
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

    // Optional: Auto-advance carousel every 10 seconds (disabled to prevent unwanted loading)
    // setInterval(() => {
    //     currentGallerySlide = (currentGallerySlide + 1) % totalGallerySlides;
    //     updateGalleryCarousel();
    // }, 10000);
});

// Global function to toggle gallery video playback
window.toggleGalleryVideo = function(button) {
    const container = button.closest('.gallery-video-container');
    const video = container.querySelector('video');
    const playIcon = button.querySelector('img');

    if (video.paused) {
        // If video hasn't been loaded yet, load it first
        if (!video.dataset.loaded && video.dataset.src) {
            if (window.videoLazyLoader) {
                window.videoLazyLoader.loadVideo(video);
            }
            // Wait for video to load, then play
            video.addEventListener('canplay', () => {
                video.play();
                playIcon.src = 'asserts/icons/pause.svg';
                button.title = 'Pause';
            }, { once: true });
        } else {
            // Video already loaded, just play
            video.play();
            playIcon.src = 'asserts/icons/pause.svg';
            button.title = 'Pause';
        }
    } else {
        // Pause the video
        video.pause();
        playIcon.src = 'asserts/icons/play.svg';
        button.title = 'Play';
    }
};