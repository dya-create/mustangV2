
var first=[];
var selectedRow = null
var URLArray = [];
var contactArray = [];
var loading = 0;
let status = 0;
var currentContactIndex = 0; 


// Functions
function viewCurrentContact() {
    currentContact = contactArray[currentContactIndex];
    console.log(currentContact);
    document.getElementById("fullName").value = currentContact.preferredName;   
    document.getElementById("emailID").value = currentContact.email;   
    document.getElementById("cityID").value = currentContact.city;   
    document.getElementById("stateID").value = currentContact.state;
    document.getElementById("zipID").value = currentContact.zip;  
    
    document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex+1) + " of " + contactArray.length;
}

function previous() {

     if (currentContactIndex > 0) {
        currentContactIndex--;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();
    
    // Todo: Disable previous button when currentContactIndex equal to 0.
    // Todo: Save changed items to contacts array and resort array.
}

function next(){
    if (currentContactIndex < (contactArray.length-1)) {
        currentContactIndex++;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();

}

function onFormSubmit() {
    if (validate()) {
        var formData = readFormData();
        if (selectedRow == null)
            insertNewRecord(formData);
        else
            updateRecord(formData);
        resetForm();
    }
}

function readFormData() {
    var formData = {};
    formData["fullName"] = document.getElementById("fullName").value;
    formData["emailID"] = document.getElementById("emailID").value;
    formData["cityID"] = document.getElementById("cityID").value;
    formData["stateID"] = document.getElementById("stateID").value;
    return formData;
}

// Taken from W3 tutorial and modified
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }

  function autoFill() {
    var zip = document.getElementById("zipID").value
    console.log("zip:"+zip);

    console.log("function getPlace(zip) { ... }");
    var xhr = new XMLHttpRequest();

    // Register the embedded handler function
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log("result:"+result);
            var place = result.split(', ');
            if ((document.getElementById("cityID").value == "") || (document.getElementById("cityID").value == " "))
                document.getElementById("cityID").value = place[0];
            if (document.getElementById("stateID").value == "")
                document.getElementById("stateID").value = place[1];
        }
    }
    xhr.open("GET", "getCityState.php?zip=" + zip);
    xhr.send(null);
}

//  showLookup() calls viewCurrentContact
function showLookup(){

    var contactLookedUp = document.getElementById("myInput").value;
    var k = 0;
    for(var i = 0; i<contactArray.length;i++){
      
        if(contactArray[i].firstName == contactLookedUp){
            var k = 1;
            document.getElementById("fullName").value = contactArray[i].firstName
            document.getElementById("emailID").value = contactArray[i].email;   
            document.getElementById("cityID").value = contactArray[i].city;   
            document.getElementById("stateID").value = contactArray[i].state;
            document.getElementById("zipID").value = contactArray[i].zip;  
        }
    }
    if(k==0){
        console.log()
    }

}

function insertNewRecord(data) {
    var table = document.getElementById("updates").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.fullName;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.emailID;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.cityID;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.stateID;
    cell4 = newRow.insertCell(4);
    cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}

function resetForm() {
    document.getElementById("fullName").value = "";
    document.getElementById("emailID").value = "";
    document.getElementById("cityID").value = "";
    document.getElementById("stateID").value = "";
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("fullName").value = selectedRow.cells[0].innerHTML;
    document.getElementById("emailID").value = selectedRow.cells[1].innerHTML;
    document.getElementById("cityID").value = selectedRow.cells[2].innerHTML;
    document.getElementById("stateID").value = selectedRow.cells[3].innerHTML;
}
function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.fullName;
    selectedRow.cells[1].innerHTML = formData.emailID;
    selectedRow.cells[2].innerHTML = formData.cityID;
    selectedRow.cells[3].innerHTML = formData.stateID;
}

function onDelete(td) {
    if (confirm('Do you want to delete contact?')) {
        row = td.parentElement.parentElement;
        document.getElementById("updates").deleteRow(row.rowIndex);
        resetForm();
    }
}
function validate() {
    isValid = true;
    if (document.getElementById("fullName").value == "") {
        isValid = false;
        document.getElementById("fullNameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
            document.getElementById("fullNameValidationError").classList.add("hide");
    }
    return isValid;
}

function add() {
    var zip = document.getElementById("zipID").value
    console.log("zip:"+zip);

    console.log("function getPlace(zip) { ... }");
    var xhr = new XMLHttpRequest();

    // Register the embedded handler function
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log("result:"+result);
            var place = result.split(', ');
            if ((document.getElementById("cityID").value == "") || (document.getElementById("cityID").value == " "))
                document.getElementById("cityID").value = place[0];
            if (document.getElementById("stateID").value == "")
                document.getElementById("stateID").value = place[1];
        }
    }
    xhr.open("GET", "getCityState.php?zip=" + zip);
    xhr.send(null);
}

// function stores contact objects into a contactArray and logs it to the DOM
async function nextContact(URL) {
   
    const response = await fetch(URL);
    const contactRequest = await response.text();

    console.log(contactRequest);

    var contact;
    contact = JSON.parse(contactRequest);

    var i = (contact.firstName);
    
    first.push(i);
    autocomplete(document.getElementById("myInput"), first);
   
    contactArray.push(contact);

    document.getElementById("contactsID").innerHTML = JSON.stringify(contactArray,null,2);

    document.getElementById("statusID").innerHTML = "Status: Loading " + contact.firstName + " " + contact.lastName;
    loadingContact++;
    if (contactURLArray.length > loadingContact) {
        nextContact(contactURLArray[loadingContact]);
    }
    else {
        document.getElementById("statusID").innerHTML = "Status: Contacts Loaded (" + contactURLArray.length + ")";
        viewCurrentContact()
        

        //Todo: Sort contacts array.
    }
    
}

async function loadIndex() {
    
    //fetch url
    const response = await fetch("https://mustang-index.azurewebsites.net/index.json")

    //fetch text version
    const contactIndex = await response.text() 

    console.log("Index json" + contactIndex);
    document.getElementById("indexID").innerHTML = contactIndex
    

    // fetching json version 
    const responseTwo = await fetch("https://mustang-index.azurewebsites.net/index.json")
    const contactIndexTwo= await responseTwo.json() 

    for (i=0; i<contactIndexTwo.length; i++) {
        URLArray.push(contactIndexTwo[i].ContactURL);
    }
    console.log("ContactURLArray: " + JSON.stringify(URLArray));
}
    


//load contact fucntion
function loadContacts() {
    
    //setting contact array length to 0
    contactArray.length = 0;
   
    // settinng number of loaded contact to 0
    loading = 0;

    //if 
    if (URLArray.length > loading) {
        loadNextContact(URLArray[loading]);
    }
}

async function loadNextContact(URL) {
    console.log("URL: " + URL);
    const response = await fetch(URL)
    const contactResponse = await response.text()
    
    contact = JSON.parse(contactResponse)
    console.log(contactResponse)
    console.log("Contact: " + contact.firstName);

    contactArray.push(contact);

    document.getElementById("statusID").innerHTML = "Contacts Loading : " + status + "%";
    status = status + 6;
    if(status > 100){
        status = 100
    }
    console.log(status)

    document.getElementById("contactsID").innerHTML = JSON.stringify(contactArray)
    console.log(contactArray)

    loading++;

    if (URLArray.length > loading) {
        loadNextContact(URLArray[loading]);
    }

}

// log contacts to console
function logContacts() {
    console.log(contactArray);
}


function initApplication() {
    //loadIndex();
    console.log("hello, Mustang version 2 starting")
}