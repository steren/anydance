// We have two types of clients : the dancer-client and the video-client.

/// MODELS

var User = function (socket, uuid, game) {
  /** unique identifier of this user */
  this.uuid = uuid;
  this.nickname = null;
  this.socket = socket;
  this.game = game;
  this.score = 0;

  this.addPoints = function (points) {
    this.score += points;
  };
};

var Game = function (socket) {
  this.uuid = generateGameUUID();
  /** The users currently dancing in this game */
  this.users = []; 
  /** socket to the video-client */
  this.socket = socket;
  
  this.getNewUserScores = function () {
    var scores = {};
    for(var i = 0; i < this.users.length; i++) {
      scores[this.users[i].uuid] = this.users[i].score;
    }
    return scores;
  };
};

/** dictionnary of all the currently active games ( key = UUID, value = game ) */
var games = {};


/// FUNCTIONS

/** called when a user is disconnected */
var sendNewScores = function (game) {
  game.socket.emit('video update scores', game.getNewUserScores());
};

var sendNewUserScore = function(uuid, score) {
  
}

/** called when a user is disconnected */
var userDisconnected = function (user) {
  io.sockets.emit('user disconnected');
};

var generateGameUUID = function (games) {
  // TODO : generate a game ID based on the current ones
  return Math.floor(Math.random()*1000);
}

/**
 * return the game (null if not found)
 */
var findGame = function (games, uuid) {
  return games[uuid];
}

/// APP 

var app = require('express').createServer()
  , io = require('socket.io').listen(app);

app.listen(80);

app.get('/dancing', function (req, res) {
  res.sendfile(__dirname + '/dancing.html');
});

app.get('/dance', function (req, res) {
  res.sendfile(__dirname + '/dance-video.html');
});

io.sockets.on('connection', function (socket) {

  // a game is created
  socket.on('register game', function (data, fn) {
    console.info('REGISTER NEW GAME', data);

    // create a new game
    var game = new Game(socket);
    socket.set('game', game);
    
    // add game to the collection
    games[game.uuid] = game;
    
    // and return the UUID
    fn({gameUUID: game.uuid});
  });

  // a new user can be registered only when a game has been created
  socket.on('register new user', function (data, fn) {
    console.log('new user: ');
    console.log(data);

    // find the game
    var game = games[data.gameUUID];
    if (game != null) {
      var user =  new User(socket, data.uuid, game);
      game.users.push(user);
      // store the user in this socket
      socket.set('user', user);
      
      fn({})
      
      sendNewScores(game);
      
    } else {
      fn({error: "game not found"})
    }
    
  });
  
  socket.on('update user score', function (data) {
    socket.get('user', function (err, user) {
      user.addPoints(data.points);
      console.log(user.uuid + ': ' + user.score);
      sendNewScores(user.game);
    });
  });
  
  socket.on('disconnect', function () {
    userDisconnected(socket.user);
  });

});

// every 1 seconds, send the new scores:
var intervalID = setInterval(function() {}, 1000);

