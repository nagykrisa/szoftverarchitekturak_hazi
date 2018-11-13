var Model = require("./Base"),
	model = new Model();

var Package_Model = model.extend({
	getlist_Package: function(callback, query) {
		this.collection("Packages").find(query || {}).toArray(callback);
	},
	//Only admin functions
    //later todo
	remove_Package: function(ID, callback) {
		this.collection("Packages").findAndModify({ID: ID}, [], {}, {remove: true}, callback);
	},
	insert_Package: function(data, callback) {
		this.collection("Packages").insert(data, {}, callback || function(){ });
	},
	update_Package: function(data, callback) {
		this.collection("Packages").update({ID: data.ID}, data, {}, callback || function(){ });	
	}
});
module.exports = Package_Model;

//Packs:
//id:
//name:
//from:
//to:
//mass:
//volume:
//deadline: