var express = require("express");
var app = express();
const port = 3000;
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const { response } = require("express");

const pool = new Pool({
    user: "gabriel",
    host: "localhost",
    database: "todos",
    password: null,
    port: 5432
});
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

//index
app.get("/",(req,res)=>{
    console.log("getting todo list");
    pool.query("SELECT * FROM todo_list",(err, results)=>{
        if (err){
            throw err;
        }
        console.log("SENDING RESULTS...");
        res.json(results.rows);
    });
});

//create
app.post("/", (req, res)=>{
    const { name } = req.body;
    console.log("Got name")
    pool.query(`INSERT INTO todo_list(name)VALUES($1)`,[name], (err, results)=>{
        if (err){
            throw err;
        }
        console.log("INSERTED");
        res.status(201).send(`Todo added with name ${name}`);
    });

})

//update
app.put("/:id",(req,res)=>{
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
app.delete("/:id",(req, res)=>{
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