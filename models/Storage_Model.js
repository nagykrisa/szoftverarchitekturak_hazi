var Model = require("./Base"),
	crypto = require("crypto"),
	model = new Model();

var Storage_Model = model.extend({
	getlist: function(callback, query) {
		this.collection("Storages").find(query || {}).toArray(callback);
	},
	//Only admin functions
    //later todo
	remove: function(ID, callback) {
		this.collection("Storages").findAndModify({ID: ID}, [], {}, {remove: true}, callback);
	},
	insert: function(data, callback) {
		data.ID = crypto.randomBytes(20).toString('hex'); 
		this.collection("Storages").insert(data, {}, callback || function(){ });
	},
	update: function(data, callback) {
		this.collection("Storages").update({ID: data.ID}, data, {}, callback || function(){ });	
	}
});
module.exports = Storage_Model;


//Storages:
// _id:
// name:
// longitude:
// latitude:
