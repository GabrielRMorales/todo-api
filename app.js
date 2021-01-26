var express = require("express");
var app = express();
const port = 3000;
const { Pool } = require("pg");

const pool = new Pool({
    user: "gabriel",
    host: "localhost",
    database: "todos",
    password: null,
    port: 5432
});
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



app.listen(port, ()=>{
    console.log(`App is now running on port ${port}`);
})