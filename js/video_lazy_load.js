// Video lazy loading functionality - DISABLED for URL-based videos
// This file is kept for compatibility but all lazy loading logic is disabled
// since videos now use direct URLs instead of data-src attributes

class VideoLazyLoader {
    constructor() {
        // No initialization needed - videos use direct URLs
    }

    init() {
        // Disabled - videos use direct URLs
    }

    // Keep method signature for compatibility but do nothing
    loadVideo(_video) {
        // No-op: videos now use direct src URLs
        return;
    }
}

// Initialize but do nothing
document.addEventListener('DOMContentLoaded', () => {
    window.videoLazyLoader = new VideoLazyLoader();
});