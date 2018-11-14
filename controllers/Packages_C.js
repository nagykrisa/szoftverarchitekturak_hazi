var BaseController = require("./Base"),
	View = require("../views/Base"),
	package_model = new (require("../models/Package_Model"));
	storage_model = new (require("../models/Storage_Model"));
	ObjectId = require('mongodb').ObjectID;
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
	getContent: function(req,res,callback) {
		var self = this;
		this.content = {};
		package_model.getlist_Package(function(err, records) {
			var head_row = "<tr>\
				<th>Num</th>\
				<th>Name</th>\
				<th>From</th>\
				<th>To</th>\
				<th>Mass</th>\
				<th>Volume</th>\
				<th>Deadline</th>\
				<th></th>\
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
					<td>\
						<a href="/packages?action=delete&id=' + element._id + '">delete</a>&nbsp;&nbsp;\
						<a href="/packages?action=edit&id=' + element._id + '">edit</a>\
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
				package_model.getlist_Package(function(err, records) {
					if(records.length > 0) {
						var record = records[0];
						var storage_list_from= '';
						var storage_list_to= '';
						storage_model.getlist_Storage(function(err,elements){
						elements.forEach(function(element){
							if(element.name == record.from)
								storage_list_from += '<option value="'+ element.name+'"selected = "selected">'+ element.name+'</option>'
							if(element.name == record.to)
								storage_list_to += '<option value="'+ element.name+'"selected = "selected">'+ element.name+'</option>'
							storage_list_from += '<option value="'+ element.name+'">'+ element.name+'</option>'
							storage_list_to += '<option value="'+ element.name+'">'+ element.name+'</option>'
						});
						res.render('package-record', {
							_id: record._id,
							name: record.name,
							from: storage_list_from,
							to: storage_list_to,
							mass: record.mass,
							volume: record.volume,
							deadline: record.deadline	
						}, function(err, html) {
							callback(html);
						});
					},{});

				} else {
					res.render('package-record', {}, function(err, html) {
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
			if(req.body._id != ''){
				package_model.update_Package(ObjectId(req.body._id),data, function(err, objects) {
					returnTheForm();
				});
			}else{
				console.log("INSERT")
				package_model.insert_Package(data, function(err, objects) {
					returnTheForm();
				});
			}
		} else {
			returnTheForm();
		}
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete" && req.query.id) {
			package_model.remove_Package(ObjectId(req.query.id), callback);
		} else {
			callback();
		}
	}
});