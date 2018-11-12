var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/Truck_Model"))
module.exports = BaseController.extend({ 
	name: "Trucks",
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
		model.getlist_Truck(function(err, records) {
			self.content.content_header = "List of Trucks"
			self.content.content_table_header = "<tr>\
				<th>ID</th>\
				<th>Current_Location</th>\
				<th>Speed_max</th>\
				<th>Volume_max</th>\
				<th>Load_max</th>\
			  </tr>";
			var length = records.length;
			var content_table_row = '';
			records.forEach( function(element){
				content_table_row += '<tr>';
				content_table_row += '\
					<td>'+ element._id +'</td>\
					<td>'+ element.current_location +'</td>\
					<td>'+ element.speed_max +'</td>\
					<td>'+ element.volume_max +'</td>\
					<td>'+ element.load_max +'</td>\
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