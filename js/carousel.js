let currentIndex = 0;
let isTransitioning = false;

function updateCarousel(instant = false) {
    const carouselInner = document.querySelector('.carousel-inner');
    const dots = document.querySelectorAll('.dot');
    const videos = document.querySelectorAll('.carousel-item video');
    const totalSlides = 8; // 原始轮播项数量

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
    carouselInner.style.transform = `translateX(-${currentIndex * 110}%)`;

    // 更新圆点状态
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === displayIndex);
    });

    // 控制当前显示项的所有视频播放
    const allItems = document.querySelectorAll('.carousel-item');
    allItems.forEach((item, index) => {
        const itemVideos = item.querySelectorAll('video');
        itemVideos.forEach(video => {
            if (index === currentIndex) {
                video.currentTime = 0;
                video.play().catch(e => console.log('Video play failed:', e));
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
        video.muted = true;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
    });
    lastClone.querySelectorAll('video').forEach(video => {
        video.muted = true;
        video.setAttribute('muted', '');
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
    const originalCount = 8; // 原始轮播项数量

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

// 强制播放当前显示项的视频
function playCurrentVideos() {
    const allItems = document.querySelectorAll('.carousel-item');
    if (allItems[currentIndex]) {
        const videos = allItems[currentIndex].querySelectorAll('video');
        videos.forEach(video => {
            video.muted = true;
            video.setAttribute('muted', '');
            video.currentTime = 0;
            // 使用Promise链确保播放
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Auto-play prevented:', error);
                    // 用户交互后重试
                    document.addEventListener('click', () => {
                        video.play().catch(e => console.log('Retry play failed:', e));
                    }, { once: true });
                });
            }
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    setupInfiniteLoop();
    createDots();
    handleTransitionEnd();
    updateCarousel(true);
    
    // 延迟播放确保DOM完全加载
    setTimeout(playCurrentVideos, 200);
    
    // 监听可见性变化
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            playCurrentVideos();
        }
    });
});
