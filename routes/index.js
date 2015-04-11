
/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: "Where's the Metro?", subtitle: "Where's the Metro?" })
};

/*
 * GET home page.
 */
exports.about = function(req, res){
  res.render('about', { title: "Where's the Metro?", subtitle: "About" })
};

/*
 * GET rail or station list page.
 */
exports.rail = function(req, res){
  var fs = require('fs');
  var us = require('underscore');
  var id = req.route.params['id'];
  var mta_data = JSON.parse(fs.readFileSync('./public/data/mta.json'));
  var mta_data_rails = us.findWhere(mta_data,{"id":"rails"});
    
  if (id != null) {
    /* station was selected */
    var mta_data_line = us.findWhere(mta_data_rails.lines,{"url":id});
    res.render('rail', { title: "Where's the Metro?", subtitle: mta_data_line.title, mta_data: mta_data_line, rail: id });
  } else {
    /* rail line was selected */
    res.render('rail', { title: "Where's the Metro?", subtitle: "Rail", mta_data: mta_data_rails });
  }
};

/*
 * GET station page.
 */
exports.station = function(req, res){
    var fs = require('fs');
    var us = require('underscore');
    var https = require('https');
    // apikey passed in cli
    var key = process.argv[2];
    var id = req.route.params['id'];
    var st = req.route.params['station'];
    var mta_data = JSON.parse(fs.readFileSync('./public/data/mta.json'));
    var mta_data_rails = us.findWhere(mta_data,{"id":"rails"});
    var mta_data_line = us.findWhere(mta_data_rails.lines,{"url":id});
    var mta_data_station = us.findWhere(mta_data_line.stations,{"url":st});
    var url = 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/'+mta_data_station.Code+'?api_key='+key;
    https.get(url,function(resp){
        resp.on('data',function(e){
            response = JSON.parse(e.toString());
            res.render('station', { title: "Where's the Metro?", subtitle: mta_data_line.title, mta_data: mta_data_station, rail: id, response: response });
        });
    });    
};