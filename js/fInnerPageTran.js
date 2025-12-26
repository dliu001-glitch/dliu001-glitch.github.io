// This function is used for the animation of innerPage transfer
// You should create two divs which contain corresponding tags and contents seperately
// After you click the 'tag', it will assign the 'activeTagID' to clicked tag,
// and then assign the 'corresActTagID' to the specific content DOM
//please note that you should named you tags and corresponding content in HTML File as following

//tag DOM 'tagid' 
//corresponding DOM 'corres-tagid'

/////////////////////////////////////////////////////////////////////////////////////////////
//The styles of activeTagID class and corresActTagID class should be writen in css file. Eg.// 
//                   .activeTagID{                                                         //
//                      color: var(--primary-blue);                                        //
//                    }                                                                    //  
//                                                                                         // 
//                   .corresActTagID{                                                      //
//                      display: flex;                                                     //
//                      flex-direction: column;                                            // 
//                      margin-left: 1rem;                                                 // 
//                      align-items: flex-start;                                           //
//                      justify-content: flex-start;                                       //
//                      flex: 70%;                                                         //
//                    }                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////


function innerTran(selectedTagID, activeTagID, corresActTagID, initializeID, corresInitializeID){
  //initialize
  let currActSubNav = sessionStorage.getItem(activeTagID);
  let currActProContent = sessionStorage.getItem(corresActTagID);
  // console.log(currActProContent=='undefined');

  if(currActSubNav===null || currActSubNav === 'undefined'){
    sessionStorage.setItem(activeTagID, initializeID);
    sessionStorage.setItem(corresActTagID, corresInitializeID);
    console.log(activeTagID);
    currActSubNav = sessionStorage.getItem(activeTagID);
    currActProContent = sessionStorage.getItem(corresActTagID);
  }

  

  
  const storedT = document.getElementById(`${currActSubNav}`);
  const storedC = document.getElementById(`${currActProContent}`);
  storedT.classList.add(activeTagID);
  storedC.classList.add(corresActTagID);
  


  const selectedDOM = document.getElementById(`${selectedTagID}`);
  selectedDOM.addEventListener('click', changeContent);

  function changeContent(c){
    const id = this.id;
    const children = Array.from(c.target.parentElement.children);
    
    children.forEach(child => {
      if(child.classList.contains(activeTagID)){
        child.classList.remove(activeTagID);
      }
    });
    c.target.classList.add(activeTagID);
    sessionStorage.setItem(activeTagID, id);

    const changedId = `corres-${id}`
    const changedContent = document.getElementById(`${changedId}`);
    const changedChildren = Array.from(changedContent.parentElement.children);
  
    changedChildren.forEach(child => {
      if(child.classList.contains(corresActTagID)){
        child.classList.remove(corresActTagID);
      }
    });
    changedContent.classList.add(corresActTagID);
    sessionStorage.setItem(corresActTagID, changedContent.id);
  }
}
