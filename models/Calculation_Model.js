
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
    route_list: null,
    assign_list: null,
    calc_list: null,
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
    evaluate_calculation: function(callback){
        var self= this;
        self.drop_useless_packages(self,function(){
            self.sort_packages_by_priority(self,function(){
                self.create_flow_map(self,function(){
                    self.drop_multiple_roads(self,function(){
                        self.join_roads(self,function(){
                            self.assign_truck(self,function(){
                                self.calc_truck_route(self,function(alma){                                    
                                    var szilva;
                                    self.evaluate_optimal_total_distance(function(körte){
                                        szilva = körte;
                                    });
                                    callback(alma, szilva);
                                });
                            });
                        });       
                    });
                });
            })
        });        
    },
    evaluate_optimal_total_distance: function(callback){
        var total_distance = 0;
        for(var i=0; i < this.calculation_package_list.length; i++){
            var from = this.calculation_package_list[i].from;
            var to   = this.calculation_package_list[i].to;
            var tmp  = this.evaluate_distance(from,to);
            total_distance+=tmp;
        }
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
        this.calculation_package_list = this.calculation_package_list.filter(function(value,index,arr){
            return (value.from != value.to);
        });
        callback();
    },
    sort_packages_by_priority: function(self,callback){
        var tmp = [];
        for(var i = 0; i<this.calculation_package_list.length; i++){
            var objektum = {};
            objektum["to"]  = this.calculation_package_list[i].to;
            tmp.push(objektum);
        }
        this.package_priority_object = tmp.reduce((p,c) =>{
            p[c.to] = ++p[c.to] || 1;
            return p;
        },{});
        callback();
    },
    create_flow_map: function(self,callback){
        route_list = [];
        for (var key in this.package_priority_object) {
            var tmp = [];
            this.calculation_package_list.forEach(function(package){
                if(package.to == key){
                    tmp.push(package);
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
                    if(minimalDistance >= pack_dist){
                        minimalDistance = pack_dist;
                        minimalPackage = package;
                        minimalFrom = "TO";
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
                                }
                                for(var i = 1; i < route.length-1; i++){
                                    var pack_dist= self.evaluate_distance(route[i],package.from);
                                    if(minimalDistance >= pack_dist){
                                        minimalDistance = pack_dist;
                                        minimalPackage = package;
                                        minimalNode = route[i];
                                        minimalNodeIndex = i;
                                        minimalFrom ="ROUTE BETWEEN"; 
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
            }  
        }
        
        callback();
    },
    drop_multiple_roads: function(self,callback){
        for(var i = 0; i < (route_list.length-1); i++){
            for(var j = i+1; j < (route_list.length); j++){
                var routeString = route_list[i].toString();
                var subrouteString = route_list[j].toString();
                if(routeString.includes(subrouteString))
                    route_list.splice(j,1);
            }
        }
        callback();
    },
    join_roads: function(self,callback){
        var notSame = true;
        while(notSame){ 
        prev_route_length = route_list.length;
        for(var i = 0; i < (route_list.length-1); i++){
            for(var j = i+1; j < (route_list.length); j++){
                var last_of_first_route = route_list[i][route_list[i].length-1];
                var first_of_second_route = route_list[j][0];
                if(last_of_first_route == first_of_second_route){
                    route_list[i].push.apply(route_list[i],route_list[j].slice(1,route_list[j].length));
                    route_list.splice(j,1);
                }
            }
        }
        (route_list);
        if(prev_route_length == route_list.length)
            notSame = false;
        }
        callback();
    },
    assign_truck:function(self,callback){
        assign_list = [];
        var tmp_truck_list = self.calculation_truck_list;
        for(var i = 0; i < (route_list.length); i++){
            var route_start = route_list[i][route_list[i].length-1];
            var minimalTruckIndex = null;
            for(var j = 0; j < (tmp_truck_list.length);j++){
                if(route_start == tmp_truck_list[j].current_location){
                    minimalTruckIndex = j;
                }
            }
            if(minimalTruckIndex != null){
                var assign = {};
                assign[route_list[i]] = tmp_truck_list[minimalTruckIndex];
                tmp_truck_list.splice(minimalTruckIndex,1);
                assign_list.push(assign);    
            }     

        }
        // IDE VALAMI FIX DE GYORSAN? NEM SZÁMOL TOVÁBB
        for(var i = 0; i < (route_list.length); i++){
            var notInAssignList = true;
            for(var j = 0; j < assign_list.length; j++){
                 if(assign_list[j][route_list[i]] != null)
                    notInAssignList = false;
            }
            if(notInAssignList){
                var route_start = route_list[i][route_list[i].length-1];
                var minimalTruckIndex = null;
                var minimalDistance = 999999999999999;
                for(var j = 0; j < (tmp_truck_list.length);j++){
                    var truck_dist= self.evaluate_distance(route_start,tmp_truck_list[j].current_location);
                    if(minimalDistance >= truck_dist){
                        minimalDistance = truck_dist;
                        minimalTruckIndex = j;
                    }     
                } 
                if(minimalTruckIndex != null){
                    var assign = {};
                    assign[route_list[i]] = tmp_truck_list[minimalTruckIndex];
                    tmp_truck_list.splice(minimalTruckIndex,1);
                    assign_list.push(assign);   
                }
            }
        }
        for(var i = 0; i < (route_list.length); i++){
            var notInAssignList = true;
            for(var j = 0; j < assign_list.length; j++){
                 if(assign_list[j][route_list[i]] != null)
                    notInAssignList = false;
            }
            if(notInAssignList && assign_list.length!=0){
                var minimalTruckKey = null;
                var minimalDistance = 999999999999999;
                for(var j = 0; j < assign_list.length; j++){
                    var key =  Object.keys(assign_list[j]);
                    var tmp = key[0].split(',');
                    var start = tmp[0];
                    var end = route_list[i][route_list[i].length-1]
                    var dist = self.evaluate_distance(start,end);
                    if(minimalDistance >= dist){
                        minimalDistance = dist;
                        minimalTruckKey = j;
                    }    
                }
                if(minimalTruckKey != null){
                    var assign = {};
                    assign[route_list[i]] = Object.values(assign_list[minimalTruckKey])[0];
                    assign_list.push(assign);   
                }
            }
        }
        callback();
    },
    calc_truck_route: function(self,callback){
        calc_list = [];
        for(let j = 0; j < assign_list.length; j++){           
            var assign_element = Object.values(assign_list[j])[0];
            var assign_key = Object.keys(assign_list[j])[0];
            var assign_not_happened = true;
            for(let i = 0; i< calc_list.length; i++){
                if(calc_list[i]._id == assign_element._id){
                    calc_list[i].route = assign_key + "," + calc_list[i].route;
                    assign_not_happened = false;
                }     
            }               
            if(assign_not_happened){
                //create new calc elem
                var calc = {_id: assign_element._id, original_loc: assign_element.current_location, route: assign_key + "," + assign_element.current_location, final_destination: "", number_of_trip: 0, sum_trip:0 };
                calc_list.push(calc);
            }
        }
        
        
        calc_list.forEach(function(element){
            var route_array = element.route.split(',');
            element.final_destination = route_array[0];
            var num = route_array.length;
            element.number_of_trip = num;
            var sum = 0;
            for(var n = 0; n < num-1; n++){
                sum += self.evaluate_distance(route_array[n],route_array[n+1]);
            }
            element.sum_trip = sum;
        });
        callback(calc_list);
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