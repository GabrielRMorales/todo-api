var express = require("express");
var app = express();
const port = 3000;
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const { response, static } = require("express");

//postgresql db connection
const pool = new Pool({
    user: "gabriel",
    host: "localhost",
    database: "todos",
    password: null,
    port: 5432
});
app.use(express.static(__dirname+"/public"));
app.use("/scripts", express.static(__dirname+"/node_modules/jquery/dist/"));
//These middlewares are necessary to retrieve req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))
//"root" page
app.get("/",(req,res)=>{
    res.sendFile("index.html");
})

//index
app.get("/api/todos/",(req,res)=>{
    console.log("getting todo list");
    pool.query("SELECT * FROM todo_list ORDER BY id ASC",(err, results)=>{
        if (err){
            throw err;
        }
        console.log("SENDING RESULTS...");
        res.send(results.rows);
    });
});

//create
app.post("/api/todos/:todo", (req, res)=>{
    const  name  = req.params.todo;
    console.log("Got name")
    pool.query(`INSERT INTO todo_list(name) VALUES ($1)`,[name], (err, results)=>{
        if (err){
            throw err;
        }
        console.log("INSERTED");
        res.status(201).send(`Todo added with name ${name}`);
    });

})

//update
app.put("/api/todos/:id",(req,res)=>{
    const id = req.params.id;
    
    pool.query(`UPDATE todo_list SET completed = NOT completed WHERE id = $1 RETURNING completed`,[id],(err,newStatus)=>{
        if (err){
            throw err
        }
        console.log(newStatus.rows[0].completed);
        res.status(200).send(`Todo completed status has been updated to ${newStatus.rows[0].completed}`);
    });

});

//delete
app.delete("/api/todos/:id",(req, res)=>{
    const id = req.params.id;
    pool.query(`DELETE FROM todo_List WHERE id=$1`,[id],(err, results)=>{
        if (err){
            throw err;
        }
        res.status(200).send(`Deleted item of id ${id}`);
    });
});

app.listen(port, ()=>{
    console.log(`App is now running on port ${port}`);
})