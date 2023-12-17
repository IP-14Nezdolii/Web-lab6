
let height = "4vh";
let fontSize = "2vh";
let margin ="25px"

 class Counter{
  dropIDs = [];
  childs = new Map();
  links = new Map();
  names = new Map();

  appendDrop(dropID){
    this.dropIDs.push(dropID);
    this.childs.set(dropID, []);
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
let counterID = new Counter();

function getDropdownId(str){
  while (!isCharNumber(str[str.length - 1])) {
    str = str.slice(0, str.length - 1);
  }
  return str;
}
function isCharNumber(c) {
  return c >= '0' && c <= '9';
}

class Form{
  dropBox = document.createElement('div');

  constructor() {
    this.dropBox.style.outline = "none";
    this.dropBox.id = "dropBox";
    let box3 = document.getElementById("box3");
    box3.appendChild(this.dropBox);      
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

  delete(){
    let element = document.getElementById("dropBox");
    element.remove();
  }
}
let dropForm = new Form;

//////////////////////////////////
let dataURL = 'scripts/data.txt';
let oldData = "";
let data = "";

var intervalID = window.setInterval(download, 2000);

async function download() {

  let response = await getData();
  data = await response.text();
  //console.log(data);
  if(data != "" && data != oldData && data != "\n"){
      counterID = new Counter();
      dropForm.delete();
      dropForm = new Form;
      oldData = data; 

      while (data != "" && data != "\n") 
      {
        let line = {text: getline()};
    
        let elemD = getelem(line);
        dropForm.createDropdown(elemD.text, elemD.lnk);
    
        while(line.text != ""){
          let elemC = getelem(line);
          dropForm.appendDropdownContent(getDropdownId(elemD.id), elemC.text, elemC.lnk);
        }
      }
    }

   
}

async function getData(){
  return await fetch(dataURL, { method: 'GET'});
}

function getline() {
  index = data.indexOf("\n");
    if(index == -1){
      return "";
    } 
  let line = data.slice(0,index); 
  data = data.slice(index + 1, data.length);
  return line;
}

function getelem(line){
  let index1 =  line.text.indexOf(";");
  let index2 = 0;
  if (index1 == -1) return "";

  let elemline = line.text.slice(1,index1 + 1 ); 
  line.text = line.text.slice(index1 + 1, line.text.length);
  /////////////////////  

  let elem = {
    id : "",
    text : "",
    lnk : ""
  }

  index1 = elemline.indexOf(":");
  index2 = elemline.indexOf(" ");
  elem.id =  elemline.slice(index1 + 1, index2);
  elemline = elemline.slice(index2 + 1,  elemline.length);

  index1 = elemline.indexOf(":")
  index2 = elemline.indexOf(" ");

  if(0 != index2 - 1){
    elem.text = elemline.slice(index1 + 1, index2);
  }
  elemline = elemline.slice(index2 + 1,  elemline.length);

  index1 = elemline.indexOf(":")
  index2 = elemline.indexOf(";");

  if(index1 != index2) elem.lnk = elemline.slice(index1 + 1, index2);

  return elem;
}

/*
async function inp1(){
  let response = await fetch(dataURL);
  if (!response.ok) { 
      alert("Ошибка HTTP: " + response.status);
      return; 
  } 
  let text = await response.text();
  console.log(text);
}
inp1();

*/
