
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
    package_priority_object: null,
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
    evaluate_calculation: function(callback){
        var self= this;
        self.drop_useless_packages(self,function(callback){
            self.sort_packages_by_priority(self,function(callback){
                self.create_flow_map(self,function(callback){
                    //TODO: reszutak eldobasa
                    //TODO:  utak hegesztes
                    //TODO : truckok flow végpontjaba.
                });
            });
        });
    },
    evaluate_optimal_total_distance: function(callback){
        var total_distance = 0;
        this.evaluate_calculation(callback);
        //console.log(this.calculation_package_list.length);
        for(var i=0; i < this.calculation_package_list.length; i++){
            //console.log(i);
            var from = this.calculation_package_list[i].from;
            var to   = this.calculation_package_list[i].to;
            var tmp  = this.evaluate_distance(from,to);
            total_distance+=tmp;
        }
        //console.log(total_distance/1000);
        callback(total_distance/1000);
    },
    evaluate_distance: function(a,b){
        a = this.get_from_Storages(a);
        b = this.get_from_Storages(b);
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
    },
    drop_useless_packages: function(self,callback){
        //console.log("elotte:"+this.calculation_package_list.length);
        this.calculation_package_list = this.calculation_package_list.filter(function(value,index,arr){
            return (value.from != value.to);
        });
        //console.log("utana:"+this.calculation_package_list.length);
        callback();
    },
    sort_packages_by_priority: function(self,callback){
        var tmp = [];
        for(var i = 0; i<this.calculation_package_list.length; i++){
            var objektum = {};
            objektum["to"]  = this.calculation_package_list[i].to;
            tmp.push(objektum);
        }
        //console.log(tmp);
        this.package_priority_object = tmp.reduce((p,c) =>{
            p[c.to] = ++p[c.to] || 1;
            return p;
        },{});
        //console.log(this.package_priority_object);
        callback();
    },
    create_flow_map: function(self,callback){
        var route_list = [];
        for (var key in this.package_priority_object) {
            var tmp = [];
            this.calculation_package_list.forEach(function(package){
                if(package.to == key){
                    tmp.push(package);
                    console.log("key kiválasztva: "+key);
                }
            });
            for(var i = 0; i< this.package_priority_object[key]; i++){
                var minimalDistance = 999999999999999;
                var minimalPackage = null;
                var minimalFrom = null;
                var minimalNode = null;
                var minimalNodeIndex = null;
                tmp.forEach(function(package){
                   //FROM _ TO
                    var pack_dist= self.evaluate_distance(package.from,package.to);
                    console.log("with calc distance:"+ pack_dist);
                    if(minimalDistance >= pack_dist){
                        minimalDistance = pack_dist;
                        minimalPackage = package;
                        minimalFrom = "TO";
                        console.log("min package:"+minimalPackage+"with dist"+minimalDistance+"with method:"+minimalFrom);
                    }
                    //FROM _ FOLYAM
                    if(route_list.length > 0){
                        route_list.forEach(function(route){
                            if(route[0] == package.to){
                                var pack_dist= self.evaluate_distance(route[route.length-1],package.from);
                                if(minimalDistance >= pack_dist){
                                    minimalDistance = pack_dist;
                                    minimalPackage = package;
                                    minimalNode = route[route.length-1];
                                    minimalFrom ="ROUTE END"; 
                                    console.log("min package:"+minimalPackage+"with dist"+minimalDistance+"with method:"+minimalFrom);
                                }
                                for(var i = 1; i < route.length-1; i++){
                                    var pack_dist= self.evaluate_distance(route[i],package.from);
                                    if(minimalDistance >= pack_dist){
                                        minimalDistance = pack_dist;
                                        minimalPackage = package;
                                        minimalNode = route[i];
                                        minimalNodeIndex = i;
                                        minimalFrom ="ROUTE BETWEEN"; 
                                        console.log("min package:"+minimalPackage+"with dist"+minimalDistance+"with method:"+minimalFrom);
                                    }
                                }
                            }
                        });
                    }
                });
                //TO LOGIC
                if(minimalFrom=="TO"){
                    var route = [];
                    if(minimalPackage.to != minimalPackage.from){
                        route.push(minimalPackage.to);
                        route.push(minimalPackage.from);
                        route_list.push(route);
                    }
                    else console.error("destination equal to source route")                   
                }
                
                //ROUTE END LOGIC
                if(minimalFrom=="ROUTE END"){
                    route_list.forEach(function(route){
                        if(route[0]== minimalPackage.to && route[route.length-1]==minimalNode && minimalNode != minimalPackage.from){
                            route.push(minimalPackage.from);
                        }
                    });
                }

                //ROUTE MID LOGIC
                if(minimalFrom=="ROUTE MID"){
                    for(var j = 0; j < route_list.length; j++){
                        if(route_list[j].route[0]== minimalPackage.to && route_list[j].route[minimalNodeIndex]==minimalNode && route_list[j].route[minimalNodeIndex] != minimalPackage.from){
                            var new_route = route_list[j].slice(0,minimalNodeIndex);
                            new_route.push(minimalPackage.from);
                            route_list.push(new_route);                            
                        }
                    }
                }

                //remove minimal temp
                var tmptemp= [];
                for(var j=0; j< tmp.length; j++){
                    if(tmp[j]._id != minimalPackage._id){
                        tmptemp.push(tmp[j]);
                    }
                }
                tmp = tmptemp;
                console.log("new tmp:" + tmp);
                console.log(route_list);
            }
            
            console.log(key, this.package_priority_object[key]);
            
        }
        
        callback();
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