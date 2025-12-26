// 实时计算 thumbnail 的高度，保持 16:9 比例
function resizeThumbnails() {
  const thumbnails = document.querySelectorAll('.proThumbnail');
  
  thumbnails.forEach(thumbnail => {
    // 获取当前宽度（offsetWidth 包括边框和内边距）
    const width = thumbnail.offsetWidth;
    // 如果宽度为 0，说明元素还未渲染，跳过
    if (width === 0) return;
    
    // 计算高度：16:9 比例
    // height = width * (9/16)
    const height = (width * 9) / 16;
    // 设置高度（使用 box-sizing: border-box，所以高度也会包括边框）
    thumbnail.style.height = `${height}px`;
    
    // 设置红色条的 hover 宽度为 thumbnail 宽度的 20%
    // 红色条现在在 thumbnail-link 层级
    const thumbnailLink = thumbnail.closest('.thumbnail-link');
    if (thumbnailLink) {
      const redBar = thumbnailLink.querySelector('.thumbnail-red-bar');
      if (redBar) {
        const hoverWidth = width * 0.2;
        redBar.style.setProperty('--hover-width', `${hoverWidth}px`);
      }
    }
  });
}

// 页面加载时执行一次（等待 DOM 完全加载）
document.addEventListener('DOMContentLoaded', () => {
  // 使用 setTimeout 确保样式已应用
  setTimeout(() => {
    resizeThumbnails();
  }, 0);
});

// 使用 ResizeObserver 监听容器大小变化
const thumbnailObserver = new ResizeObserver(entries => {
  resizeThumbnails();
});

// 监听 proGrid 容器的大小变化
const proGrid = document.querySelector('.proGrid-1');
if (proGrid) {
  thumbnailObserver.observe(proGrid);
}

// 也监听窗口大小变化（作为备用）
window.addEventListener('resize', () => {
  resizeThumbnails();
});

