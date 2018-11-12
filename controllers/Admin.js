var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/Storage_Model")),
	crypto = require("crypto")

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
				model.getlist(function(err, records) {
					if(records.length > 0) {
						var record = records[0];
						res.render('storage-record', {
							ID: record.ID,
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
				}, {ID: req.query.id});
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
			model[req.body.ID != '' ? 'update_Storage' : 'insert_Storage'](data, function(err, objects) {
				returnTheForm();
			});
		} else {
			returnTheForm();
		}
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete_Storage" && req.query.id) {
			model.remove(req.query.id, callback);
		} else {
			callback();
		}
	}
});