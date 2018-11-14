var BaseController = require("./Base"),
	View = require("../views/Base"),
	truck_model = new (require("../models/Truck_Model"))
	storage_model = new (require("../models/Storage_Model"));
	ObjectId = require('mongodb').ObjectID;
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
	getContent: function(req,res,callback) {
		var self = this;
		this.content = {};
		truck_model.getlist_Truck(function(err, records) {
			var head_row  = "<tr>\
				<th>Num</th>\
				<th>Current_Location</th>\
				<th>Speed_max</th>\
				<th>Volume_max</th>\
				<th>Load_max</th>\
				<th></th>\
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
					<td>\
						<a href="/trucks?action=delete&id=' + element._id + '">delete</a>&nbsp;&nbsp;\
						<a href="/trucks?action=edit&id=' + element._id + '">edit</a>\
					</td>\
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
						var storage_list= '';
						storage_model.getlist_Storage(function(err,elements){
							elements.forEach(function(element){
								if(element.name == record.current_location)
									storage_list += '<option value="'+ element.name+'" selected = "selected">'+ element.name+'</option>'
								else
									storage_list += '<option value="'+ element.name+'">'+ element.name+'</option>'
							});
							res.render('truck-record', {
								_id: record._id,
								current_location: storage_list,
								speed_max: parseFloat(record.speed_max),
								volume_max: parseFloat(record.volume_max),
								load_max: parseFloat(record.load_max)
							}, function(err, html) {
								callback(html);
							});
						},{});

					} else {
						res.render('truck-record', {}, function(err, html) {
							callback(html);
						});
					}
				}, {_id: ObjectId(req.query.id)});
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
			if(req.body._id != ''){
				truck_model.update_Truck(ObjectId(req.body._id),data, function(err, objects) {
					returnTheForm();
				});
			}else{
				truck_model.insert_Truck(data, function(err, objects) {
					returnTheForm();
				});
			}
		} else {
			returnTheForm();
		}
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete" && req.query.id) {
			truck_model.remove_Truck(ObjectId(req.query.id), callback);
		} else {
			callback();
		}
	}
});