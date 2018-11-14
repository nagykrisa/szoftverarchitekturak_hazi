var BaseController = require("./Base"),
	View = require("../views/Base"),
	truck_model = new (require("../models/Truck_Model"))
	storage_model = new (require("../models/Storage_Model"))
module.exports = BaseController.extend({ 
	name: "Trucks",
	content: null,
	run: function(req, res, next) {
		truck_model.setDB(req.db);
		storage_model.setDB(req.db);
		var self = this;
		req.session.save();
		var v = new View(res, 'management');
		self.del(req, function() {
			self.form(req, res, function(formMarkup) {
				self.getContent(req,req,function(headMarkup, rowMarkup) {
					v.render({
						title: 'Trucks Management',
						model_form_header : 'Form of Trucks',
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
		truck_model.getlist_Truck(function(err, records) {
			var head_row  = "<tr>\
				<th><h1>Num</h1></th>\
				<th><h1>Current_Location</h1></th>\
				<th><h1>Speed_max</h1></th>\
				<th><h1>Volume_max</h1></th>\
				<th><h1>Load_max</h1></th>\
			  </tr>";
			var table_row = '';
			var index = 1;
			records.forEach( function(element){
				table_row += '<tr>';
				table_row += '\
					<td>'+ index +'</td>\
					<td>'+ element.current_location +'</td>\
					<td>'+ element.speed_max +'</td>\
					<td>'+ element.volume_max +'</td>\
					<td>'+ element.load_max +'</td>\
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
				truck_model.getlist_Truck(function(err, records) {
					if(records.length > 0) {
						var record = records[0];
						res.render('truck-record', {
							ID: record._id,
							current_location: record.current_location,
							speed_max: parseFloat(record.speed_max),
							volume_max: parseFloat(record.volume_max),
							load_max: parseFloat(record.load_max)
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
				var storage_list= '';
				storage_model.getlist_Storage(function(err,records){
					records.forEach(function(element){
						storage_list += '<option value="'+ element.name+'">'+ element.name+'</option>'
					});
					res.render('truck-record', {
						current_location: storage_list
					}, function(err, html) {
						callback(html);
					});
				},{});
			}
		}
		
		if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes') {
			var data = {
				current_location: req.body.current_location,
				speed_max: parseFloat(req.body.speed_max),
				volume_max: parseFloat(req.body.volume_max),
				load_max: parseFloat(req.body.load_max)
			}
			truck_model[req.body.ID != '' ? 'update_Truck' : 'insert_Truck'](data, function(err, objects) {
				returnTheForm();
			});
		} else {
			returnTheForm();
		}
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete_Truck" && req.query.id) {
			truck_model.remove(req.query.id, callback);
		} else {
			callback();
		}
	}
});