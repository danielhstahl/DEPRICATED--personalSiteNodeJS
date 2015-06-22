var express=require('express');
var app=express();

var server  = require('http').createServer(app); //required fro socket.io
var io= require('socket.io').listen(server);




var url = 'mongodb://localhost:27017/myTestDB';
var collections = ["visitors"];
//var db = require("mongodb").connect(databaseURI, collections);

/*Database utility: mongodb which writes the timestamp and page that was viewed */
var MongoClient = require('mongodb').MongoClient;
var id="";//will this work trully asyncronously???  or will global variable be updated and override?
function insertData(data, collection){
    MongoClient.connect(url, function(err, db) {
        if(err){
            console.log(err);
        }
        else{
            db.collection(collection).insert(data, function(err, result){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Success");
                    id=result.ops[0]['_id']; //if this works ill be shocked!  it doesnt work, not asynced...
                    console.log("Insert ID: "+id);
                    db.close();
                   // callback(result);
                }
            });
        }
    });
}
function updateData(id, field, data, collection){
    console.log("Update ID: "+id+" "+field);
    MongoClient.connect(url, function(err, db) {
        if(err){
            console.log(err);
        }
        else{
            db.collection(collection).updateOne({"_id":id}, {$set:{field:data}}, function(err, result){ //update "dateLeft" so we can get average time spent, etc
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Success Update");
                    console.log(result.result.nModified);
                    //id=result.ops[0]._id; //if this works ill be shocked!
                    db.close();
                    //callback(result);
                }
            });
        }
    });
}

function retrieveData(groupField, field, collection, callback){ //eventaully I want "GroupType" to not just be sum...
    field="$"+field;
    MongoClient.connect(url, function(err, db) {
        if(err){
            console.log(err);
        }
        else{
            db.collection(collection).aggregate([
                {$group:{"_id":field, "value":{$sum:groupField}}}
            ]).toArray(function(err, result){ //update "dateLeft" so we can get average time spent, etc
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Success");
                    //console.log(result);
                    //id=result.ops[0]._id; //if this works ill be shocked!
                    db.close();
                    callback(result);
                }
            });
        }
    });
}
/*End database utility */

app.set('view engine', 'ejs');

/*this is the "brain" of the website: shows the structure of the webpages.  the "outer" nodes are the links that show up on all the pages.  The subsites are sites that show up as button links on the "outer" pages.  */
var myWebsiteLayout=[ //add additional files here for connectivity
    {Name:"Home", fileName:"index"}, 
    {Name:"Research", fileName:"research", subSites:[
        {Name:"First Hitting Time", fileName:"firstHittingTime", links:"firstHittingTimeProject"}, 
        {Name:"Economic Capital", fileName:"economicCapital"}
    ]},
    {Name: "Projects", fileName:"projects", subSites:[
        {Name:"Credit Risk Distribution", fileName:"CreditRiskProjectDiffusion"}, 
        {Name:"First Hitting Time Project", fileName:"firstHittingTimeProject", links:"firstHittingTime"}
    ]},
    {Name:"About", fileName:"about"}
];
/*end brain*/

//index...redirect a "blank" to index
app.get('/', function(req, res){
     res.redirect("index");
});

//other pages...uses "brain" to populate the values on the page
myWebsiteLayout.forEach(function(value){
    if(value.subSites){
        value.subSites.forEach(function(subValue){
            renderPage(subValue.fileName, subValue.links, subValue.Name, myWebsiteLayout);
        });
    }
    renderPage(value.fileName, value.subSites, value.Name, myWebsiteLayout);
});
//helper function for rendering the page
function renderPage(file, link, name, menuName){
     app.get('/'+file, function(req, res){
        res.render(file, {linkage:link, name:name, menuNames:menuName});
        insertData({page:file, dateEntered:new Date(), dateLeft:null}, "visitors"
        //function(){
         //   retrieveData(groupField, field, collection, callback)
        //}
        
        ); //insert data into database
    });
}
app.get('/SiteStatistics', function(req, res){
    res.render('SiteStatistics');
});
io.on('connection', function(socket){
  console.log('a user connected');
  retrieveData(1, "page", "visitors", function(data){return io.emit('updateData', data);});
  
  socket.on('disconnect', function(){
    //updateData(id, "dateLeft", new Date(), "visitors"); //this doesn't work, global id
    console.log('user disconnected');
  });
});

app.use(express.static(__dirname+'/views'));//location of static files (html, css, js, etc)
server.listen(800);

