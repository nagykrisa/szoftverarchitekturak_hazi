var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/Storage_Model"));
module.exports = BaseController.extend({ 
	name: "Storages",
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
		model.getlist_Storage(function(err, records) {
			self.content.content_header = "List of Storages"
			self.content.content_table_header = "<tr>\
				<th>ID</th>\
				<th>Name</th>\
				<th>Longitude</th>\
				<th>Latitude</th>\
			  </tr>";
			var length = records.length;
			var content_table_row = '';
			records.forEach( function(element){
				content_table_row += '<tr>';
				content_table_row += '\
					<td>'+ element._id +'</td>\
					<td>'+ element.name +'</td>\
					<td>'+ element.longitude +'</td>\
					<td>'+ element.latitude +'</td>\
				';
				content_table_row+= '</tr>';
			});
		    self.content.content_table_row = content_table_row;
		    callback();
		}, {});
	}
});