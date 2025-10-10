let currentIndex = 0;
let isTransitioning = false;

function updateCarousel(instant = false) {
    const carouselInner = document.querySelector('.carousel-inner');
    const dots = document.querySelectorAll('.dot');
    const videos = document.querySelectorAll('.carousel-item video');
    const totalSlides = 7; // 原始轮播项数量

    // 计算实际显示的索引（用于圆点）- 考虑克隆元素
    let displayIndex = currentIndex - 1; // 减1因为第一个是克隆的
    if (displayIndex < 0) displayIndex = totalSlides - 1;
    if (displayIndex >= totalSlides) displayIndex = 0;

    // 设置过渡效果
    if (instant) {
        carouselInner.style.transition = 'none';
    } else {
        carouselInner.style.transition = 'transform 0.5s ease-in-out';
    }

    // 更新滑动
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;

    // 更新活动状态
    const allItems = document.querySelectorAll('.carousel-item');
    allItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
    });

    // 更新圆点状态
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === displayIndex);
    });

    // 轮播切换时的视频处理（不自动播放新视频）
    allItems.forEach((item, index) => {
        const itemVideos = item.querySelectorAll('video');
        itemVideos.forEach(video => {
            if (index === currentIndex) {
                // 确保当前视频的懒加载
                if (window.videoLazyLoader && video.dataset.src && !video.dataset.loaded) {
                    window.videoLazyLoader.loadVideo(video);
                }
                // 只更新控制按钮状态，不自动播放新视频
                updateControlButtons(video);
            } else {
                video.pause();
            }
        });
    });
}

function setupInfiniteLoop() {
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    // 克隆第一个和最后一个元素
    const firstClone = carouselItems[0].cloneNode(true);
    const lastClone = carouselItems[carouselItems.length - 1].cloneNode(true);
    
    // 为克隆元素中的视频添加必要属性
    firstClone.querySelectorAll('video').forEach(video => {
        video.setAttribute('playsinline', '');
    });
    lastClone.querySelectorAll('video').forEach(video => {
        video.setAttribute('playsinline', '');
    });
    
    // 添加克隆元素
    carouselInner.appendChild(firstClone);
    carouselInner.insertBefore(lastClone, carouselItems[0]);
    
    // 初始位置设为1（跳过克隆的最后一个元素）
    currentIndex = 1;
    updateCarousel(true);
}

function handleTransitionEnd() {
    const carouselInner = document.querySelector('.carousel-inner');
    const totalSlides = document.querySelectorAll('.carousel-item').length - 2; // 减去两个克隆元素
    
    carouselInner.addEventListener('transitionend', () => {
        if (isTransitioning) return;
        
        if (currentIndex === 0) {
            // 到达克隆的最后一个，跳到真正的最后一个
            currentIndex = totalSlides;
            updateCarousel(true);
        } else if (currentIndex === totalSlides + 1) {
            // 到达克隆的第一个，跳到真正的第一个
            currentIndex = 1;
            updateCarousel(true);
        }
    });
}

function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateCarousel();
    setTimeout(() => { isTransitioning = false; }, 500);
}

function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateCarousel();
    setTimeout(() => { isTransitioning = false; }, 500);
}

function gotoSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index + 1; // 加1因为有克隆元素在前面
    updateCarousel();
    setTimeout(() => { isTransitioning = false; }, 500);
}

function createDots() {
    const dotsContainer = document.querySelector('.dots-container');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const originalCount = 7; // 原始轮播项数量

    // 清空容器（防止重复生成）
    dotsContainer.innerHTML = '';

    // 只为原始元素生成圆点（不包括克隆的）
    for (let i = 0; i < originalCount; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.onclick = () => gotoSlide(i); // 绑定跳转函数
        dotsContainer.appendChild(dot);
    }
}

// 播放/暂停切换函数
function togglePlayPause(button) {
    const videoContainer = button.closest('.video-container');
    const video = videoContainer.querySelector('video');
    const pauseIcon = button.querySelector('.pause-icon');
    const playIcon = button.querySelector('.play-icon');

    if (video.paused) {
        // 如果视频还未加载，先加载视频
        if (!video.dataset.loaded && video.dataset.src) {
            if (window.videoLazyLoader) {
                window.videoLazyLoader.loadVideo(video);
            }
            // 等待视频加载完成后再播放
            video.addEventListener('canplay', () => {
                video.play();
                pauseIcon.style.display = 'block';
                playIcon.style.display = 'none';
            }, { once: true });
        } else {
            // 视频已加载，直接播放
            video.play();
            pauseIcon.style.display = 'block';
            playIcon.style.display = 'none';
        }
        video.dataset.userPaused = 'false';
        video.dataset.userClicked = 'true'; // 标记为用户已点击
    } else {
        video.pause();
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
        video.dataset.userPaused = 'true';
    }
}

// 静音/取消静音切换函数
function toggleMute(button) {
    const videoContainer = button.closest('.video-container');
    const video = videoContainer.querySelector('video');
    const volumeOnIcon = button.querySelector('.volume-on-icon');
    const volumeOffIcon = button.querySelector('.volume-off-icon');

    if (video.muted) {
        video.muted = false;
        volumeOnIcon.style.display = 'block';
        volumeOffIcon.style.display = 'none';
    } else {
        video.muted = true;
        volumeOnIcon.style.display = 'none';
        volumeOffIcon.style.display = 'block';
    }
}

// 更新视频控制按钮状态
function updateControlButtons(video) {
    const videoContainer = video.closest('.video-container');
    const playPauseBtn = videoContainer.querySelector('.play-pause-btn');
    const muteBtn = videoContainer.querySelector('.mute-btn');

    if (playPauseBtn) {
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        const playIcon = playPauseBtn.querySelector('.play-icon');

        if (video.paused) {
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'block';
        } else {
            pauseIcon.style.display = 'block';
            playIcon.style.display = 'none';
        }
    }

    if (muteBtn) {
        const volumeOnIcon = muteBtn.querySelector('.volume-on-icon');
        const volumeOffIcon = muteBtn.querySelector('.volume-off-icon');

        if (video.muted) {
            volumeOnIcon.style.display = 'none';
            volumeOffIcon.style.display = 'block';
        } else {
            volumeOnIcon.style.display = 'block';
            volumeOffIcon.style.display = 'none';
        }
    }
}

// 轮播切换时的视频处理（不自动播放新视频）
function handleCarouselVideoSwitch() {
    const allItems = document.querySelectorAll('.carousel-item');
    if (allItems[currentIndex]) {
        const videos = allItems[currentIndex].querySelectorAll('video');
        videos.forEach(video => {
            // 只更新控制按钮状态，不自动播放
            updateControlButtons(video);
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有视频为不静音状态
    const allVideos = document.querySelectorAll('.carousel-item video');
    allVideos.forEach(video => {
        video.muted = false;
        video.dataset.userPaused = 'true'; // 默认用户没有播放（需要点击才播放）
        // 更新控制按钮状态
        updateControlButtons(video);
    });

    setupInfiniteLoop();
    createDots();
    handleTransitionEnd();
    updateCarousel(true);

    // 不再自动播放，等待用户交互
});
