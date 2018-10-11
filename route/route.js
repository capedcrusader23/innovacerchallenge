const express=require('express');
const route=express.Router();
const twit=require('twit');
const body=require('body-parser');
const url=body.urlencoded({extended:true});
var tweett=require('../schema/tweet.js');
var csv_export=require('csv-export');
var fs=require('fs');

var moment=require('moment');
const T=new twit({
    consumer_key:'jZ2U7WTMEaNfrsAXjM5K066U5',
    consumer_secret:'grUurtgv6hE92HWiCIcbhuS8CxWqi85tLPHOg3p7geyjQ9ZucE',
    access_token:'986219713012424705-rJ8YeVYMOFRLXrvnx7Km63Kh8ymbMmr',
    access_token_secret:'fg0YmyMEL3FCPDKUfDn1Cs02zwnzO4ZEUGeTFvzRj7GtH'
});

route.get('/',function(req,res){
    res.send("Task for innovaccer");

})
route.get("/api1",function(req,res)
{
    res.render("fetch");
    console.log(tweett);
})
route.post('/posttweet',url,function(req,res){
    var t=req.body.word;
    var stream = T.stream('statuses/filter', { track: req.body.word })
stream.on('tweet', function (tweet){
var twe=new tweett();


twe.id=tweet.id
twe.user.name=tweet.user.screen_name
twe.user.follower=tweet.user.followers_count
twe.user.url=tweet.user.url
twe.user.fav_count=tweet.user.favourites_count
twe.retweet=tweet.retweet_count
twe.favourite=tweet.favourite_count
twe.created=new Date(tweet.created_at);
twe.lang=tweet.lang
twe.content=tweet.text
twe.save();
console.log(twe);

})
});

route.get('/api2',url,function(req,res){
  tweett.find({}).then(function(data){
    console.log(data);
    res.render('tweet',{tweets:data})

  })
})

route.post('/searchname',url,function(req,res){
  if(req.body.name=='')
{
  res.redirect('/api2');
}
else {

  tweett.find({'user.name':req.body.name}).then(function(d){
    res.render('tweet',{tweets:d});
  })
}

});
//Post.find({}).sort({test: 1}).exec(function(err, docs) { ... });

route.get('/sortbydate',url,function(req,res){

tweett.find({}).sort({created:-1}).exec(function(err,docs){
  console.log(docs);
  res.render('tweet',{tweets:docs});
})

});
route.post('/checkthis',url,function(req,res){

if(req.body.attribute=='retweet')
{
  if(req.body.operation=='equal')
  {
  tweett.find({retweet:req.body.amt}).then(function(data){
    res.render('tweet',{tweets:data});
  })
  }
  else if(req.body.operation=='less')
  {
    console.log('less');

    tweett.find({retweet:{$lt:req.body.amt}}).then(function(data){
      res.render('tweet',{tweets:data});
    })

  }
  else if(operation=='greater')
  {
    tweett.find({retweet:{$gt:req.body.amt}}).then(function(data){
      res.render('tweet',{tweets:data});
    })
  }



}
else if(req.body.attribute=='followers')
{
if(req.body.operation=='equal')
{
tweett.find({'user.follower':req.body.amt}).then(function(data){
  res.render('tweet',{tweets:data});
})
}
else if(req.body.operation=='less')
{
  console.log('less');

  tweett.find({'user.follower':{$lt:req.body.amt}}).then(function(data){
    res.render('tweet',{tweets:data});
  })

}
else if(operation=='greater')
{
  tweett.find({'user.follower':{$gt:req.body.amt}}).then(function(data){
    res.render('tweet',{tweets:data});
  })
}

}
else if(req.body.attribute=='favourite')
{
  if(req.body.operation=='equal')
  {
  tweett.find({'user.fav_count':req.body.amt}).then(function(data){
    res.render('tweet',{tweets:data});
  })
  }
  else if(req.body.operation=='less')
  {
    console.log('less');

    tweett.find({'user.fav_count':{$lt:req.body.amt}}).then(function(data){
      res.render('tweet',{tweets:data});
    })

  }
  else if(operation=='greater')
  {
    tweett.find({'user.fav_count':{$gt:req.body.amt}}).then(function(data){
      res.render('tweet',{tweets:data});
    })
  }



}

});



route.get('/sortbytweet',url,function(req,res){

tweett.find({}).sort({content:1}).exec(function(err,docs){
  console.log(docs);
  res.render('tweet',{tweets:docs});
})

});

route.post("/download",url,function(req,res){
  var ch=[0,0,0,0,0,0,0];
  var ch2=['user.name','user.follower','retweet','created','lang','user.fav_count','content']
  if(req.body.Name=='on')
  {
    ch[0]=1;
  }
  if(req.body.followers=='on')
  {
      ch[1]=1;
  }
  if(req.body.retweet=='on')
    {
      ch[2]=1;
    }
    if(req.body.created=='on')
      {
        ch[3]=1;
      }
      if(req.body.Language=='on')
        {
          ch[4]=1;
        }
        if(req.body.favourite=='on')
          {
            ch[5]=1;
          }
          if(req.body.content=='on')
            {
              ch[6]=1;
            }

            var options = {

                prependHeader    : true,
                sortHeader       : false,
                trimHeaderValues : true,
                trimFieldValues  :  true,
                keys             : []
            };
            var fields=[];
            for(var i=0;i<7;i++)
            {
              if(ch[i]==1)
              {
              options.keys.push(ch2[i]);
              }
            }
            console.log(options.keys)





  tweett.find({},{_id:0}).then(function(dat){
var json2csv=require('json-2-csv');
      var json2csvCallback = function (err, csv)
      {
        if(err)
        {
          throw err;
        }
        else {
          fs.writeFile('data.csv',csv,function(){
            console.log("downloaded");
            res.redirect('/api2');
          })
        }
        };
json2csv.json2csv(dat,json2csvCallback,options);


  })

})

route.post('/datefilter',url,function(req,res){
var x=new Date(req.body.to);
var y=new Date(req.body.from);
tweett.find({created:{$gte:y},created:{$lte:x}}).then(function(data){
res.render('tweet',{tweets:data});cmd
})
})
module.exports=route;
