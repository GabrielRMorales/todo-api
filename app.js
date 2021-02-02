var express = require("express");
var app = express();
const port = 3000;
//get Pool 
const  Pool  = require("pg").Pool;
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
    
    pool.query("SELECT * FROM todo_list ORDER BY id ASC",(err, results)=>{
        if (err){
            throw err;
        }
        res.send(results.rows);
    });
});

app.post("/api/todos/", (req, res)=>{
    const  {name}  = req.body;
    pool.query(`INSERT INTO todo_list(name) VALUES ($1) RETURNING *`,[name], (err, results)=>{
        if (err){
            throw err;
        }
        res.status(201).send(results);
    });

});

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