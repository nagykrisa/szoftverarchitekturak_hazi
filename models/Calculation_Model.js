
storage_model = new (require("../models/Storage_Model"));
truck_model = new (require("../models/Truck_Model"));
package_model = new (require("../models/Package_Model"))
module.exports = {
    Storage_List: null,
    Truck_List: null,
    Package_List: null,
    calculation_storage_list: null,
    calculation_truck_list: null,
    calculation_package_list: null,
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
    //ha kiszamoltuk visszahivjuk
    evaluate_central_calc: function(callback){


        callback();
    },
    evaluate_optimal_total_distance: function(callback){
        var total_distance = 0;
        console.log(this.calculation_package_list.length);
        for(var i=0; i < this.calculation_package_list.length; i++){
            console.log(i);
            var from = this.calculation_package_list[i].from;
            var to   = this.calculation_package_list[i].to;
            var tmp  = this.evaluate_distance(this.get_from_Storages(from),this.get_from_Storages(to));
            total_distance+=tmp;
        }
        console.log(total_distance/1000);
        callback(total_distance/1000);
    },
    evaluate_distance(a,b){
        var lat1 = a.latitude;
        var lon1 = a.longitude;
        var lat2 = b.latitude;
        var lon2 = b.longitude;
        var R = 6371e3; // metres
        var φ1 = this.deg2rad(parseFloat(lat1));
        var φ2 = this.deg2rad(parseFloat(lat2));
        var Δφ = this.deg2rad(parseFloat(parseFloat(lat2)-parseFloat(lat1)));
        var Δλ = this.deg2rad((parseFloat(lon2)-parseFloat(lon1)));
        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        var distance = R * c;
        return distance;
    },
    get_from_Storages(name){
        var wanted = null;
        for(var i=0; i<this.calculation_storage_list.length;i++){
            if(this.calculation_storage_list[i].name == name){
                wanted = this.calculation_storage_list[i];
            }
        }
        return wanted;
    },
    deg2rad(deg) {
        return deg * (Math.PI/180)
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