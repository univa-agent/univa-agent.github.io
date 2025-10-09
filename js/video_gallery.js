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

        // Handle video playback for current slide
        handleSlideVideoPlayback();
    }

    // Handle video playback for current slide
    function handleSlideVideoPlayback() {
        const currentSlide = galleryItems[currentGallerySlide];

        // Pause all videos first
        const allVideos = document.querySelectorAll('.gallery-carousel-item video');
        allVideos.forEach(video => {
            video.pause();
        });

        // Handle input videos (click to play)
        const inputVideos = currentSlide.querySelectorAll('.input-side video');
        inputVideos.forEach(video => {
            // Set up click to play
            video.addEventListener('click', function() {
                if (this.paused) {
                    this.play();
                } else {
                    this.pause();
                }
            });

            // Add play button overlay for input videos
            if (!video.nextElementSibling || !video.nextElementSibling.classList.contains('input-video-play-btn')) {
                const playBtn = document.createElement('div');
                playBtn.className = 'input-video-play-btn';
                playBtn.innerHTML = '▶';
                playBtn.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50px;
                    height: 50px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 20px;
                    z-index: 10;
                `;

                const container = video.parentElement;
                container.style.position = 'relative';
                container.appendChild(playBtn);

                playBtn.addEventListener('click', function() {
                    if (video.paused) {
                        video.play();
                        playBtn.style.display = 'none';
                    }
                });

                video.addEventListener('pause', function() {
                    playBtn.style.display = 'flex';
                });

                video.addEventListener('play', function() {
                    playBtn.style.display = 'none';
                });
            }
        });

        // Handle output videos (auto play)
        const outputVideos = currentSlide.querySelectorAll('.output-side video');
        outputVideos.forEach(video => {
            // Auto play output videos
            video.play().catch(e => {
                console.log('Auto-play prevented:', e);
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

    // Set up video attributes
    const allGalleryVideos = document.querySelectorAll('.gallery-carousel-item video');
    allGalleryVideos.forEach(video => {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        video.addEventListener('error', (e) => {
            console.error('Video playback error:', e);
        });
    });
});