import { db } from "./config.js";
import { collection, addDoc, onSnapshot, query, deleteDoc, doc, updateDoc } from "./db.js";
document.addEventListener("DOMContentLoaded", function () {

    const listbox = document.getElementById("list");
    const addBtn = document.getElementById("btn-1");
    const updateBtn = document.getElementById("btn-2");
    let userInput = document.getElementById("task-input");
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
            listbox.innerHTML = ""
            if (querySnapshot.empty) {
                emptyMsg.style.display = "block";
                listbox.appendChild(emptyMsg);
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
                listbox.appendChild(list);
            });

        });

    }
    renderTask()

});
