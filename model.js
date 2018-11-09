var storage = require("./model/storage.js");
var truck = require("./model/truck.js");
var pack = require("./model/pack.js");
var MongoClient = require('mongodb').MongoClient;
var uri = 'ide ird be az urit';
var packs_Array = [];
var storages_Array = [];
var trucks_Array = [];

exports.getStorages_Array = function(){return storages_Array;}
exports.getTrucks_Array = function(){return trucks_Array;}
exports.getPacks_Array = function(){return packs_Array;}

function setStorages_Array(tmp_storage){
    storages_Array.push(new storage.Storage(tmp_storage._id, tmp_storage.name, tmp_storage.longitude, tmp_storage.latitude));
}
function setTrucks_Array(tmp_truck){
    trucks_Array.push(new truck.Truck(tmp_truck._id, tmp_truck.current_location, tmp_truck.speed_max,tmp_truck.volume_max,tmp_truck.load_max));
}
function setPacks_Array(tmp_pack){
    packs_Array.push(new pack.Packs(tmp_pack));
}

exports.initModel = function(){
    console.log("modell_betolt_adatbazisbol");
 MongoClient.connect(uri,{ useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    const dbo = db.db("Szallitmanyozas");

    dbo.collection("Storages").find({},{ projection: { _id: 1, name: 1, longitude: 1, latitude: 1 }}).toArray(function(err,result) {
        if(err) throw err;
        result.forEach(function(element){
            setStorages_Array(element);
        });
    });
    
    dbo.collection("Trucks").find({},{ projection: { _id: 1, current_location: 1, speed_max: 1, volume_max: 1,load_max: 1 }}).toArray(function(err,result) {
        if(err) throw err;
        result.forEach(function(element){
            setTrucks_Array(element);
        });
    });

    db.close();
   });
}