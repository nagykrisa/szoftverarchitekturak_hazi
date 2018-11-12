
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
        this.load_Storage_List(self,function(result){
            self.Storage_List = result;
        });
        this.load_Truck_List(self,function(result){
            self.Truck_List = result;
        });
        this.load_Package_List(self,function(result){
            self.Package_List = result;
        });
        console.log("package:"+ self.Package_List.length + "   strorage:" +self.Storage_List.length + "    truck:"+ self.Truck_List.length  );
        callback(self);
    },
    load_Storage_List: function(self,callback){
        storage_model.getlist_Storage(function(err, records) {
            self.Storage_List = records;
            callback(records);
        }, {});
    },
    load_Truck_List: function(self,callback){
        truck_model.getlist_Truck(function(err, records) {
            self.Storage_List = records;
            callback(records);
        }, {});
    },
    load_Package_List: function(callback){
        package_model.getlist_Package(function(err, records) {
            self.Storage_List = records;
            callback(records);
        }, {});
    },
    //szamolos algotirmusnak
    //databan beadjuk a packageket
    //callbackbe kirajzoltatjuk az eredményt??
    make_calculation: function(){
        var self = this;
        console.log(self.Storage_List.length);
        console.log(self.Truck_List.length);
        console.log(self.Package_List.length);
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