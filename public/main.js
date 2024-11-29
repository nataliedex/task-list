const deleteButton = document.querySelectorAll(".delete-button");
const item = document.querySelectorAll(".task-item span");
const itemCompleted = document.querySelectorAll(".task-item span.complete");

Array.from(deleteButton).forEach((element) => {
    element.addEventListener("click", deleteItem);
});

Array.from(item).forEach((element) => {
    element.addEventListener("click", markComplete);
});

Array.from(itemCompleted).forEach((element) => {
    element.addEventListener("click", markUnComplete);
});

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText;
    try{
        const response = await fetch("/delete", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          });
        const data = await response.json();
        console.log(data);
        location.reload();

    }catch(err){
        console.log(err);
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText;
    try{
        const response = await fetch("/markComplete", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          });
        const data = await response.json();
        console.log(data);
        location.reload();

    }catch(err){
        console.log(err);
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText;
    try{
        const response = await fetch("/markUnComplete", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          });
        const data = await response.json();
        console.log(data);
        location.reload();

    }catch(err){
        console.log(err);
    }
}


// document.querySelectorAll(".delete-button").forEach((button) => {
//     button.addEventListener("click", () => {
//         const name = button.getAttribute("data-name");

//         if(!name){
//             console.error("Missing name in the data attributes");
//             alert("could not find the task name");
//             return;
//         }

//         fetch("/delete", {
//             method: "DELETE", 
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({name})
//         })
//         .then((res) => {
//             if(!res.ok){
//                 return res.text().then((text) => {
//                     console.error(("error response:", res.status, res.statusText));
//                     throw new Error(`Server Error: ${res.status} ${res.statusText}`);
//                 });
//             }
//             return res.json()
//         })
//         .then((data) => {
//             console.log("Delete success", data);
//             button.closest(".task-container").remove();
//         })
//         .catch(error => {
//             console.error("Delete error:", error);
//             alert("An error occured while trying to delete task");
//         });
//     });
// });

document.querySelectorAll(".task-item").forEach((task) => {
    task.addEventListener("change", async () => {
        const name = task.dataset.name;
        
        try {
            const response = await fetch("/markComplete", {
                method: "PUT",
                header: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, complete }),
            });

            if(!response.ok) {
                const errorDetails = await response.text();
                console.error(`Error ${response.status}: ${response.statusText}`, errorDetails );
                throw new Error(`Failed to update: ${response.status}`);
            }
            const data = await response.json();

            const completeElement = box.closet(".task-container").querySelector(".task-item");
                if(completeElement){
                    completeElement.classList.add("completed");
                }
        } catch (error) {
            console.error("update error:", error);
        }
    });
});


