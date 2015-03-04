(function() {
    var socket = new WebSocket(Backbone.WebSocketURL);
    var callbacks = {};
    Backbone.sync = function(method, model, options) {
        socket.onerror = function (error) {
            console.log('WebSocket Error ' + error);
        };

        socket.onmessage = function (e) {
            var data = JSON.parse(e.data)
            callbacks[data.url](data.data)
            console.log('Server: ' + e.data);
        };

        callbacks[model.url] = options.success;
        socket.send(JSON.stringify({
            url: model.url,
            method: method,
            data: model.attributes || {}
        }))
    };
})();