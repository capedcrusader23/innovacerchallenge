const express=require('express');
const route=require('./route/route.js')
const app=express();
const mongoose=require('mongoose')
mongoose.connect('mongodb://uphaar:uphaar12@ds121575.mlab.com:21575/task12',{ useNewUrlParser: true },function(req,res){
  console.log("Connected");
})
app.set('view engine','ejs');
app.use(route);
app.listen(1111,function(){
    console.log("App running on port 1111");
})
