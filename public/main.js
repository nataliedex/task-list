document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");

        if(!name){
            console.error("Missing name in the data attributes");
            alert("could not find the task name");
            return;
        }

        fetch("/new-task", {
            method: "DELETE", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name})
        })
        .then((res) => {
            if(!res.ok){
                return res.text().then((text) => {
                    console.error(("error response:", res.status, res.statusText));
                    throw new Error(`Server Error: ${res.status} ${res.statusText}`);
                });
            }
            return res.json()
        })
        .then((data) => {
            console.log("Delete success", data);
            button.closest(".task-container").remove();
        })
        .catch(error => {
            console.error("Delete error:", error);
            alert("An error occured while trying to delete task");
        });
    });
});

document.querySelectorAll(".task-checkbox").forEach((box) => {
    box.addEventListener("change", async () => {
        const name = box.dataset.name;
        
        try {
            const response = await fetch("/new-task", {
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

            const completeElement = box.closet(".task-container").querySelector(".task-checkbox");
                if(completeElement){
                    completeElement.classList.add("completed");
                }
        } catch (error) {
            console.error("update error:", error);
        }
    });
});


