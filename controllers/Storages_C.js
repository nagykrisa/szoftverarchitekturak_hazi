var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/Storage_Model"));
module.exports = BaseController.extend({ 
	name: "Storages",
	content: null,
	run: function(req, res, next) {
		model.setDB(req.db);
		var self = this;
		req.session.save();
		var v = new View(res, 'management');
		self.del(req, function() {
			self.form(req, res, function(formMarkup) {
				self.getContent(req,req,function(headMarkup, rowMarkup) {
					v.render({
						title: 'Storage Management',
						model_form_header : 'Form of Storages',
						model_form_template: formMarkup,
						content_header : 'List of Storages',
						content_table_header: headMarkup,
						content_table_row: rowMarkup
					});
				});
			});
		});
    },
    //todo getcontent
	getContent: function(req,res,callback) {
		var self = this;
		this.content = {};
		model.getlist_Storage(function(err, records) {
			var head_row  = "<tr>\
				<th><h1>Num</h1></th>\
				<th><h1>Name</h1></th>\
				<th><h1>Longitude</h1></th>\
				<th><h1>Latitude</h1></th>\
			  </tr>";
			var length = records.length;
			var table_row = '';
			var index = 1;
			records.forEach( function(element){
				table_row += '<tr>';
				table_row += '\
					<td>'+ index +'</td>\
					<td>'+ element.name +'</td>\
					<td>'+ element.longitude +'</td>\
					<td>'+ element.latitude +'</td>\
				';
				table_row+= '</tr>';
				index++;
			});
			callback(head_row,table_row);
		}, {});
	},
	form: function(req, res, callback) {
		var returnTheForm = function() {
			if(req.query && req.query.action === "edit" && req.query.id) {
				model.getlist_Storage(function(err, records) {
					if(records.length > 0) {
						var record = records[0];
						res.render('storage-record', {
							ID: record._id,
							name: record.name,
							longitude: parseFloat(record.longitude),
							latitude: parseFloat(record.latitude)	
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