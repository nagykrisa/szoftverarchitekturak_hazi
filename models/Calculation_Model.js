
storage_model = new (require("../models/Storage_Model"));
truck_model = new (require("../models/Truck_Model"));
package_model = new (require("../models/Package_Model"))
module.exports = {
    Storage_List: null,
    Truck_List: null,
    Package_List: null,
    //Adatbazisbol kiszedjuk ami kell
    //Modell inicializalasa
    model_initialize: function(req,callback){
        storage_model.setDB(req.db);
        truck_model.setDB(req.db);
        package_model.setDB(req.db);
        var self = this;
        this.load_Package_List(self,function(self){
            self.load_Storage_List(self,function(self){
                self.load_Truck_List(self,function(self){  
                    callback(self);
                })
            })
        });
    },
    load_Storage_List: function(self,callback){
        storage_model.getlist_Storage(function(err, records) {
            self.Storage_List= records;
            callback(self);
        }, {});
    },
    load_Truck_List: function(self,callback){
        truck_model.getlist_Truck(function(err, records) {
            self.Truck_List= records;
            callback(self);
        }, {});
    },
    load_Package_List: function(self,callback){
        package_model.getlist_Package(function(err, records) {
            self.Package_List= records;
            callback(self);
        }, {});
    },
    //szamolos algotirmusnak
    //databan beadjuk a packageket
    //callbackbe kirajzoltatjuk az eredményt??
    make_calculation: function(){
        var self = this;
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

//Packs:
//id:
//name:
//from:
//to:
//mass:
//volume:
//deadline: