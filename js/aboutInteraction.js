const bioNav = document.querySelector('.sideBar-classifications');


const children = Array.from(bioNav.children);

children.forEach(child => {
// console.log(child.id);
  child.addEventListener('click', (e) => {
    
    // console.log(e.target);
    const childId = e.target.id;
    const cid = Array.from(e.target.parentElement.children);
    cid.forEach(c => {
      c.style.color = 'black'
      console.log(c);
    });
    e.target.style.color = '#50bce7';
    
    const corresId = `corres-${childId}`
    const getCorresContent = document.getElementById(corresId);
    const cs = Array.from(getCorresContent.parentElement.children);
    cs.forEach(c => {
      c.style.display = 'none';
    });   
    getCorresContent.style.display = 'block';
    
  });
  
  

});