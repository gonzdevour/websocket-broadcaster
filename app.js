var express = require('express'),
    http = require('http'),
    exphbs  = require("express3-handlebars"),
    _ = require('underscore');
    WebSocketServer = require('ws').Server;

    app = express();

// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

/*
 app.get('/', function (req, res) {
    // res.render('home');
 });
     app.post('/', function(req, res){
         res.redirect("/");
     });
*/


var server = http.createServer(app);
var port = process.env.PORT || 5000

server.listen(port);
console.log('express3-handlebars example server listening on: 5000');

var wss = new WebSocketServer({server:server});

var wsConnections = [];

wss.on('connection', function(ws) {
    var id = setInterval(function() {
        ws.send("_ping", function() {  });
    }, 29000);

    console.log('websocket connection open', ws.upgradeReq.url);
    wsConnections.push({url: ws.upgradeReq.url, ws: ws});
    ws.on('close', function() {
        console.log('websocket connection close');
        clearInterval(id);
    });

    ws.on('message', function(ev){
        console.log("received", ev);
        var closedWsConnections = [];
        _.each( wsConnections, function(webSocket){
          try{
            webSocket.ws.send(JSON.stringify(ev));
          } catch (ex) {
            console.log("send exception ", ex, webSocket.url);
            closedWsConnections.push(webSocket);
          }
        });
        wsConnections = _.difference(wsConnections, closedWsConnections);
        console.log("active connections ", wsConnections);
    });
});
