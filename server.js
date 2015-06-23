var express=require('express');
var app=express();

var server  = require('http').createServer(app); //required fro socket.io
var io= require('socket.io').listen(server);


var mongoUtils=require('mongoUtils');
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
        res.render(file, {linkage:link, name:name, menuNames:menuName});
        myDatabase.insertData({page:file, dateEntered:new Date(), dateLeft:null});
    });
}
app.get('/SiteStatistics', function(req, res){
    res.render('SiteStatistics');
});
io.on('connection', function(socket){
  console.log('a user connected');
  myDatabase.retrieveData(1, "page", function(data){return io.emit('updateData', data);});
  
  socket.on('disconnect', function(){
    //updateData(id, "dateLeft", new Date(), "visitors"); //this doesn't work, global id
    console.log('user disconnected');
  });
});

app.use(express.static(__dirname+'/views'));//location of static files (html, css, js, etc)
server.listen(800);

