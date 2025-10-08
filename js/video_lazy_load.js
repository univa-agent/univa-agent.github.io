// Video lazy loading functionality
class VideoLazyLoader {
    constructor() {
        this.videos = document.querySelectorAll('video[data-src]');
        this.galleryVideos = document.querySelectorAll('.gallery-carousel-item video[data-src]');
        this.init();
    }

    init() {
        // Configure Intersection Observer for lazy loading
        this.setupIntersectionObserver();

        // Add loading indicators to videos
        this.addLoadingIndicators();

        // Handle gallery carousel visibility changes
        this.setupGalleryObserver();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadVideo(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all videos with data-src attribute
        this.videos.forEach(video => {
            this.observer.observe(video);
        });
    }

    setupGalleryObserver() {
        // Special handling for gallery videos - only load when carousel item is active
        const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target.querySelector('video[data-src]');
                    if (video) {
                        this.loadVideo(video);
                    }
                }
            });
        }, {
            threshold: 0.5 // Load when 50% visible
        });

        // Observe gallery carousel items
        document.querySelectorAll('.gallery-carousel-item').forEach(item => {
            galleryObserver.observe(item);
        });
    }

    loadVideo(video) {
        if (video.dataset.loaded) return; // Already loaded

        const dataSrc = video.dataset.src;
        if (!dataSrc) return;

        // Show loading indicator
        this.showLoading(video);

        // Create new source element if needed
        const source = video.querySelector('source');
        if (source && !source.src) {
            source.src = dataSrc;
        } else if (!source) {
            const newSource = document.createElement('source');
            newSource.src = dataSrc;
            newSource.type = 'video/mp4';
            video.appendChild(newSource);
        }

        // Load the video
        video.load();

        // Mark as loaded
        video.dataset.loaded = 'true';

        // Hide loading indicator when video can play
        video.addEventListener('canplay', () => {
            this.hideLoading(video);
        }, { once: true });

        // Handle loading errors
        video.addEventListener('error', () => {
            this.showError(video);
        }, { once: true });
    }

    addLoadingIndicators() {
        this.videos.forEach(video => {
            const container = video.closest('.video-container') || video.parentElement;
            if (container) {
                // Create loading indicator
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'video-loading-indicator';
                loadingDiv.innerHTML = `
                    <div class="loading-spinner"></div>
                    <span class="loading-text">加载中...</span>
                `;
                loadingDiv.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                    display: none;
                    z-index: 10;
                    text-align: center;
                `;

                // Create error indicator
                const errorDiv = document.createElement('div');
                errorDiv.className = 'video-error-indicator';
                errorDiv.innerHTML = `
                    <span class="error-text">视频加载失败</span>
                `;
                errorDiv.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 0, 0, 0.8);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                    display: none;
                    z-index: 10;
                    text-align: center;
                `;

                container.style.position = 'relative';
                container.appendChild(loadingDiv);
                container.appendChild(errorDiv);
            }
        });
    }

    showLoading(video) {
        const container = video.closest('.video-container') || video.parentElement;
        const loadingIndicator = container.querySelector('.video-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
    }

    hideLoading(video) {
        const container = video.closest('.video-container') || video.parentElement;
        const loadingIndicator = container.querySelector('.video-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    showError(video) {
        const container = video.closest('.video-container') || video.parentElement;
        const loadingIndicator = container.querySelector('.video-loading-indicator');
        const errorIndicator = container.querySelector('.video-error-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        if (errorIndicator) {
            errorIndicator.style.display = 'block';
        }
    }

    // Method to preload videos for better UX
    preloadVideos(videoElements) {
        videoElements.forEach(video => {
            if (!video.dataset.loaded && video.dataset.src) {
                this.loadVideo(video);
            }
        });
    }

    // Method to check if video is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.videoLazyLoader = new VideoLazyLoader();
});

// Add CSS for loading spinner
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 5px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading-text, .error-text {
        font-size: 12px;
        line-height: 1.2;
    }

    .video-container {
        position: relative;
    }

    video[data-src]:not([data-loaded="true"]) {
        opacity: 0.7;
    }

    video[data-loaded="true"] {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);