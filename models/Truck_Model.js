var Model = require("./Base"),
    model = new Model();

var Truck_Model = model.extend({
    getlist_Truck: function(callback, query) {
        this.collection("Trucks").find(query || {}).toArray(callback);
    },
    remove_Truck: function(ID, callback) {
<<<<<<< HEAD
        this.collection("Trucks").findAndModify({_id: ID}, [], {}, {remove: true}, callback);
=======
        this.collection("Trucks").findAndModify({__id: ID}, [], {}, {remove: true}, callback);
>>>>>>> 550ea408ad0b253a6b29dbb232f9bd473f11f939
    },
    insert_Truck: function(data, callback) {
        this.collection("Trucks").insertOne(data, {}, callback || function(){ });
    },
<<<<<<< HEAD
    update_Truck: function(id, data, callback) {
        this.collection("Trucks").updateOne({_id: id}, { $set: data }, {}, callback || function(){ });	
=======
    update_Truck: function(data, callback) {
        this.collection("Trucks").update({_id: data.ID}, data, {}, callback || function(){ });	
>>>>>>> 550ea408ad0b253a6b29dbb232f9bd473f11f939
    }
});
module.exports = Truck_Model;

//Trucks:
//_id:
//current_location:
//speed_max:
//volume_max:
//load_max:
