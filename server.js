import express from "express";
import ejs from "ejs";
import { MongoClient } from "mongodb";
import config from "./config.js"

const app = express();
const port = 3000;

const connectionString = config.mongoUri;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

MongoClient.connect(connectionString)
.then((client) => {
    console.log("Connected to database");
    const db = client.db("to-do-list");
    const myTasks = db.collection("tasks");

    app.get("/", (req, res) => {
        myTasks.find().toArray()
        .then(data => {
            const uncompletedTasks = data.filter(task => !task.complete).length;
            res.render("index.ejs", {tasks: data, uncompletedTasks});
        })
        .catch(error => {
            console.log(error);
            res.status(500).send("Error fetching tasks");
        })  
    });

    app.post("/new-task", (req, res) => {
        const newTask = {
            name: req.body.todoItem,
            complete: false
        }
        console.log(newTask);
        myTasks.insertOne(newTask)
            .then(result => {
                res.redirect("/");
            })
            .catch(error => {
                console.log(error);
            })
    });

    app.put("/markComplete", async (req, res) => {
        try {
            const filter = {
                name: req.body.itemFromJS
            };
            const updateResult = await myTasks.updateOne(
                filter,
                { $set: { complete: true}}
            );
            if (!updateResult) {
                console.error("update fail, no document returned");
                return res.status(404).json({error: "task not found"});
            }
            res.json(updateResult);
        } catch (error) {
            console.error("Error during update operation: ", error);
            res.status(500).json({ error: "An error occured during the update"});
        }
    });

    app.put("/markUnComplete", async (req, res) => {
        try {
            const filter = {
                name: req.body.itemFromJS
            };
            const updateResult = await myTasks.updateOne(
                filter,
                { $set: { complete: false}}
            );
            if (!updateResult) {
                console.error("update fail, no document returned");
                return res.status(404).json({error: "task not found"});
            }
            res.json(updateResult);
        } catch (error) {
            console.error("Error during update operation: ", error);
            res.status(500).json({ error: "An error occured during the update"});
        }
    });

    app.delete("/delete", (req, res) => {
        try {
            console.log(req.body);
            const name = req.body.itemFromJS;

            if(!name){
                console.error("Missing name in the request body");
                return res.status(400).json( {error: "Name is missing"});
            }

            const result = myTasks.deleteOne({ name: name.trim() });

            if(result.deleteCount === 0){
                console.error(`No task found for name: ${name}`);
                return res.status(404).json({error: "task not found"});
            }

            console.log(`Deleted task: ${name}`);
            res.json({ message: `deleted ${name}`});
        } catch (error) {
            console.error("Error while deleting task: ", error);
            res.status(500).json( {error: "An error occured while deleting task"});
        }
    });
})


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});


