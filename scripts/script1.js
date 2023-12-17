
let firstOut = new class{
  constructor(){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'scripts/script.php' , false);
    xhr.send("");
  }
} 
////////////////////

let height = "4vh";
let fontSize = "2vh";
let margin ="25px"

let forms = new class {
  inputer = document.createElement('div');
  textInputer = document.createElement('input');
  linkInputer = document.createElement('input');
  creator = document.createElement('button');
  textSetter = document.createElement('button');
  linkSetter = document.createElement('button');
  elemAdder = document.createElement('button');
  box3 = document.getElementById('box3');

  constructor() {
    this.inputer.id = "inputer";

    this.textInputer.placeholder = "input text"; 
    this.textInputer.id = "textInputer"; 
    this.textInputer.style.fontSize = fontSize;
    this.textInputer.style.margin= margin;
    this.textInputer.style.height = height

    this.linkInputer.placeholder = "input link"; 
    this.linkInputer.id = "hrefInputer"; 
    this.linkInputer.style = this.textInputer.style;
    this.linkInputer.style.margin= margin;
    this.linkInputer.style.height = height

    this.creator.textContent = 'create dropdown';
    this.creator.id = "creator"; 
    this.creator.style = this.textInputer.style;

    this.textSetter.textContent = 'set text';
    this.textSetter.id = "textSetter";
    this.textSetter.style = this.textInputer.style;

    this.linkSetter.textContent = 'set link';
    this.linkSetter.id = "linkSetter";
    this.linkSetter.style = this.textInputer.style;

    this.elemAdder.textContent = 'add elem';
    this.elemAdder.id = "elemAdder";
    this.elemAdder.style = this.textInputer.style;

    this.inputer.appendChild(this.textInputer);
    this.inputer.appendChild(this.textSetter);
    this.inputer.appendChild(this.linkInputer);
    this.inputer.appendChild(this.linkSetter);
    this.inputer.appendChild(this.creator);
    this.inputer.appendChild(this.elemAdder);
    this.box3.appendChild(this.inputer);
  }
}

let counterID = new class{
  dropIDs = [];
  childs = new Map();
  links = new Map();
  names = new Map();

  appendDrop(dropID){
    this.dropIDs.push(dropID);
    this.childs.set(dropID, []);
    //this.links.set(dropID, href);
    //this.names.set(dropID, text);
  }
  appendChild(dropID, childID, text = "", href = ""){
    if(this.childs.has(dropID)){
      this.childs.get(dropID).push(childID);
      this.links.set(childID, href);
      this.names.set(childID, text);
    }   
  }
  size(){
    return this.dropIDs.length;
  }
  getChilds(dropID){
    if(this.childs.has(dropID)){
      return this.childs.get(dropID);
    }  
  }
}

let selectedID = "";

function getDropdownId(str){
  while (!isCharNumber(str[str.length - 1])) {
    str = str.slice(0, str.length - 1);
  }
  return str;
}
function isCharNumber(c) {
  return c >= '0' && c <= '9';
}

let dropForm = new class{
  dropBox = document.createElement('div');

  constructor() {
    this.dropBox.style.outline = "none";
    this.dropBox.id = "dropBox";
    forms.box3.appendChild(this.dropBox);      
  }

  createDropdown(name, href){  
    let newID = "dropdown"+ String(counterID.size());
    counterID.appendDrop(newID);

    let dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');
  
    dropdown.id = newID;
  
    let btn = document.createElement('button');
    btn.classList.add('dropbtn');
    btn.textContent = name;
    btn.id = newID + "Btn";
    counterID.appendChild(newID, btn.id, name, href);

    let content = document.createElement('div');
    content.classList.add('dropdown-content');
    content.id = newID + "Content";
  
    dropdown.appendChild(btn);
    dropdown.appendChild(content);
    document.getElementById("dropBox").appendChild(dropdown);
  
    if (href != "") {
      btn.addEventListener("click", (e) => {
        window.location.href = href;
      });  
    }
  
    dropdown.addEventListener("mouseenter", (e) => {
      content.classList.toggle("show");
    });
    dropdown.addEventListener("mouseleave", (e) => {
      content.classList.toggle("show");
    });
  }

  appendDropdownContent(DropdownID, textContent, href){
    if(document.getElementById(DropdownID + "Content")){ 
      let elem = document.createElement('a');

      elem.id = DropdownID + "Content" + counterID.getChilds(DropdownID).length;
      counterID.appendChild(DropdownID, elem.id, textContent, href)

      elem.textContent = textContent;
      elem.href = href;

      document.getElementById(DropdownID + "Content").appendChild(elem);
    }
  }
}

dropForm.dropBox.addEventListener("contextmenu", (e) => {
  if(e.target.id == "dropBox") return;
  if( selectedID != ""){
    document.getElementById( selectedID).style.color = "white";
  }
  selectedID = e.target.id;
  e.target.style.color ="red"; 
});

forms.creator.addEventListener("click", (e) => {
  dropForm.createDropdown(forms.textInputer.value, forms.linkInputer.value);
});

forms.textSetter.addEventListener("click", (e) => {
  if( selectedID != ""){
    document.getElementById( selectedID).textContent = forms.textInputer.value;
    if(counterID.names.has(selectedID)){
      counterID.names.set(selectedID, forms.textInputer.value);
    } 
  }
});

forms.linkSetter.addEventListener("click", (e) => {
  if( selectedID != ""){
    let elem = document.getElementById( selectedID);
    if(elem.tagName == 'A'){
      elem.href = forms.linkInputer.value;
      //counterID.links.get(elem.id).push(elem.href);   
    }
    else{
      //counterID.links.set(elem.id, forms.linkInputer.value);
      elem.addEventListener("click", (e) => {
        location.href = forms.linkInputer.value;  
      })
    }

    if(counterID.links.has(elem.id)){
      counterID.links.set(elem.id, forms.linkInputer.value);
    } 
  }
});

forms.elemAdder.addEventListener("click", (e) => {
  if( selectedID != ""){
    dropForm.appendDropdownContent(getDropdownId(selectedID), forms.textInputer.value, forms.linkInputer.value);
  }
});

//////////////////////////////////
let dataURL = 'data.txt';
let oldData = "";
//let newData = "";

var intervalID = window.setInterval(upload, 2000);

/*
async function upload1(){
  let response1 = await fetch('scripts/data.txt', { method: 'GET'});
  let text = await response1.text();
  if(text != oldData){
    fetch('scripts/script.php', { method: 'POST', body: dataToStr() });
  }
}
*/

async function upload(){
  await fetch('scripts/data.txt', { method: 'GET'}).then((response1)=>{
    let text = response1.text();
    if(text != oldData){
      fetch('scripts/script.php', { method: 'POST', body: dataToStr() });
    }
  }  
  );
}

function dataToStr(){
  str = "";
  counterID.dropIDs.forEach(elem => {
    counterID.childs.get(elem).forEach(objID=>{
      let obj = document.getElementById(objID);
      let text = counterID.names.get(objID);
      let link = counterID.links.get(objID);
      str += (" id:"+ objID + " text:" + text + " link:"+link + ";");
    });
    str += "\n";
  });
  oldData = str;
  return str;
}