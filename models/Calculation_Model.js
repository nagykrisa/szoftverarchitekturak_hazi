
storage_model = new (require("../models/Storage_Model"));
truck_model = new (require("../models/Truck_Model"))
module.exports = {
    Storage_List: null,
    Truck_List: null,
    Package_List: null,
    //Adatbazisbol kiszedjuk ami kell
    //Modell inicializalasa
    model_initialize: function(req){
        storage_model.setDB(req.db);
        truck_model.setDB(req.db);
        var self = this;
        this.load_ST_List(function(records){
            self.Storage_List= records;
        });
        this.load_TR_List(function(records){
            self.Truck_List = records;
        });
    }
    ,
    load_ST_List: function(callback){
        var self = this;
        storage_model.getlist_Storage(function(err, records) {
           callback(records);
        }, {});
    },
    load_TR_List: function(callback){
        var self = this;
        truck_model.getlist_Truck(function(err, records) {
            callback(records);
        }, {});
        
    },
    //szamolos algotirmusnak
    //databan beadjuk a packageket
    //callbackbe kirajzoltatjuk az eredményt??
    make_calculation: function(data,callback){
        var self = this;
        console.log(self.Storage_List.length);
        console.log(self.Truck_List.length);
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