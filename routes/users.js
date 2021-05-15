var express = require('express');
var router = express.Router();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

const {dbUrl} = require("../config");
const { hashing, hashCompare, createJWT } = require('../library/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", async(req,res)=>{
  const client = await mongoClient.connect(dbUrl)
 try {
  const db = client.db("b19we");
  const hash = await hashing(req.body.password)
  req.body.password = hash;
  const user = await db.collection("users").insertOne(req.body)
  res.json({
      message:"Registration successful"
  })
  } catch (error) {
      res.json({
          message:"Something Went Wrong"
      })
  }finally{
      client.close();
  }

})

router.post("/login", async(req,res)=>{
  const {email,password}=req.body;
  const client = await mongoClient.connect(dbUrl)
  try {
    const db= client.db("b19we");
    const user = await db.collection("users").findOne({email})
    if(!user){
      res.json({
        message:"no user available"
      })
    }else{
      const compare = await hashCompare(password,user.password);
      if(compare){
        const token = await createJWT({email,id:user._id,role:user.role});
        res.json({token})
      }else{
        res.json({
          message:"Wrong password"
        })
      }
    }
  } catch (error) {
    console.log(error)
  }finally{
    client.close();
  }
})

router.get("/get-users", async(req,res)=>{
  const client = await mongoClient.connect(dbUrl)
 try {
  const db = client.db("b19we");
  const users = await db.collection("users").find().toArray();
  res.json(users)
  } catch (error) {
      console.log(error)
      res.json({
          message:"Something Went Wrong"
      })
  }finally{
      client.close();
  }
})

router.post("/products",async(req,res)=>{
    res.json({
      message:"products"
    })
})


module.exports = router;
