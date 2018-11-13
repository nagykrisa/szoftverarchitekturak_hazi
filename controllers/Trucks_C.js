var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/Truck_Model"))
module.exports = BaseController.extend({ 
	name: "Trucks",
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
						title: 'TrucksS Management',
						mode_form_header : 'Form of Trucks',
						model_form_template: formMarkup,
						content_header : 'List of Trucks',
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
		model.getlist_Truck(function(err, records) {
			var head_row = "<tr>\
				<th>ID</th>\
				<th>Current_Location</th>\
				<th>Speed_max</th>\
				<th>Volume_max</th>\
				<th>Load_max</th>\
			  </tr>";
			var length = records.length;
			var table_row = '';
			records.forEach( function(element){
				table_row += '<tr>';
				table_row += '\
					<td>'+ element._id +'</td>\
					<td>'+ element.current_location +'</td>\
					<td>'+ element.speed_max +'</td>\
					<td>'+ element.volume_max +'</td>\
					<td>'+ element.load_max +'</td>\
				';
				table_row+= '</tr>';
			});
		    callback(head_row,table_row);
		}, {});
	},
	form: function(req, res, callback) {
		var returnTheForm = function() {
			if(req.query && req.query.action === "edit" && req.query.id) {
				model.getlist(function(err, records) {
					if(records.length > 0) {
						var record = records[0];
						res.render('truck-record', {
							ID: record.ID,
							current_location: record.current_location,
							speed_max: record.speed_max,
							volume_max: record.volume_max,
							load_max: record.load_max
						}, function(err, html) {
							callback(html);
						});
					} else {
						res.render('truck-record', {}, function(err, html) {
							callback(html);
						});
					}
				}, {ID: req.query.id});
			} else {
				res.render('truck-record', {}, function(err, html) {
					callback(html);
				});
			}
		}
		
		if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes') {
			var data = {
				current_location: req.body.current_location,
				speed_max: parseFloat(req.body.speed_max),
				volume_max: parseFloat(req.body.volume_max),
				load_max: parseFloat(req.body.load_max)
			}
			model[req.body.ID != '' ? 'update_Truck' : 'insert_Truck'](data, function(err, objects) {
				returnTheForm();
			});
		} else {
			returnTheForm();
		}
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete_Truck" && req.query.id) {
			model.remove(req.query.id, callback);
		} else {
			callback();
		}
	}
});