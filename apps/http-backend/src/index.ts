import express from "express"

const app  = express();

app.post("/signup",(req,res) => {

}) 

app.post("/signin",(req,res) => {

})

app.post("/room",(req,res) => {

})

app.listen(4000, () => {
    console.log("HTTP server listening on http://localhost:4000");
});