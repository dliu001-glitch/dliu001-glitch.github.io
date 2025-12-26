function resize(div, ratioWidth, ratioHeight){
  //read current div width
  let width = div.offsetWidth;
  //change div height based on the ratio you input
  let height = width * ratioHeight / ratioWidth;
  div.style.height = `${height}px`;
  //change padding according to div width
  div.children[0].style.padding = `${height/15}px ${width/20}px`;
  //change title size according to div height
  div.children[0].children[0].style.fontSize = `${height/6}px`;
  //change title line height according to div title size
  div.children[0].children[0].style.lineHeight = `${height/6*1.6}px`;
  //change content size according to div height
  div.children[0].children[1].style.fontSize = `${height/15}px`;
  //change content line height according to div title size
  div.children[0].children[1].style.lineHeight = `${height/15*1.6}px`;
}

//select the dom you want to change
const projectDiv = document.querySelectorAll('div.project');
//call the resize function whenever the size of body changed
const resizeObserver = new ResizeObserver(entries => {
  const singlePro = Array.from(projectDiv);
    singlePro.forEach(single => {
      resize(single, 16, 9);
    });
});
//listen on body changing
resizeObserver.observe(document.body);

