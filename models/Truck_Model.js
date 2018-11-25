var Model = require("./Base"),
    model = new Model();

var Truck_Model = model.extend({
    getlist_Truck: function(callback, query) {
        this.collection("Trucks").find(query || {}).toArray(callback);
    },
    remove_Truck: function(ID, callback) {
        this.collection("Trucks").findAndModify({_id: ID}, [], {}, {remove: true}, callback);
    },
    insert_Truck: function(data, callback) {
        this.collection("Trucks").insertOne(data, {}, callback || function(){ });
    },
    update_Truck: function(id, data, callback) {
        this.collection("Trucks").updateOne({_id: id}, { $set: data }, {}, callback || function(){ });	
    }
});
module.exports = Truck_Model;
//Trucks:
//_id:
//current_location:
//speed_max:
//volume_max:
//load_max:
