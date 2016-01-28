var UrlCtrl = require('./controllers/UrlCtrl')


module.exports = function(app) {
  app.get('/', function(req, res){
      res.sendFile('../public/index.html');
  });

  app.post('/', UrlCtrl.shortenUrl);

  app.get('/topten', UrlCtrl.getTopTen);

  app.get('/:key', UrlCtrl.updateHits);
};