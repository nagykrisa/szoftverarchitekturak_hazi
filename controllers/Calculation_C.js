var BaseController = require("./Base"),
	View = require("../views/Base"),
	calc_model = require("../models/Calculation_Model");
module.exports = BaseController.extend({ 
	name: "Calculation",
	content: null,
	run: function(req, res, next) {
		var self = this;
		calc_model.model_initialize(req,function(result){
			self.getModelContent(result,function() {
				var v = new View(res, 'calculation');
				v.render(self.content);
			})
		});
	},
	getModelContent: function(result,callback) {
		this.content = {};
		//this.content.yess = result.Package_List[0].name;
		callback();
	}
});