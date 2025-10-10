// Video Gallery functionality for single column layout - Fixed version
(function() {
    'use strict';

    console.log('=== VIDEO GALLERY FIXED VERSION ===');

    function setupVideoGallery() {
        console.log('Setting up video gallery...');

        const galleryItems = document.querySelectorAll('.gallery-item');
        console.log('Found', galleryItems.length, 'gallery items');

        if (galleryItems.length === 0) {
            console.error('No gallery items found! Check if HTML structure is correct.');
            return;
        }

        // Set up all videos with proper attributes first
        const allVideos = document.querySelectorAll('.gallery-item video');
        console.log('Found', allVideos.length, 'total videos in gallery');

        allVideos.forEach((video, index) => {
            console.log(`Setting up video ${index}:`, {
                src: video.src,
                className: video.className,
                parentClass: video.parentElement.className,
                currentSrc: video.currentSrc,
                readyState: video.readyState,
                networkState: video.networkState
            });

            // Ensure proper attributes
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = 'metadata';
            video.controls = false; // Hide default controls

            // Add visual border for debugging
            video.style.border = '2px solid #FF6B6B';

            video.addEventListener('error', (e) => {
                console.error(`Video ${index} error:`, video.src, e);
            });

            video.addEventListener('loadedmetadata', () => {
                console.log(`Video ${index} metadata loaded, duration:`, video.duration);
            });

            video.addEventListener('loadstart', () => {
                console.log(`Video ${index} load started`);
            });
        });

        // Process each gallery item
        galleryItems.forEach((item, itemIndex) => {
            console.log(`Processing gallery item ${itemIndex}`);

            // Handle input videos (click to play)
            const inputVideos = item.querySelectorAll('.input-side video');
            console.log(`Found ${inputVideos.length} input videos in item ${itemIndex}`);

            inputVideos.forEach((video, videoIndex) => {
                console.log(`Setting up input video ${videoIndex} in item ${itemIndex}`);

                // Ensure the parent container has relative positioning
                const container = video.parentElement;
                if (container) {
                    container.style.position = 'relative';
                    container.style.zIndex = '1';
                    console.log(`Set position: relative on container for input video ${videoIndex}`);
                }

                // Remove any existing play button first
                const existingBtn = container.querySelector('.input-video-play-btn');
                if (existingBtn) {
                    existingBtn.remove();
                    console.log(`Removed existing play button for input video ${videoIndex}`);
                }

                // Create and add play button overlay
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
                    z-index: 100;
                    transition: all 0.3s ease;
                `;

                container.appendChild(playBtn);
                console.log(`Added play button for input video ${videoIndex}`);

                // Make video clickable by ensuring it has proper z-index
                video.style.position = 'relative';
                video.style.zIndex = '2';
                video.style.cursor = 'pointer';

                // Enhanced click handler for video
                video.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Input video ${videoIndex} clicked, current state:`, this.paused ? 'paused' : 'playing');

                    if (this.paused) {
                        this.play().then(() => {
                            console.log(`Input video ${videoIndex} started playing`);
                        }).catch(error => {
                            console.error(`Input video ${videoIndex} play failed:`, error);
                        });
                    } else {
                        this.pause();
                        console.log(`Input video ${videoIndex} paused`);
                    }
                });

                // Enhanced click handler for play button
                playBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Play button for input video ${videoIndex} clicked`);

                    if (video.paused) {
                        video.play().then(() => {
                            console.log(`Input video ${videoIndex} started via button`);
                            playBtn.style.display = 'none';
                        }).catch(error => {
                            console.error(`Input video ${videoIndex} button play failed:`, error);
                        });
                    }
                });

                // Video state event handlers
                video.addEventListener('play', function() {
                    console.log(`Input video ${videoIndex} play event fired`);
                    playBtn.style.display = 'none';
                });

                video.addEventListener('pause', function() {
                    console.log(`Input video ${videoIndex} pause event fired`);
                    playBtn.style.display = 'flex';
                });

                video.addEventListener('ended', function() {
                    console.log(`Input video ${videoIndex} ended event fired`);
                    playBtn.style.display = 'flex';
                });

                // Ensure video is initially paused
                if (!video.paused) {
                    video.pause();
                }
            });

            // Handle output videos (auto play when visible)
            const outputVideos = item.querySelectorAll('.output-side video');
            console.log(`Found ${outputVideos.length} output videos in item ${itemIndex}`);

            outputVideos.forEach((video, videoIndex) => {
                console.log(`Setting up output video ${videoIndex} in item ${itemIndex}`);

                // Make video visible for debugging
                video.style.border = '2px solid #6DE2B4';

                // Wait for video to be ready before checking viewport
                const checkViewportAndPlay = () => {
                    const rect = video.getBoundingClientRect();
                    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

                    const isInViewport = rect.top >= 0 && rect.left >= 0 &&
                                       rect.bottom <= windowHeight &&
                                       rect.right <= windowWidth;

                    console.log(`Output video ${videoIndex} viewport check:`, {
                        rect: rect,
                        windowHeight: windowHeight,
                        windowWidth: windowWidth,
                        isInViewport: isInViewport,
                        readyState: video.readyState,
                        paused: video.paused
                    });

                    if (isInViewport && video.readyState >= 2) { // HAVE_CURRENT_DATA
                        console.log(`Output video ${videoIndex} is in viewport and ready, attempting to play`);
                        video.play().then(() => {
                            console.log(`Output video ${videoIndex} started playing`);
                        }).catch(error => {
                            console.log(`Output video ${videoIndex} play prevented:`, error.message);
                        });
                    }
                };

                // Check viewport immediately if video is ready
                if (video.readyState >= 2) {
                    checkViewportAndPlay();
                } else {
                    // Wait for video to be ready
                    video.addEventListener('loadedmetadata', checkViewportAndPlay);
                    video.addEventListener('canplay', checkViewportAndPlay);
                }

                // Set up intersection observer for scroll-based playback
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        console.log(`Output video ${videoIndex} intersection:`, entry.isIntersecting);

                        if (entry.isIntersecting) {
                            console.log(`Output video ${videoIndex} is intersecting, attempting to play`);
                            video.play().then(() => {
                                console.log(`Output video ${videoIndex} started playing via observer`);
                            }).catch(error => {
                                console.log(`Output video ${videoIndex} observer play prevented:`, error.message);
                            });
                        } else {
                            video.pause();
                            console.log(`Output video ${videoIndex} paused (out of viewport)`);
                        }
                    });
                }, {
                    threshold: 0.3 // Play when 30% of video is visible
                });

                observer.observe(video);
                console.log(`Output video ${videoIndex} observer attached`);
            });
        });

        console.log('=== VIDEO GALLERY SETUP COMPLETE ===');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupVideoGallery);
    } else {
        // DOM is already loaded
        setupVideoGallery();
    }

    // Also try again after a short delay to ensure all resources are loaded
    setTimeout(setupVideoGallery, 1000);
    setTimeout(setupVideoGallery, 3000);

})();