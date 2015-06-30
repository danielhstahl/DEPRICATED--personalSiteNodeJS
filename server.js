"use strict";
/*(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();*/


var express=require('express');
var app=express();

var server  = require('http').createServer(app); //required fro socket.io
var io= require('socket.io').listen(server);
var mongoUtils=require('mongoUtils');
/*var complex=require('Complex');
var lgdCF=require('lgdCF'); //exportable class
var lpmCF=require('lpmCF'); //exportable class
var IntegroVasicekMG=require('IntegroVasicekMG'); //exportable class
var fullDistribution=require('fullDistribution'); //exportable class
var GaussianCF=require('GaussianCF'); //exportable class*/



var myDatabase=new mongoUtils({url:"mongodb://localhost:27017/myTestDB", collections:"visitors"}); //default options work here...

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
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress; //get user ip address
        console.log("at renderpage: "+ip);
        res.render(file, {linkage:link, name:name, menuNames:menuName});
        myDatabase.insertData({page:file, dateEntered:new Date(), dateLeft:null, ip:ip});
    });
}
app.get('/SiteStatistics', function(req, res){
    res.render('SiteStatistics');
});
io.on('connection', function(socket){
    console.log('a user connected');
    var ip = socket.handshake.address; //get ip address
    console.log("at io: "+ip)
  
    myDatabase.retrieveData({page:{$ne:null}}, "sum", 1, "page", function(data){
        return io.emit('totalViews', data); //open question...will this start becoming computationally expensive with many users hitting this?  this emits to all viewers
    });

    myDatabase.retrieveData({dateLeft:{$ne:null}}, "avg", {$subtract:["$dateLeft", "$dateEntered"]}, "page", function(data){return io.emit('averageView', data);});
  //myDatabase.deleteData({page:null});
    socket.on('disconnect', function(){ //when page is left
        myDatabase.updateData({ip:ip, dateLeft:{$eq:null}}, "dateLeft", new Date()); //should work since all dateLefts should be not null
        console.log('user disconnected');
    });
    socket.on("creditPressed", function(msg){
        var fork = require('child_process').fork; //asynced child process
        var child=fork('node_modules/main.js');
        child.send(msg);
        child.on('message', function(data){
            var key=Object.keys(data)[0];
            //console.log(data[key]);
            io.emit(key, data[key]);
        });
    });
    socket.on('error', function(err){
        console.log("error "+err);
    });
});
app.use(express.static(__dirname+'/views'));//location of static files (html, css, js, etc)
server.listen(800);//socket to listen on

