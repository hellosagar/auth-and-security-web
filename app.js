require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()

app.use(express.static("public"))
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const userSchema = new mongoose.Schema({
    email : String,
    password: String
})


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const UserModel = new mongoose.model("User",userSchema)

app.get("/",function (req,res) {
    res.render("Home")
})

app.get("/register",function (req,res) {
    res.render("Register")
})


app.get("/login",function (req,res) {
    res.render("Login")
})

app.post("/register",function (req,res) {

    const newUser = new UserModel({
        email: req.body.username,
        password: req.body.password,
    })

    newUser.save(function (err) {
        if (!err) {
            res.render("secrets")
        }else{
            res.render(err)
        }
    })
})

app.post("/login",function (req,res) {

    const newUser = new UserModel({
        email: req.body.username,
        password: req.body.password,
    })

    UserModel.findOne({
        email: req.body.username},function (err,foundUser) {
            if (!err && foundUser && foundUser.password === req.body.password) {
                res.render("secrets")
            }else{
                console.log(err);
            }
    })
})



app.listen(6969,function () {
    console.log("Server Started on port 6969.");
})