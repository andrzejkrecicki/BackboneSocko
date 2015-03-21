# BackboneSocko

**socko** /ˈsɒkəʊ/ _adjective, informal_
*stunningly effective or successful*.

**BackboneSocko** allows you to replace xhr-based Backbone.Sync with realtime WebSockets.

### Usage

BackboneSocko uses following JSON format to transport messages:
url: _model url_
method: _method: create/read/update/delete_
data: _model attributes_

Server should allow WebSockets connections at Backbone.WebSocketURL and accept format specified above. Moreover every connected client should be notified about any changes _(see simple example in server-example.js)_.

### License
_MIT_