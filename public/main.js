document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        const date = button.getAttribute("data-date");

        if(!name || !date){
            console.error("Missing name or date in the data attributes");
            alert("could not find the task name or date");
            return;
        }

        fetch("/new-taks", {
            method: "DELETE", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name, date})
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

