var express = require('express');
var request = require('request');
var GeoJSON = require('geojson');
var jsonexport = require('jsonexport');

var router = express.Router();

var stations_url = 'https://gbfs.citibikenyc.com/gbfs/en/station_information.json';

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/geojson', function(req, res, next) {
  request(stations_url, function(error, response, body) {
    var last_updated = JSON.parse(body).last_updated;
    res.set({"Content-Disposition":`attachment; filename="stations${last_updated}.geojson"`});

    var stationsJSON = JSON.parse(body).data.stations;
    var stationsGeoJSON = GeoJSON.parse(stationsJSON, {Point: ['lat', 'lon']});

    res.send(stationsGeoJSON);
  });
});

router.get('/csv', function(req, res, next) {
  request(stations_url, function(error, response, body) {
    var last_updated = JSON.parse(body).last_updated;
    res.set({"Content-Disposition":`attachment; filename="stations${last_updated}.csv"`});

    var stationsJSON = JSON.parse(body).stationBeanList;
    var stationsCSV = jsonexport(stationsJSON, function(err, csv) {
      res.send(csv);
    });
  });
});

module.exports = router;
