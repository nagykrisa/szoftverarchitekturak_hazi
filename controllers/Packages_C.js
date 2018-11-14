var BaseController = require("./Base"),
	View = require("../views/Base"),
	package_model = new (require("../models/Package_Model"));
	storage_model = new (require("../models/Storage_Model"));

module.exports = BaseController.extend({ 
	name: "Packages",
	content: null,
	run: function(req, res, next) {
		package_model.setDB(req.db);
		storage_model.setDB(req.db);
		var self = this;
		req.session.save();
		var v = new View(res, 'management');
		self.del(req, function() {
			self.form(req, res, function(formMarkup) {
				self.getContent(req,req,function(headMarkup, rowMarkup) {
					v.render({
						title: 'Package Management',
						model_form_header : 'Form of Packages',
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
		package_model.getlist_Package(function(err, records) {
			var head_row = "<tr>\
				<th><h1>Num</h1></th>\
				<th><h1>Name</h1></th>\
				<th><h1>From</h1></th>\
				<th><h1>To</h1></th>\
				<th><h1>Mass</h1></th>\
				<th><h1>Volume</h1></th>\
				<th><h1>Deadline</h1></th>\
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
				package_model.getlist_Package(function(err, records) {
					if(records.length > 0) {
						var record = records[0];
						res.render('package-record', {
							ID: record._id,
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
				var storage_list= '';
				storage_model.getlist_Storage(function(err,records){
					records.forEach(function(element){
						storage_list += '<option value="'+ element.name+'">'+ element.name+'</option>'
					});
					res.render('package-record', {
						from: storage_list,
						to: storage_list
					}, function(err, html) {
						callback(html);
					});
				},{});
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
			package_model[req.body.ID != '' ? 'update_Package' : 'insert_Package'](data, function(err, objects) {
				returnTheForm();
			});
		} else {
			returnTheForm();
		}
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete_Package" && req.query.id) {
			package_model.remove(req.query.id, callback);
		} else {
			callback();
		}
	}
});