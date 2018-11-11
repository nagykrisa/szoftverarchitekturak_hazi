var Model = require("./Base"),
	crypto = require("crypto"),
    model = new Model();

var Truck_Model = model.extend({
    getlist_Truck: function(callback, query) {
        this.collection("Trucks").find(query || {}).toArray(callback);
    },
    //Only admin functions
    //later todo
    remove_Truck: function(ID, callback) {
        this.collection("Trucks").findAndModify({ID: ID}, [], {}, {remove: true}, callback);
    },
    insert_Truck: function(data, callback) {
        data.ID = crypto.randomBytes(20).toString('hex'); 
        this.collection("Trucks").insert(data, {}, callback || function(){ });
    },
    update_Truck: function(data, callback) {
        this.collection("Trucks").update({ID: data.ID}, data, {}, callback || function(){ });	
    }
});
module.exports = Truck_Model;

//Trucks:
//_id:
//current_location:
//speed_max:
//volume_max:
//load_max:
