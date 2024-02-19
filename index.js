//javascript to initialize and edit owl carousel properties
$(".owl-carousel").owlCarousel({
  nav: true,
  dots: false,
  autoplay: false,
  mouseDrag:false,
  autoplayTimeout: 2500,
  responsive: {
    0: {
      items: 1,
    },
    420: {
      items: 1,
    },
    800: {
      items: 1,
    },

    1100: {
      items: 1,
    },
  },
});
//js for application

//all variables declaration
let elementID;
let idCounter = 1;
let inputId = "";
let currentUndoRedoIndex = 0
let changesForUndoRedo = [[],[],[]];
const elementIndices = {
  "image1": 0,
  "image2": 1,
  "image3": 2
};
let tempForReplacing = [[],[],[]];
let originalElements =[];
let originalElementsChild =[];

// Function to check element ID and return its index
const buttonForAddingText = document.getElementById("addtext");
//event listener for adding text
buttonForAddingText.addEventListener("click", function () {
  addTextInput(elementID);
});
const fontSizeInput = document.getElementById("fontSizeInput");
const colorInput = document.getElementById("colorInput");
const fontFamilySelect = document.getElementById("fontFamilySelect");
fontSizeInput.addEventListener("change", handleChange);
colorInput.addEventListener("change", handleChange);
fontFamilySelect.addEventListener("change", handleChange);
const forwardBtn = document.getElementById("forward");
const backwardBtn = document.getElementById("backward");
const saveSlideChange = document.getElementById("saveSlideChange");
const owlStage = document.querySelector(".owl-stage");
const changefrom = document.getElementById("changefrom").value ;
const changeto = document.getElementById("changeto").value;
const sortable = document.querySelector('.Sortable');

//getting active element id
function logActiveElementId() {
  const activeElement = document.querySelector(".active");
  if (activeElement) {
    elementID = activeElement.querySelector(".Imagecon").id;
  } 
}
//Domcontent loaded
document.addEventListener("DOMContentLoaded", function () {
  logActiveElementId();
  const prevButton = document.querySelector(".owl-prev");
  const nextButton = document.querySelector(".owl-next");
  if (prevButton && nextButton) {
    prevButton.addEventListener("click", logActiveElementId);
    nextButton.addEventListener("click", logActiveElementId);
  }
});
//get index of elementid
function getElementIndex(elementID) {
  if (elementID in elementIndices) {
    return elementIndices[elementID];
  } else {
    return -1;
  }
}
//addingTextFunction
function addTextInput(elementId) {
  let parentElement = document.getElementById(elementId);
  let inputElement = document.createElement("p");
  inputElement.contentEditable = true;
  inputElement.textContent = "Editable content";
  inputElement.id = "input" + idCounter++;
  parentElement.appendChild(inputElement);
  const index = getElementIndex(elementID);
  if (index !== -1) {
     let changedInput = inputElement.id
     let changedInputElement = "element created"
     let changedData = {changedInput, changedInputElement};
     changesForUndoRedo[index].push(changedData);
     changedInputElement = document.getElementById(changedInput).outerHTML;
     changesForUndoRedo[index].push({changedInput,changedInputElement});
    }
  makeDraggable(inputElement);
  inputElement.addEventListener("click", function () {
    inputId = inputElement.id;
    console.log(inputId)
  });
}
//make draggable function
function makeDraggable(element) {
  element.addEventListener("mousedown", function (e) {
    var offsetX = e.clientX - parseInt(window.getComputedStyle(element).left);
    var offsetY = e.clientY - parseInt(window.getComputedStyle(element).top);

    function drag(e) {
      var newX = e.clientX - offsetX;
      var newY = e.clientY - offsetY;
      var maxX = element.parentElement.offsetWidth - element.offsetWidth;
      var maxY = element.parentElement.offsetHeight - element.offsetHeight;

      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX > maxX) newX = maxX;
      if (newY > maxY) newY = maxY;

      element.style.left = newX + "px";
      element.style.top = newY + "px";
    }

    function stopDrag() {
      const index = getElementIndex(elementID);
      if (index !== -1) {
         let changedInput = element.id
         let changedInputElement = document.getElementById(changedInput).outerHTML;
         let changedData = {changedInput, changedInputElement};
         changesForUndoRedo[index].push(changedData);
        }
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  });
}
//handle change for changing color,font-size and fontfamily
function handleChange(event) {
  const inputType = event.target.type;
  const inputValue =
    inputType === "color"
      ? event.target.value.toUpperCase()
      : event.target.value;
  if (inputId == "") {
    return;
  }
  let inputElement = document.getElementById(inputId);
  if (inputType === "number") {
    inputElement.style.fontSize = `${inputValue}px`;
  } else if (inputType === "select-one") {
    let fontFamily;
    switch (inputValue) {
      case "roboto":
        fontFamily = "Roboto";
        break;
      case "lato":
        fontFamily = "Lato";
        break;
      case "poppins":
        fontFamily = "Poppins";
        break;
      case "opensans":
        fontFamily = "Open Sans";
        break;
      default:
        fontFamily = "inherit";
    }
    inputElement.style.fontFamily = `${fontFamily}, sans-serif`;
  } else if (inputType === "color") {
    inputElement.style.color = inputValue;
  }
  const index = getElementIndex(elementID);
  if (index !== -1) {
     let changedInput = inputId;
     let changedInputElement = document.getElementById(inputId).outerHTML;
     let changedData = {changedInput, changedInputElement};
     changesForUndoRedo[index].push(changedData);
     console.log(changesForUndoRedo)
    }
}
//undo functionality
backwardBtn.addEventListener("click", function () {
  let changes;
  const index = getElementIndex(elementID);
  changes = changesForUndoRedo[index];
  currentChangeIndex = changes.length;
  if (currentChangeIndex >= 0) {
    currentChangeIndex--;
    if (currentChangeIndex <= 0) {
      return;
    }
    let change = changes[currentChangeIndex - 1];
    if (change.changedInputElement === "element created") {
      // document.getElementById(change.changedInput).remove();
      document.getElementById(change.changedInput).style.display = "none";
    } else {
      document.getElementById(change.changedInput).outerHTML =
        change.changedInputElement;
    }
  }
  let removedChange = changes.pop();
  tempForReplacing[index].push(removedChange)
});
//redo functionality
forwardBtn.addEventListener("click", function () {
  let changes;
  const index = getElementIndex(elementID);
  changes = changesForUndoRedo[index];
  currentChangeIndex++;
  if (tempForReplacing[index].length > 0) {
    let change = tempForReplacing[index].pop();
    if (change.changedInputElement === "element created") {
      addTextInput(elementID);
    } else {
      document.getElementById(change.changedInput).outerHTML =
        change.changedInputElement;
    }
    makeDraggable(document.getElementById(change.changedInput));
    changesForUndoRedo[index].push(change);

  }
});

