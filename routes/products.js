var express = require('express');
var router = express.Router();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

const {dbUrl} = require("../config");
const { authorize, rolePermit } = require('../library/auth');

router.get("/all-products",[authorize,rolePermit(1,3,4,5)],async(req,res)=>{
    res.json({
      message:"products"
    })
})

router.post("/product",[authorize,rolePermit(1)],async(req,res)=>{
    res.json({
      message:"products"
    })
})

module.exports = router;