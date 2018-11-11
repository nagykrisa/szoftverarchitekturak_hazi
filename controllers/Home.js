var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/Storage_Model"));
	calc_model = require("../models/Calculation_Model");
module.exports = BaseController.extend({ 
	name: "Home",
	content: null,
	run: function(req, res, next) {
		model.setDB(req.db);
		var self = this;
		this.getContent(function() {
			var v = new View(res, 'home');
			v.render(self.content);
		})
	},
	getContent: function(callback) {
		var self = this;
		this.content = {};
		model.getlist(function(err, records) {
			if(records.length > 0) {
				self.content.bannerTitle = records[0].name;
				self.content.bannerText ="lon:" + records[0].longitude + "  lat:"+ records[0].latitude;
			}
			model.getlist(function(err, records) {
				var blogArticles = '<input list="storages" name="storages">\
				<datalist id="storages">\
				';
				records.forEach( function(element){
						blogArticles += '\
							<option value='+ element.name +'>\
						';
					});
				blogArticles+= '</datalist>\
				<input type="submit">';

				self.content.blogArticles = blogArticles;
				callback();
			}, {});
		}, {});
	}
});