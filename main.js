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

    // Todo: Add additional fields.
    document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex+1) + " of " + contactArray.length;
}

function previous() {

     if (currentContactIndex > 0) {
        currentContactIndex--;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();

    //if(currentContactIndex==0){disableBtn()}

    //function disableBtn() {
        //document.getElementById("pre").disabled = true;
     // }
      
    
    // Todo: Disable previous button when currentContactIndex equal to 0.
    // Todo: Save changed items to contacts array and resort array.
}

function next() {
    if (currentContactIndex < (contactArray.length-1)) {
        currentContactIndex++;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();
    console.log(currentContactIndex)
    
    // Todo: Disable next button when there is no next item.
    // Todo: Save changed items to contacts array and resort array.
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
    if (confirm('Are you sure to delete this record ?')) {
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

function add(){
    console.log('add()');
    var newContact = {

        preferredName: document.getElementById("fullName").value,
        email: document.getElementById("emailID").value ,
        city: document.getElementById("cityID").value,
        state: document.getElementById("stateID").value ,
        zip: document.getElementById("zipID").value ,
        
    }
    contactArray.push(newContact);
    currentContactIndex = currentContactIndex + 1;
    viewCurrentContact();
}

function remove(){
    if(contactArray,length >1){
        console.log('remove()');
        contactArray.splice(currentContactIndex,1)
        if(currentContactIndex>=1){
            currentContactIndex=currentContactIndex-1;
        }
        console.log(contactArray)
        viewCurrentContact();
    }else{
        console.log("Ennter one contact please")
    }
}


function zipFocusFunction() {
    console.log('focusFunction()');

    // Todo: Remove the function as it is not needed.
}

function zipBlurFunction() {
    getPlace();
}

function keyPressed() {
    console.log('keyPressed()');

    // This type of function should be useful in search as it implements keyPressed.
}

async function loadIndex() {
    
    //fetch url
    const response = await fetch("https://hostingjson.azurewebsites.net/index.json")

    //fetch text version
    const contactIndex = await response.text() 

    console.log("Index json" + contactIndex);
    document.getElementById("indexID").innerHTML = contactIndex
    

    // fetching json version 
    const responseTwo = await fetch("https://hostingjson.azurewebsites.net/index.json")
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