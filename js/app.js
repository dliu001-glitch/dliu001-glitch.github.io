// 自动识别当前页面并添加 currPage 类
function setCurrentPage() {
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-menu ul li a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    const linkFile = linkHref.split('/').pop();
    
    // 如果链接指向当前页面，添加 currPage 类和 active 类
    if (linkFile === currentFile || 
        (currentFile === '' && linkFile === 'index.html') ||
        (currentFile === 'index.html' && linkFile === 'index.html')) {
      link.classList.add('currPage');
      link.parentElement.classList.add('active');
    } else {
      link.classList.remove('currPage');
      link.parentElement.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', setCurrentPage);





