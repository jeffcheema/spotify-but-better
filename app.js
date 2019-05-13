var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var request = require('request');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var search = require('youtube-search');
const musicAPI = require('music-api');
var arequest = require('sync-request');
var aexec = require('sync-exec');


var index = require('./routes/index');
var users = require('./routes/users');
cors = require('cors');
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var opts = {
  maxResults: 1,
  key: 'AIzaSyCqs3dsa21CXCHuKPyiickd0qOl7TnaWuM'
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static('public'));

var escapeShell = function(cmd) {
  return '"'+cmd.replace(/(["\s'$`\\])/g,'\\$1')+'"';
};
app.get('/api/:id', function (req, res) {

  exec('youtube-dl -j '+req.params.id+';',
    function (error, stdout, stderr) {
      res.send(stdout);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });
})
app.get('/api/audio/:id', function (req, res) {

  exec('youtube-dl -x -g '+req.params.id+';',
    function (error, stdout, stderr) {
request(stdout).pipe(res);

      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });
})
app.get('/search/direct/:query', function (req, res) {

  exec('youtube-dl -x -g "ytsearch1:' + req.params.query +' lyrics";',
    function (error, stdout, stderr) {
      var jsonData = stdout;
request(stdout).pipe(res);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });
})
app.get('/api/video/:id', function (req, res) {

  exec('youtube-dl -j '+req.params.id+';',
    function (error, stdout, stderr) {
      var jsonData = stdout;
      var parsed = JSON.parse(stdout);

      res.send(parsed.formats[15].url);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });
})
function search2ID(term){
  var result;
  url = "https://www.googleapis.com/youtube/v3/search?q="+encodeURI(term)+"&part=snippet&maxResults=1&key=AIzaSyCqs3dsa21CXCHuKPyiickd0qOl7TnaWuM";
var res = arequest('GET', url);
  return JSON.parse(res.getBody('utf8'));
}
app.get('/api/album/:id', function (req, res) {

  const musicAPI = require('music-api');

  musicAPI.getAlbum('netease', {
    id: req.params.id
  })
    .then(resu=> res.send(resu))
    .catch(err => console.log(err))
});
app.get('/api/search/:id', function (req, res) {
  var response = [];
  var gen = [];
  musicAPI.searchSong('netease', {
    key: req.params.id,
    limit: 10,
    page: 1,
  })
    .then(result => {
      for (i = 0; i < result.songList.length; i++){
        song = result.songList[i];

      thing = {"cover":[],"thumbnail":"", "artists":[],"name":"","url":"","results":"", "albumName":"", "albumID":""};
      thing.cover.push(song.album.cover);
      thing.cover.push(song.album.coverBig);
      thing.thumbnail = song.album.coverSmall;
      thing.cover.push(song.album.coverSmall);
      thing.albumID = song.album.id;
      thing.albumName = song.album.name;
      for (q = 0; q< song.artists.length;q++){
        thing.artists.push(song.artists[q].name)
      }
        thing.name = song.name;
        thing.results = "/saerch/direct" + thing.artists[0] + "/" + thing.name;
        response.push(thing)


    }
    res.send(response);
    })
    .catch(err => console.log(err));


})

module.exports = app;
