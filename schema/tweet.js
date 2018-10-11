var mongoose=require('mongoose');
var schema=mongoose.Schema;
var tweet=new schema({
  id:{
    type:String
  },
  user:{
    name:{
      type:String
    },
    follower:{
      type:Number
    },
    url:{
      type:String
    },
    fav_count:{
      type:Number
    }
  },
  retweet:
  {
    type:Number
  },
  favourite:{
    type:Number
  },
  created:{
    type:Date
  },
  lang:{
    type:String
  },
  content:{
    type:String
  }
});

var twee=mongoose.model('tweet',tweet)
module.exports=twee;
