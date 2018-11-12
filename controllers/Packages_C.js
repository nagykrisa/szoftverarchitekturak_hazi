var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/Package_Model"));
module.exports = BaseController.extend({ 
	name: "Packages",
	content: null,
	run: function(req, res, next) {
		model.setDB(req.db);
		var self = this;
		this.getContent(function() {
			var v = new View(res, 'management');
			v.render(self.content);
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
		    callback();
        }, {});
	},
	model_form_template: function(req, res,callback){
		
	}
});