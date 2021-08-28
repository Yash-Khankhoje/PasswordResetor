const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")

const app = express();
dotenv.config();

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const port = process.env.PORT || 3000;
let dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";

app.use(express.json());
app.use(cors());
app.listen(port, () => console.log("Your app is running with", port));

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: process.env.email,
           pass: process.env.password
         }
    });


// send mail with defined transport object
var mailOptions = {
  from: process.env.email, // sender address
  to: '', // list of receivers
  subject: "Password Reset", // Subject line
  html: '', // html body
};



app.put("/reset-password", async (req,res)=>{
  try{
      let client = await mongodb.connect(dbUrl);
      let db = client.db("emailId_db");
      let result = await db.collection("users").findOne({ email: req.body.email });
      let salt = await bcrypt.genSalt(10);
      
      if(result){
        let randomString = {'randomString': salt};
        console.log("randome string is:" + JSON.stringify(randomString) + " and salt is: " + salt);
        await db.collection("users").findOneAndUpdate({email: req.body.email},{$set: randomString});
        mailOptions.to = req.body.email;
        let resetUrl = process.env.resetUrl;
        resetUrl = resetUrl+"?id="+result._id+"&rs="+ randomString.randomString;
        console.log(resetUrl)
        let sampleMail = '<p>Hi,</p>'
                 + '<p>Please click on the link below to reset your Password</p>'
                 + '<a target="_blank" href='+ resetUrl +' >' +  resetUrl + '</a>'
                 + '<p>Regards,</p>'

        let resetMailToBeSend = sampleMail;
        mailOptions.html = resetMailToBeSend;
         transporter.sendMail(mailOptions,(err,info)=>{
          if(err)
          {
            console.log(err)
          }
          else{
            console.log(info)
          }
        })
      res.status(200).json({
        message: "Verification mail is sent"
      });
       
      }
      else{
        res.status(400).json({
          message: "User doesn't exist"
        })
      }
      client.close();
  }
  catch(error){
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

app.get("/passwordResetLink-verification", async (req,res)=>{
  try{
    let client = await mongodb.connect(dbUrl);
    let db = client.db("emailId_db");
    let result = await db.collection("users").findOne({_id: objectId(req.body.objectId)});
    if(result.randomString === req.body.randomString){
      res.status(200).json({
        message: "Verification Successfull"
      })
    }
    else{
      res.status(401).json({
        message: "You are not authorized"
      })
    }
    client.close();
  }
  
  catch(error){
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

app.put("/change-password/:id", async(req,res)=>{
  try{
    let client = await mongodb.connect(dbUrl);
    let db = client.db("emailId_db");
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    await db.collection("users").findOneAndUpdate({_id: objectId(req.params.id)}, {$set: {"password":req.body.password}})
    
    res.status(200).json({
      message: "Password Updated Successfully"
    });
    client.close();
  }
  catch(error){
    res.status(500).json({
      message: "Error in changing the password"
    })
  }
});

app.post("/register", async (req, res) => {
  try {
    let client = await mongodb.connect(dbUrl);
    let db = client.db("emailId_db");
    let data = await db.collection("users").findOne({ email: req.body.email });
    if (data) {
      res.status(400).json({
        message: "User already exists",
      });
    } else {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
      let result = await db.collection("users").insertOne(req.body);
      res.status(200).json({
        message: "User registered successfully",
      });
    }
    client.close();
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    let client = await mongodb.connect(dbUrl);
    let db = client.db("emailId_db");
    let data = await db.collection("users").findOne({ email: req.body.email });
    if (data) {
      let isValid = await bcrypt.compare(req.body.password, data.password);
      if (isValid) {
        res.status(200).json({ message: "Login success" });
      } else {
        res.status(401).json({ message: "Password Incorrect" });
      }
    } else {
      res.status(400).json({
        message: "User is not registered",
      });
    }
    client.close();
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});



