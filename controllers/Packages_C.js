var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/Package_Model"));
module.exports = BaseController.extend({ 
	name: "Packages",
	content: null,
	run: function(req, res, next) {
		model.setDB(req.db);
		var self = this;
		this.model_form_template(req, res,function(html){
			self.content.model_form_template= html;
			self.getContent(function() {
				var v = new View(res, 'management');
				v.render(self.content);
			})
		})
    },
    //todo getcontent
	getContent: function(callback) {
		var self = this;
		this.content = {};
		model.getlist_Package(function(err, records) {
			self.content.content_header = "List of Packages"
			self.content.content_table_header = "<tr>\
				<th>ID</th>\
				<th>Name</th>\
				<th>From</th>\
				<th>To</th>\
				<th>Mass</th>\
				<th>Volume</th>\
				<th>Deadline</th>\
			  </tr>";
			var length = records.length;
			var content_table_row = '';
			records.forEach( function(element){
				content_table_row += '<tr>';
				content_table_row += '\
					<td>'+ element._id +'</td>\
					<td>'+ element.name +'</td>\
					<td>'+ element.from +'</td>\
					<td>'+ element.to +'</td>\
					<td>'+ element.mass +'</td>\
					<td>'+ element.volume +'</td>\
					<td>'+ element.deadline +'</td>\
				';
				content_table_row+= '</tr>';
			});
			self.content.content_table_row = content_table_row;
			self.model_form_template(callback());
        }, {});
	},
	model_form_template: function(req, res, callback) {
		var self = this;
		this.content = {};
		var returnTheForm = function() {
			self.content.model_form_header = "List of Packages"
			if(req.query && req.query.action === "edit" && req.query.id) {
				model.getlist(function(err, records) {
					if(records.length > 0) {
						var record = records[0];
						res.render('package-record', {
							ID: record.ID,
							name: record.name,
							from: record.from,
							to: record.to,
							mass: record.mass,
							volume: record.volume,
							deadline: record.deadline							
						}, function(err, html) {
							callback(html);
						});
					} else {
						res.render('package-record', {}, function(err, html) {
							callback(html);
						});
					}
				}, {ID: req.query.id});
			} else {
				res.render('package-record', {}, function(err, html) {
					callback(html);
				});
			}
		}
		/*
		if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes') {
			var data = {
				name: req.body.name,
				from: req.body.from,
				to: req.body.to,
				mass: req.body.mass,
				volume: req.body.volume,
				deadline: req.body.deadline,
				ID: req.body.ID
			}
			model[req.body.ID != '' ? 'update' : 'insert'](data, function(err, objects) {
				returnTheForm();
			});
		} else {
			returnTheForm();
		}*/

		returnTheForm();
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete" && req.query.id) {
			model.remove(req.query.id, callback);
		} else {
			callback();
		}
	}
});