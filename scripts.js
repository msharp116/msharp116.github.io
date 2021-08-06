/*
 *
 *  AUTHOR: Mark Sharp
 *  Date Created: July 7, 2021
 *
*/

// Global variable declarations
var numContacts = -1;

//Does things whenever the page is finished loading.
$(document).ready(function(){
  // When the user  clicks on a row that row becomes the selected row, and will have futher information pop up
  $(".dTableRow").click(function() {
    selectRow(this);
  });
  // When the user double clicks on a row that row becomes the chosen row for that category
  $(".dTableRow").dblclick(function() {
    chooseRow(this);
  });
  // Makes select boxes default to an empty value
  $("select").prop("selectedIndex", -1);
  // Makes textareas automatically resize based on their contents.
  $(".contact > textarea").each(function () {
    if(this.scrollHeight > parseInt(this.dataset.currentSize))
      this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
  }).on("input", function () {
    if(this.scrollHeight != parseInt(this.dataset.currentSize)){
      resizeContact(this.parentElement,this.scrollHeight);
    }
  });
  // Gets the value for numContacts
   numContacts = document.getElementById("contactsTable").children.length-1;
});

// currentElement is the element that is calling the function
function expandTopNav(currentElement) {
  let x = currentElement.parentElement;
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// navIndex is optional, and the index of the nav menu it indicates
function changeActive(myElement, navIndex){
  if(myElement.className != "active"){
    //Removes the active class from the old element
    myElement.parentElement.getElementsByClassName("active")[0].removeAttribute("class");
    //Sets the new element to have the active class
    myElement.setAttribute("class", "active");
    // If a value for navIndex is provided, call changeMenu to switch the displayed nav menu
    if(navIndex != null)
      changeMenu(myElement,navIndex);
  }
}

function changeMenu(myElement, navIndex){
  let elements = document.getElementsByClassName("topnav");
  let pageGroups = document.getElementsByClassName("pageGroup");
  for(let x = 1; x < elements.length; x++){
    if(x != navIndex){
      elements[x].hidden = true;
      pageGroups[x-1].hidden = true;
    }
    else{
      elements[x].hidden = false;
      pageGroups[x-1].hidden = false;
    }
  }
}

// pageName specifies the id of the page to display
function changeDisplayedPage(pageName){
  let table = document.getElementById(pageName);
  // Check to see if the table tableGroup is already active before doing anything else
  if(table.className != "page activePage"){
    // Sets the old table to hidden
    //Try in case there is no old active table, such as in the case of the stats pageGroup's defualt state
    try {
      table.parentElement.getElementsByClassName("page activePage")[0].setAttribute("class", "page");
    } catch (err) {}
    table.setAttribute("class", "page activePage");
  }
}

// Also functions to deselect the row if clicked a second time
function selectRow(row){
  if(row.chosen == true){
    //TODO: Display information for the selected rows
    return;
  }
  let oldRow = row.parentElement.getElementsByClassName("dTableRow oddRow active")[0];
  if(oldRow == null)
    oldRow = row.parentElement.getElementsByClassName("dTableRow evenRow active")[0];
  try{
    let oldClass = oldRow.getAttribute("class");
    if(oldClass !== "active")
      oldClass = oldClass.split(" ")[0] + " " + oldClass.split(" ")[1];
    oldRow.setAttribute("class", oldClass);
  }
  catch(err){
  }

  if(!row.isSameNode(oldRow)){
    row.className += " active";
  }
}

// Will eventually interface with the sheet, currently just hides the other rows.
function chooseRow(row){
  let rows = row.parentElement.children;

  // Code to save selection to a cookie or the sheet goes here.
  if(row.chosen == true)
  {
    row.setAttribute("chosen", null);
    row.chosen = null;
    for(let x = 1; x < rows.length; x++)
      rows[x].hidden = false;
  }
  else{
    row.setAttribute("chosen", "true");
    row.chosen = true;

    for(let x = 01; x < rows.length; x++){
      let currentRow = rows[x];
      if(currentRow.chosen !== true)
        currentRow.hidden = true;
    }
  }
}

// myBool is a boolean value that reprents whether or not the text field should be displayed
// fieldID is the ID of the textField to display.
function toggleTextField (myBool, fieldID){
  if(myBool){
    document.getElementById(fieldID).setAttribute("show", "true");
  }
  else
    document.getElementById(fieldID).setAttribute("show", "false");
}

// contact is the contact class div whose children need resizing.
// height is the height to resize the elements to.
function resizeContact(contact, height) {
  let contacts = contact.children;
  for(let element of contacts) {
    element.style.height = "auto";
    element.style.height = height + "px";
    // Prevents a call to resize every time the user types something when the textarea over one line high
    element.dataset.currentSize = height;
  }
}

function hideContactExplanation() {
  let text = document.getElementById("contactsExplanation");
  text.hidden = !text.hidden;
}

//Inserts another contact into the contactsTable
function addContactRow() {
  if(numContacts != -1) {
    let contact = document.createElement("div");
    numContacts++;
    // If numContacts is even change the class to "contacts evenRow"
    if(numContacts%2 == 0)
      contact.className = "contact evenRow";
    else
      contact.className = "contact";

    contact.innerHTML = "<input type='text' class='contactName' name='cName" + numContacts + "' id='contactName" + numContacts + "'/>\n" +
    "<input type='text' class='contactRel' name='cRel'" + numContacts + " id='contactRel" + numContacts + "'/>\n" +
    "<textarea class='contactDesc' id='contactDesc" + numContacts + "' data-current-size='20'></textarea>\n" +
    "<textarea class='contactMisc' id='contactMisc" + numContacts + "' data-current-size='20'></textarea>\n" +
    "<button class='deleteContactButton' onclick='deleteContact(this.parentElement)'>X</button>";
    document.getElementById("contactsTable").appendChild(contact);
  }
  else { // This should never be reached unless something has gone wrong
    console.log("Number of contact rows not initialized, cannot add new row");
  }
}

function deleteContact(contact) {
  let parent = contact.parentElement;
  contact.remove();
  numContacts--;

  //Also update classes do coloring doesn't get broken.
  let contacts = parent.children;
  for(let x = 1,element = ""; x < contacts.length; x++){
    element = contacts[x];
    if(x%2 == 0)
      element.className = "contact evenRow";
    else
      element.className = "contact"
  }
}
