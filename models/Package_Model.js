var Model = require("./Base"),
	model = new Model();

var Package_Model = model.extend({
	getlist_Package: function(callback, query) {
		this.collection("Packages").find(query || {}).toArray(callback);
	},
	remove_Package: function(ID, callback) {
		this.collection("Packages").findAndModify({_id: ID}, [], {}, {remove: true}, callback);
	},
	insert_Package: function(data, callback) {
		this.collection("Packages").insertOne(data, {}, callback || function(){ });
	},
	update_Package: function(id, data, callback) {
		this.collection("Packages").updateOne({_id: id}, { $set: data }, {}, callback || function(){ });	
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