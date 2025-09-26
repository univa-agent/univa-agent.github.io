// 获取所有 video-container
const videoContainers = document.querySelectorAll('.video-container');

// 遍历每个容器，为其中的视频设置同步逻辑
videoContainers.forEach(container => {
    // 获取容器内的所有视频
    const videos = container.querySelectorAll('video');

    if (videos.length === 0) return; // 如果没有视频，跳过

    const mainVideo = videos[0]; // 选取第一个视频作为主视频

    // 同步函数
    function syncVideos(source, targets) {
        targets.forEach(video => {
            // 时间同步
            if (Math.abs(video.currentTime - source.currentTime) > 0.1) {
                video.currentTime = source.currentTime;
            }
            // 播放状态同步
            if (source.paused && !video.paused) {
                video.pause();
            } else if (!source.paused && video.paused) {
                video.play();
            }
        });
    }

    // 监听主视频的事件
    mainVideo.addEventListener('play', () => {
        videos.forEach(video => video.play());
    });

    mainVideo.addEventListener('pause', () => {
        videos.forEach(video => video.pause());
    });

    mainVideo.addEventListener('timeupdate', () => {
        syncVideos(mainVideo, Array.from(videos).slice(1)); // 同步剩余视频
    });
});
