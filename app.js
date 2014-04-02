var express = require('express'),
    http = require('http'),
    exphbs  = require("express3-handlebars"),
    _ = require('underscore');
    WebSocketServer = require('ws').Server;

    app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('home');
});


var server = http.createServer(app);

server.listen(5000);
console.log('express3-handlebars example server listening on: 5000');

var wss = new WebSocketServer({server:server});

var wsConnections = [];

wss.on('connection', function(ws) {
    var id = setInterval(function() {
        ws.send(JSON.stringify(new Date()), function() {  });
    }, 30000);

    console.log('websocket connection open', ws.upgradeReq.url);
    wsConnections.push({url: ws.upgradeReq.url, ws: ws});
    ws.on('close', function() {
        console.log('websocket connection close');
        clearInterval(id);
    });

    ws.on('message', function(ev){
        console.log("received", ev);
        _.each( _.values(wsConnections), function(webSocket){
            webSocket.ws.send(JSON.stringify(ev));
        });
    });
});




