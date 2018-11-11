var Storage_List = [];
var Truck_List = [];
var Package_List = [];

module.exports = function(db) {
	this.db = db;
};

module.exports = {
    //Adatbazisbol kiszedjuk ami kell
    //Modell inicializalasa
    model_initialize: function(req, res, next){
        storage_model.setDB(req.db);
        truck_model.setDB(req.db);
        console.log("pop");
        storage_model.getlist(function(err, records) {
            Storage_List = records;
        }, {});
        console.log("pop");
        truck_model.getlist(function(err, records) {
            Truck_List = records;
        }, {});
        console.log("pop");
        console.log(Storage_List);
        console.log(Truck_List);
    },
    //szamolos algotirmusnak
    //databan beadjuk a packageket
    //callbackbe kirajzoltatjuk az eredményt??
    make_calculation: function(data,callback){
        Package_List = data;
    }
}



//Storages:
// _id:
// name:
// longitude:
// latitude:

//Trucks:
//_id:
//current_location:
//speed_max:
//volume_max:
//load_max:
