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
            .then(results => {
                res.render("index.ejs", {tasks: results});
            })
            .catch(error => {
                console.log(error);
                res.status(500).send("Error fetching tasks");
            })
        
    });

    app.post("/new-task", (req, res) => {
        const date = new Intl.DateTimeFormat('en-US').format(new Date());

        const newTask = {
            name: req.body.name,
            date: date
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

    app.delete("/new-taks", (req, res) => {
        try {
            const { name, date } = req.body;

            if(!name || !date){
                console.error("Missing name or date in the request body");
                return res.status(400).json( {error: "Name and date are missing"});
            }

            const result = myTasks.deleteOne({ name: name.trim(), date: date});

            if(result.deleteCount === 0){
                console.error(`No task found for name: ${name}, ${date}`);
                return res.status(404).json({error: "task not found"});
            }

            console.log(`Deleted task: ${name}, ${date}`);
            res.json({ message: `deleted ${name}, ${date}`});
        } catch (error) {
            console.error("Error while deleting task: ", error);
            res.status(500).json( {error: "An error occured while deleting task"});
        }
    });
})


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});


