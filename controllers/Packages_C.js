var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/Package_Model"));
module.exports = BaseController.extend({ 
	name: "Packages",
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
						title: 'Package Management',
						mode_form_header : 'Form of Packages',
						model_form_template: formMarkup,
						content_header : 'List of Packages',
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
		model.getlist_Package(function(err, records) {
			var head_row = "<tr>\
				<th>Num</th>\
				<th>Name</th>\
				<th>From</th>\
				<th>To</th>\
				<th>Mass</th>\
				<th>Volume</th>\
				<th>Deadline</th>\
			  </tr>";
			var table_row = '';
			var index = 1;
			records.forEach( function(element){
				table_row += '<tr>';
				table_row += '\
					<td>'+ index +'</td>\
					<td>'+ element.name +'</td>\
					<td>'+ element.from +'</td>\
					<td>'+ element.to +'</td>\
					<td>'+ element.mass +'</td>\
					<td>'+ element.volume +'</td>\
					<td>'+ element.deadline +'</td>\
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
		
		if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes') {
			var data = {
				name: req.body.name,
				from: req.body.from,
				to: req.body.to,
				mass: parseFloat(req.body.mass),
				volume: parseFloat(req.body.volume),
				deadline: parseInt(req.body.deadline)
			}
			model[req.body.ID != '' ? 'update_Package' : 'insert_Package'](data, function(err, objects) {
				returnTheForm();
			});
		} else {
			returnTheForm();
		}

		returnTheForm();
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete_Package" && req.query.id) {
			model.remove(req.query.id, callback);
		} else {
			callback();
		}
	}
});