//slide change by number
function changeSlidesByNumber(){
  const changefrom = document.getElementById("changefrom").value ;
  const changeto = document.getElementById("changeto").value;
  if(changefrom < 1 || changefrom > 3 || changeto < 1 || changeto > 3 ){
    alert("please enter a number from 1 to 3");
    return;
  }
 else if(changefrom > 0 && changefrom < 4 && changeto > 0 && changeto < 4 ){
   const changeFromElement= owlStage.childNodes[changefrom-1];
   const changeToElement= owlStage.childNodes[changeto-1];
   const changeFromElementChild = changeFromElement.childNodes[0];
   const changeToElementChild = changeToElement.childNodes[0]; 
  let clonedChangeToElementChild = changeToElementChild.cloneNode(true);

  // Replace changeFromElementChild with clonedChangeToElementChild
  changeFromElement.replaceChild(clonedChangeToElementChild, changeFromElementChild);
  
  // replaced changeToElementChild with changeFromElementChild
  changeToElement.replaceChild(changeFromElementChild, changeToElementChild);
  }
  logActiveElementId();
}

saveSlideChange.addEventListener("click", function(){
changeSlidesByNumber();
});

//sorting for drag and drop
function refreshNodes(CurrentSortingIndex){
  let childElement;

  for(let i=0; i<3; i++){
    let element = owlStage.childNodes[i];
    originalElements.push(element);
    childElement = element.childNodes[0];
    originalElementsChild.push(childElement);
  }

  //slide change by drag 
  function changeSlidesByDrag() {
    let elements = [...originalElements];
    let changeElementsChild = [...originalElementsChild];

    for (let i = 0; i < CurrentSortingIndex.length; i++) {
      let id = CurrentSortingIndex[i];
      let index = originalElementsChild.findIndex(el => el.id === id);
      if(index !== -1){
        let cloneElementChild = changeElementsChild[index].cloneNode(true);
        elements[i].replaceChild(cloneElementChild, elements[i].childNodes[0]);
      }
    }
  }

  changeSlidesByDrag();
  originalElements= [];
  originalElementsChild=[];
  logActiveElementId();
  addEventListenersToInputElements();
}
function addEventListenersToInputElements() {
  let inputElements = document.querySelectorAll('p');
  inputElements.forEach(inputElement => {
    inputElement.addEventListener('click', function () {
      makeDraggable(inputElement)
      inputId = inputElement.id;
      console.log(inputId)
    });
  });
}


//handle slide
function logClasses() {
  let currentSorting= [];
  Array.from(sortable.children).forEach(function(child) {
    switch(child.className) {
      case "img1":
        currentSorting.push("image1");
        break;
      case "img2":
        currentSorting.push("image2");
        break;
      case "img3":
        currentSorting.push("image3");
        break;
    }
  }); 
refreshNodes(currentSorting);
}
// Add event listeners to each child div
Array.from(sortable.children).forEach(function(child) {
    child.draggable = true;
    child.addEventListener('dragstart', handleDragStart, false);
    child.addEventListener('dragover', handleDragOver, false);
    child.addEventListener('drop', handleDrop, false);
});

// Store the current position of the element being dragged
let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
      e.stopPropagation();
  }
  if (dragSrcEl !== this) {
      dragSrcEl.parentNode.removeChild(dragSrcEl);
      var dropHTML = e.dataTransfer.getData('text/html');
      
      // Check the position of the dragged element and the target element
      var rect = this.getBoundingClientRect();
      var y = e.clientY - rect.top;  // y position within the element.
      
      if (y < rect.height / 2) {
          this.insertAdjacentHTML('beforebegin', dropHTML);
      } else {
          this.insertAdjacentHTML('afterend', dropHTML);
      }
      
      let dropElem = y < rect.height / 2 ? this.previousSibling : this.nextSibling;
      addDnDHandlers(dropElem);

      // Log the classes after each drop
      logClasses();
  }
  return false;
}
function addDnDHandlers(elem) {
    elem.addEventListener('dragstart', handleDragStart, false);
    elem.addEventListener('dragover', handleDragOver, false);
    elem.addEventListener('drop', handleDrop, false);
}


