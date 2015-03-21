var WebSocketServer = require('websocket').server;
var httpServer = require('http');
var mongoose = require('mongoose/');

Schema = mongoose.Schema;

var MessageSchema = new Schema({
    message: String,
    date: Date
});

mongoose.model('Message', MessageSchema);
var MessageMongooseModel = mongoose.model('Message');


var myServ = httpServer.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

myServ.listen(8765, function() {
    console.log((new Date()) + ' Server is listening on port 8765');
});

wsServer = new WebSocketServer({
    httpServer: myServ,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    return true;
}

var connections = [];

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        return;
    }

    var connection = request.accept();

    connections.push(connection);

    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var data = JSON.parse(message.utf8Data);

            if (data.url == '/messages' && data.method == "read") {
                MessageMongooseModel.find().limit(20).sort('date', -1).execFind(function(arr, dbData) {
                    connection.send(JSON.stringify({
                        url: data.url,
                        data: dbData
                    }));
                });
            } else if (data.url == '/messages' && data.method == "create") {
                var message = new MessageMongooseModel();
                message.message = data.data.message;
                message.date = new Date()
                message.save(function() {
                    MessageMongooseModel.find().limit(20).sort('date', -1).execFind(function(arr, dbData) {
                        for (var i = 0; i < connections.length; ++i) {
                            try {
                                connections[i].send(JSON.stringify({
                                    url: data.url,
                                    data: dbData
                                }));
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    })
                });
            }
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});