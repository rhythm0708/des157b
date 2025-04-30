Parse.initialize("oHdrHj4Rq8ydaKvATnJvUAnzVLsawqaYYX3xQIEy","NTD9gCxpr0zhMHEDDpLH1YVCWJeWb2NIKrNI3rLe"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = 'https://parseapi.back4app.com/';

// JS here.
const newBtn = document.querySelector("#newbtn");
const editBtns = document.querySelectorAll(".fa-edit");
const addFriendForm = document.querySelector("#add-friend");
const editFriendForm = document.querySelector("#edit-friend");
const friendList = document.querySelector("main ol");
const inputs = document.querySelectorAll("#add-friend input:not([type=submit])");

let thisRecord;

newBtn.addEventListener("click", function(event){
    event.preventDefault();
    addFriendForm.className = "add-friend-onscreen";
})

addFriendForm.addEventListener("submit", function(event){
    event.preventDefault();
    // addFriendForm.className = "add-friend-offscreen";
    addFriend();
})

for(let i=0; i<editBtns.length; i++){
    // editBtns[i].addEventListener("click", function(event){
    //     event.preventDefault();
    //     editFriendForm.className = "edit-friend-onscreen";
    // })
}

editFriendForm.addEventListener("submit", function(event){
    event.preventDefault();
    // editFriendForm.className = "edit-friend-offscreen";
    updateRecord(thisRecord);
});

// Event delegation.
document.addEventListener("click", function(event){
    if(event.target.matches(".fa-edit")) {
        editFriendForm.className = "edit-friend-onscreen";
        thisRecord = event.target.getAttribute("id").slice(2);
        setForm(thisRecord);
    } else if(event.target.matches(".fa-times-circle")) {
        thisRecord = event.target.getAttribute("id").slice(2);
        deleteRecord(thisRecord);
    }
}, false);

async function displayFriends() {
    const friends = Parse.Object.extend('Friends');
    const query = new Parse.Query(friends);
    const results = await query.ascending('lname').find();
    // console.log(results);

    results.forEach(function(eachFriend){
        const id = eachFriend.id;
        const lname = eachFriend.get("lname");
        const fname = eachFriend.get("fname");
        const email = eachFriend.get("email");
        const facebook = eachFriend.get("facebook");
        const twitter = eachFriend.get("twitter");
        const instagram = eachFriend.get("instagram");
        const linkedin = eachFriend.get("linkedin");

        const theListItem = document.createElement("li");
        theListItem.setAttribute("id", `r-${id}`);
        theListItem.innerHTML = `<div class="name">
                    ${fname} ${lname}
                </div>
                <div class="email">
                    <i class="fas fa-envelope-square"></i> ${email}
                </div>
                <div class="social">
                    <a href="${facebook}"><i class="fab fa-facebook-square"></i></a>
                    <a href="${twitter}"><i class="fab fa-twitter-square"></i></a>
                    <a href="${instagram}"><i class="fab fa-instagram"></i></a>
                    <a href="${linkedin}"><i class="fab fa-linkedin"></i></a>
                </div>
                <i class="fas fa-edit" id="e-${id}"></i>
                <i class="fas fa-times-circle" id="d-${id}"></i>`;
        friendList.append(theListItem);

    });
}

async function addFriend() {
    const newFriend = {};

    for(let i=0; i<inputs.length; i++){
        let key = inputs[i].getAttribute('name');
        let value = inputs[i].value;
        newFriend[key] = value;
    }

    if(newFriend.fname != "" && newFriend.lname != "" && newFriend.email != ""){
        const newFriendData = new Parse.Object('Friends');
        newFriendData.set('fname', newFriend.fname);
        newFriendData.set('lname', newFriend.lname);
        newFriendData.set('email', newFriend.email);
        newFriendData.set('facebook', newFriend.facebook);
        newFriendData.set('twitter', newFriend.twitter);
        newFriendData.set('instagram', newFriend.instagram);
        newFriendData.set('linkedin', newFriend.linkedin);

        try{
            const result = await newFriendData.save();
            console.log("Friends created", result);
            resetFormFields();
            addFriendForm.className = "add-friend-offscreen";
            friendList.innerHTML = "";
            displayFriends();
        } catch(error){
            console.error("Error while creating friend: ", error);
        }
    } else {
        addFriendForm.className = "add-friend-offscreen";
    }
}

function resetFormFields(){
    document.querySelector("#fname").value = "";
    document.querySelector("#lname").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#fbook").value = "https://facebook.com";
    document.querySelector("#twitter").value = "https://twitter.com";
    document.querySelector("#insta").value = "https://instagram.com";
    document.querySelector("#linkedin").value = "https://linkedin.com";
}

async function setForm(recordId){
    const friends = Parse.Object.extend("Friends");
    const query = new Parse.Query(friends);
    query.equalTo("objectId", recordId);
    try {
        const results = await query.find();
        results.forEach(function(thisFriend){
            document.querySelector("#fname-edit").value = thisFriend.get("fname");
            document.querySelector("#lname-edit").value = thisFriend.get("lname");
            document.querySelector("#email-edit").value = thisFriend.get("email");
            document.querySelector("#fbook-edit").value = thisFriend.get("facebook");
            document.querySelector("#twitter-edit").value = thisFriend.get("twitter");
            document.querySelector("#insta-edit").value = thisFriend.get("instagram");
            document.querySelector("#linkedin-edit").value = thisFriend.get("linkedin");
        });
        editFriendForm.className = "edit-friend-onscreen";
    } catch(error) {
        console.error("Error while fetching friends", error);
    }  
}

async function updateRecord(recordId){
    const theFields = document.querySelectorAll("#edit-friend input:not([type=submit])");
    const editedRecord = {};
    let key; 
    let value;
    for(let i=0; i<theFields.length; i++){
        key = theFields[i].getAttribute("name");
        value = theFields[i].value;
        editedRecord[key] = value;
    }

    const friends = Parse.Object.extend("Friends");
    const query = new Parse.Query(friends);
    try {
        const object = await query.get(recordId);
        object.set("fname", editedRecord.fname);
        object.set("lname", editedRecord.lname);
        object.set("email", editedRecord.email);
        object.set("facebook", editedRecord.facebook);
        object.set("twitter", editedRecord.twitter);
        object.set("instagram", editedRecord.instagram);
        object.set("linkedin", editedRecord.linkedin);
        try {
            await object.save();
            editFriendForm.className = "edit-friend-offscreen";
            friendList.innerHTML = "";
            displayFriends();
        } catch(error) {
            console.error("Error while updating friends", error);
        }
    } catch(error) {
        console.error("Error while retrieving object friends", error);
    }
}

async function deleteRecord(recordId){
    const youAreSure = confirm("Are you sure you want to delete this record?");
    if(youAreSure){
        const query = new Parse.Query("Friends");
        try {
            const object = await query.get(recordId);
            try {
                await object.destroy();
                document.querySelector(`#r-${recordId}`).className = "remove";
                setTimeout(function(){
                    const elem = document.querySelector(`#r-${recordId}`);
                    elem.parentNode.removeChild(elem);
                }, 1500);
            } catch(error) {
                console.error("Error while deleting ParseObject", error);
            }
        } catch(error) {
            console.error("Error while retrieving ParseObject", error);
        }
    }
}

displayFriends();