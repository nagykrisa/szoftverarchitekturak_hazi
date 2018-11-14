var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/Storage_Model")),
	crypto = require("crypto")
	ObjectId = require('mongodb').ObjectID;

module.exports = BaseController.extend({ 
	name: "Admin",
	username: "admin",
	password: "admin",
	run: function(req, res, next) {
		var self = this;
		if(this.authorize(req)) {
			model.setDB(req.db);
			req.session.fastdelivery = true;
			req.session.save();
			var v = new View(res, 'admin');
			self.del(req, function() {
				self.form(req, res, function(formMarkup) {
					self.list(function(listMarkup) {
						v.render({
							title: 'Administration',
							content: 'Welcome to the control panel',
							list: listMarkup,
							form: formMarkup
						});
					});
				});
			});
		} else {
			var v = new View(res, 'admin-login');
			v.render({
				title: 'Please login'
			});
		}		
	},
	authorize: function(req) {
		return (
			req.session && 
			req.session.fastdelivery && 
			req.session.fastdelivery === true
		) || (
			req.body && 
			req.body.username === this.username && 
			req.body.password === this.password
		);
	},
	list: function(callback) {
		model.getlist_Storage(function(err, records) {
			var markup = '<table>';
			markup += '\
				<tr>\
					<td><strong>Name</strong></td>\
					<td><strong>Longitude</strong></td>\
					<td><strong>Latitude</strong></td>\
				</tr>\
			';
			for(var i=0; record = records[i]; i++) {
				markup += '\
				<tr>\
					<td>' + record.name + '</td>\
					<td>' + record.longitude + '</td>\
					<td>' + record.latitude + '</td>\
					<td>\
						<a href="/admin?action=delete&id=' + record._id + '">delete</a>&nbsp;&nbsp;\
						<a href="/admin?action=edit&id=' + record._id + '">edit</a>\
					</td>\
				</tr>\
			';
			}
			markup += '</table>';
			callback(markup);
		})
	},
	form: function(req, res, callback) {
		var returnTheForm = function() {
			if(req.query && req.query.action === "edit" && req.query.id) {
				model.getlist_Storage(function(err, records) {
					if(records.length > 0) {
						var record = records[0];
						res.render('storage-record', {
							_id: record._id,
							name: record.name,
							longitude: record.longitude,
							latitude: record.latitude	
						}, function(err, html) {
							callback(html);
						});
					} else {
						res.render('storage-record', {}, function(err, html) {
							callback(html);
						});
					}
				}, {_id: ObjectId(req.query.id)});
			} else {
				res.render('storage-record', {}, function(err, html) {
					callback(html);
				});
			}
		}
		
		if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes') {
			var data = {
				name: req.body.name,
				longitude: parseFloat(req.body.longitude),
				latitude: parseFloat(req.body.latitude),
			}
			if(req.body._id != ''){
				model.update_Storage(ObjectId(req.body._id),data, function(err, objects) {
					returnTheForm();
				});
			}else{
				model.insert_Storage(data, function(err, objects) {
					returnTheForm();
				});
			}
		} else {
			returnTheForm();
		}
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete" && req.query.id) {
			model.remove_Storage(ObjectId(req.query.id), callback);
		} else {
			callback();
		}
	}
});