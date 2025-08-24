// document.addEventListener('DOMContentLoaded', function () {
//     getStoredItem();
//     renderCities();
// });
// // var cities = [];
// var cities = JSON.parse(localStorage.getItem('cities')) || [];
// var cityBox = document.getElementById("cities-list");
// var userInput = document.getElementById("city-input");
// var addBtn = document.getElementById("btn-1");
// var editIndex = -1;

// var statusMessage = document.querySelector('.status-message');
// var statusText = document.querySelector('.status-text');

// userInput.addEventListener("keydown", function (e) {
//     if (e.key === "Enter") {
//         addCity();
//     }
// });
// function saveToLocalStorage() {
//     localStorage.setItem("cities", JSON.stringify(cities));
// }
// function getStoredItem() {
//     var storedCity = localStorage.getItem("cities");
//     if (storedCity) {
//         cities = JSON.parse(storedCity)
//     }
// }
// function showStatusMessage(message) {
//     statusText.textContent = message;

//     statusMessage.classList.add('show-message');

//     setTimeout(function () {
//         statusMessage.classList.remove('show-message');
//     }, 2500);
// }

// function renderCities() {
//     cityBox.innerHTML = "";

//     if (cities.length === 0) {
//         emptyMsg.style.display = "block";
//         cityBox.appendChild(emptyMsg);
//         return;
//     }

//     emptyMsg.style.display = "none";

//     for (var i = 0; i < cities.length; i++) {
//         (function (index) {
//             var list = document.createElement("li");
//             list.classList.add("fade-in");

//             var nameSpan = document.createElement("span");
//             nameSpan.textContent = cities[index];

//             var btnGroup = document.createElement("div");

//             var deleteBtn = document.createElement("button");
//             deleteBtn.textContent = "X";
//             deleteBtn.onclick = function () {
//                 var deletedCity = cities[index];
//                 list.classList.add("fade-out");
//                 setTimeout(function () {
//                     cities.splice(index, 1);
//                     saveToLocalStorage();
//                     renderCities();
//                     showStatusMessage(deletedCity + " deleted successfully");
//                 }, 300);
//             };

//             var editBtn = document.createElement("button");
//             editBtn.textContent = "Edit";
//             editBtn.classList.add("edit");
//             editBtn.onclick = function () {
//                 userInput.value = cities[index];
//                 editIndex = index;
//                 addBtn.textContent = "Update City";
//                 showStatusMessage("Editing " + cities[index]);
//             };

//             btnGroup.appendChild(editBtn);
//             btnGroup.appendChild(deleteBtn);
//             list.appendChild(nameSpan);
//             list.appendChild(btnGroup);
//             cityBox.appendChild(list);
//         })(i);
//     }
// }

// function addCity() {
//     var userValue = userInput.value.trim();

//     if (userValue === "") {
//         showStatusMessage("Please enter a city name");
//         return;
//     }

//     if (editIndex >= 0) {
//         var oldCity = cities[editIndex];
//         cities[editIndex] = userValue;
//         editIndex = -1;
//         addBtn.textContent = "Add City";
//         renderCities();
//         saveToLocalStorage();
//         showStatusMessage("Updated from " + oldCity + " to " + userValue);
//     } else {
//         if (cities.indexOf(userValue) >= 0) {
//             showStatusMessage("City already exists");
//             return;
//         }
//         cities.push(userValue);
//         renderCities();

//         saveToLocalStorage();
//         showStatusMessage(userValue + " added successfully");
//     }

//     userInput.value = "";
// }

import { db } from "./config.js";
import { collection, addDoc, onSnapshot, query, deleteDoc, doc, updateDoc } from "./db.js";
document.addEventListener("DOMContentLoaded", function () {

    const cityBox = document.getElementById("cities-list");
    const addBtn = document.getElementById("btn-1");
    const updateBtn = document.getElementById("btn-2");
    let userInput = document.getElementById("city-input");
    const emptyMsg = document.getElementById("empty-msg");

    let currentTaskId = null;
    addBtn.addEventListener("click", () => {
        addDetailsToDB(userInput.value.trim())
    })

    async function addDetailsToDB(userTaskValue) {
        if (userTaskValue === "") {
            alert('plz enter value')
            return;
        }
        else {
            try {
                const docRef = await addDoc(collection(db, "ToDoTask"), {
                    userTask: userTaskValue,

                });


                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        userInput.value = "";

    }
    updateBtn.addEventListener("click", async () => {
        const docRef = doc(db, "ToDoTask", currentTaskId);

        await updateDoc(docRef, {
            userTask: userInput.value
        });
        addBtn.style.display = "block";
        updateBtn.style.display = "none";
        userInput.value = "";
        currentTaskId = null;
    });

    function renderTask() {

        const q = query(collection(db, "ToDoTask"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            cityBox.innerHTML = ""
            if (querySnapshot.empty) {
                emptyMsg.style.display = "block";
                cityBox.appendChild(emptyMsg);
                return;
            }
            else {
                emptyMsg.style.display = "none";
               
            }
            querySnapshot.forEach((docSnap) => {
                let task = docSnap.data();
                let taskID = docSnap.id
                const list = document.createElement("li");
                list.classList.add("fade-in");
                list.innerHTML += `<span>${task.userTask}</span>`
                const btnGroup = document.createElement("div");
                const deleteBtn = document.createElement("button");

                deleteBtn.textContent = "Delete";
                deleteBtn.addEventListener("click", async () => {
                    await deleteDoc(doc(db, "ToDoTask", taskID));
                });

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.classList.add("edit");
                editBtn.addEventListener("click", () => {
                    userInput.value = task.userTask;
                    currentTaskId = taskID;
                    addBtn.style.display = "none";
                    updateBtn.style.display = "block";

                })
                list.appendChild(btnGroup);
                btnGroup.appendChild(deleteBtn);
                btnGroup.appendChild(editBtn);
                cityBox.appendChild(list);
            });

        });

    }
    renderTask()

});
