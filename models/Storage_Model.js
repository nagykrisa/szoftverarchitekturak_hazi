var Model = require("./Base"),
	crypto = require("crypto"),
	model = new Model();

var Storage_Model = model.extend({
	getlist_Storage: function(callback, query) {
		this.collection("Storages").find(query || {}).toArray(callback);
	},
	//Only admin functions
    //later todo
	remove_Storage: function(ID, callback) {
		this.collection("Storages").findAndModify({ID: ID}, [], {}, {remove: true}, callback);
	},
	insert_Storage: function(data, callback) {
		data.ID = crypto.randomBytes(20).toString('hex'); 
		this.collection("Storages").insert(data, {}, callback || function(){ });
	},
	update_Storage: function(data, callback) {
		this.collection("Storages").update({ID: data.ID}, data, {}, callback || function(){ });	
	}
});
module.exports = Storage_Model;


//Storages:
// _id:
// name:
// longitude:
// latitude:
