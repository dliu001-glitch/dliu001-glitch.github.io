document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    const loadingEle = document.querySelector('.loading');
    loadingEle.style.display = "none";
  }
}
