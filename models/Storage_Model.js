var Model = require("./Base"),
	model = new Model();

var Storage_Model = model.extend({
	getlist_Storage: function(callback, query) {
		this.collection("Storages").find(query || {}).toArray(callback);
	},
	remove_Storage: function(ID, callback) {
		this.collection("Storages").findAndModify({_id: ID}, [], {}, {remove: true}, callback);
	},
	insert_Storage: function(data, callback) {
		this.collection("Storages").insertOne(data, {}, callback || function(){ });
	},
	update_Storage: function(id , data, callback) {
		this.collection("Storages").updateOne({_id: id}, { $set: data }, {}, callback || function(){ });	
	}
});
module.exports = Storage_Model;

//Storages:
// _id:
// name:
// longitude:
// latitude:
