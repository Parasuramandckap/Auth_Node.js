const app =  require("express")();
const session = require('express-session');

const body_parser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const { log } = require("console");


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set("view engine","ejs");
app.use(body_parser.urlencoded({extended:false}));

const connection = mysql.createConnection({
    host:"localhost",
    user:"dckap",
    password:"Dckap2023Ecommerce",
    database:"auth_node"
});
//route
app.get("/",(req,res)=>{
    res.render("Signup",{
       
    })
})
app.get("/login",(req,res)=>{
    res.render("Login")
})

//Registration process;

app.post("/register",(req,res)=>{
    // console.log(req.body)
    const FullName = req.body.fullname;
    const Email_ID = req.body.email;
    const Password = req.body.password;
    const Conform_password = req.body.confirm_password;

    const exits = "SELECT * FROM users WHERE email_id = ? AND password = ? ";
    const query = "INSERT INTO users(full_name,email_id,password,conform_password)VALUES(?,?,?,?)";

    connection.query(exits,[Email_ID,Password],(err,data)=>{

       if(err){
            throw err;
       }
       else if(data.length > 0){

          res.send("THE USER IS ALREADY EXITS");
       }
       else{
            req.session.username = Email_ID;
            connection.query(query,[FullName,Email_ID,Password,Conform_password],(err,data)=>{
                res.redirect("/home")
            })
            
       }

    });




})
app.get("/login",(req,res)=>{
    res.render("Login")
  
})
app.get("/home",(req,res)=>{

    res.render("Home",{
        userName : req.session.username
    })
})
app.get("/logout",(req,res)=>{
    req.session.destroy((err) => {
        res.redirect('/login') 
    })
})
app.listen(3000,()=>{
    console.log("server running");
})


app.post("/login",(req,res)=>{

   
    const emailId = req.body.email;
    const password = req.body.password;
    const login = "SELECT * FROM users WHERE email_id = ? AND password = ? ";

    connection.query(login,[emailId,password],(err,data)=>{
        if(err){
            throw err;
        }
        else if(data.length > 0){
            req.session.username = emailId;
            res.redirect("/home");
        }
        else {
            res.send('Incorrect Username and/or Password!');
        }	
    })
})