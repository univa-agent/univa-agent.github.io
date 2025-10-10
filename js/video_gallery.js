// Video Gallery functionality for single column layout
document.addEventListener('DOMContentLoaded', function() {
    console.log('Video Gallery JS loaded');

    const galleryItems = document.querySelectorAll('.gallery-item');
    console.log('Found', galleryItems.length, 'gallery items');

    if (galleryItems.length === 0) {
        console.error('No gallery items found! Check if HTML structure is correct.');
        return;
    }

    // Set up all videos with proper attributes first
    const allVideos = document.querySelectorAll('.gallery-item video');
    allVideos.forEach((video, index) => {
        console.log('Setting up video', index, video.src ? 'with src' : 'without src');
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';

        video.addEventListener('error', (e) => {
            console.error('Video error:', video.src, e);
        });
    });

    galleryItems.forEach((item, index) => {
        console.log('Processing item', index);

        // Handle input videos (click to play)
        const inputVideos = item.querySelectorAll('.input-side video');
        console.log('Found', inputVideos.length, 'input videos');

        inputVideos.forEach((video, vIndex) => {
            console.log('Setting up input video', vIndex);

            // Set up click handler
            video.addEventListener('click', function() {
                console.log('Input video clicked, current state:', this.paused ? 'paused' : 'playing');
                if (this.paused) {
                    this.play().catch(e => console.error('Play failed:', e));
                } else {
                    this.pause();
                }
            });

            // Add play button overlay if not exists
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

                playBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Play button clicked');
                    if (video.paused) {
                        video.play().catch(e => console.error('Play failed:', e));
                        playBtn.style.display = 'none';
                    }
                });

                video.addEventListener('play', function() {
                    playBtn.style.display = 'none';
                });

                video.addEventListener('pause', function() {
                    playBtn.style.display = 'flex';
                });

                video.addEventListener('ended', function() {
                    playBtn.style.display = 'flex';
                });
            }
        });

        // Handle output videos (auto play when visible)
        const outputVideos = item.querySelectorAll('.output-side video');
        console.log('Found', outputVideos.length, 'output videos');

        outputVideos.forEach((video, vIndex) => {
            console.log('Setting up output video', vIndex);

            // Try to play immediately if in viewport
            const rect = video.getBoundingClientRect();
            const isInViewport = rect.top >= 0 && rect.left >= 0 &&
                               rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                               rect.right <= (window.innerWidth || document.documentElement.clientWidth);

            if (isInViewport) {
                console.log('Output video is in viewport, attempting to play');
                video.play().catch(e => console.log('Immediate play prevented:', e));
            }

            // Set up intersection observer for scroll-based playback
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log('Output video is intersecting, attempting to play');
                        video.play().catch(e => {
                            console.log('Auto-play prevented:', e);
                        });
                    } else {
                        video.pause();
                    }
                });
            }, {
                threshold: 0.3 // Play when 30% of video is visible
            });

            observer.observe(video);
        });
    });

    console.log('Video gallery setup complete');
});