var BaseController = require("./Base"),
	View = require("../views/Base"),
	calc_model = require("../models/Calculation_Model");
var calculation_storage_list=[];
var calculation_truck_list=[];
var calculation_package_list=[];
module.exports = BaseController.extend({ 
	name: "Calculation",
	content: null,
	run: function(req, res, next) {
		var self = this;
		req.session.save();
		var v = new View(res, 'calculation');
		calc_model.model_initialize(req,function(result){
			self.form_dialog(req,res,function(current_form_header,current_form_template) {
				v.render({
					select_header: current_form_header,
					select_form_template: current_form_template
				});
			})
		});
	},

	form_dialog: function(req, res, callback){
		var returnTheForm = function(current_list_selection){
			if(current_list_selection === 'storage'){
				var records = calc_model.Storage_List;
				if(records.length > 0) {
					var header = "Select Your Storages"
					var storage_select_table='<table class="select_table">\
						<thead>';
					storage_select_table += '\
						<tr>\
							<td><strong>Selected</strong></td>\
							<td><strong>Name</strong></td>\
							<td><strong>Longitude</strong></td>\
							<td><strong>Latitude</strong></td>\
						</tr>\
						</thead>\
						<tbody>';
					records.forEach(function(element){
						storage_select_table += '<tr>\
						<td><input  type="checkbox" name="storage" value="'+ element._id +'"></td>\
						<td>'+ element.name +'</td>\
						<td>'+ element.longitude + '</td>\
						<td>' + element.latitude + '</td>\
							</tr>\
						';
					});
						storage_select_table +='</tbody>\
								</table>';
					res.render('calculation-select_parameters', {
						actual_form: "storage",
						select_table: storage_select_table
					}, function(err,html) {
						callback(header,html);
					});
				} else {
					var header = "List is empty"
					res.render('calculation-select_parameters', {}, function(err, html) {
						callback(header,html);
					});
				}
			} else if(current_list_selection === 'truck'){
				var records = calc_model.Truck_List;
				if(records.length > 0) {
					var header = "Select Your Trucks"
					var truck_select_table='<table class="select_table">\
						<thead>';
					truck_select_table += '\
						<tr>\
							<td><strong>Selected</strong></td>\
							<td><strong>Current Location</strong></td>\
							<td><strong>Speed Max</strong></td>\
							<td><strong>Volume Max</strong></td>\
							<td><strong>Load Max</strong></td>\
						</tr>\
						</thead>\
						<tbody>';	
					records.forEach(function(element){
						calculation_storage_list.forEach(function(selected){
							if(element.current_location == selected.name){
								truck_select_table += '<tr>\
								<td><input  type="checkbox" name="truck" value="'+ element._id +'"></td>\
								<td>'+ element.current_location +'</td>\
								<td>'+ element.speed_max + '</td>\
								<td>' + element.volume_max + '</td>\
								<td>' + element.load_max + '</td>\
									</tr>\
								';
							}
						});
					});
						truck_select_table +='</tbody>\
								</table>';
					res.render('calculation-select_parameters', {
						actual_form: "truck",
						select_table: truck_select_table
					}, function(err,html) {
						callback(header,html);
					});
				} else {
					var header = "List is empty"
					res.render('calculation-select_parameters', {}, function(err, html) {
						callback(header,html);
					});
				}

			} else if(current_list_selection === 'package'){
				var records = calc_model.Package_List;
				console.log(records);				
				if(records.length > 0) {
					var header = "Select Your Packages"
					var package_select_table='<table class="select_table">\
						<thead>';
					package_select_table += '\
						<tr>\
							<td><strong>Selected</strong></td>\
							<td><strong>Name</strong></td>\
							<td><strong>From</strong></td>\
							<td><strong>To</strong></td>\
							<td><strong>Mass</strong></td>\
							<td><strong>Volume</strong></td>\
							<td><strong>Deadline</strong></td>\
						</tr>\
						</thead>\
						<tbody>';
					console.log(calculation_storage_list);
					records.forEach(function(element){
						calculation_storage_list.forEach(function(selected_from){
							calculation_storage_list.forEach(function(selected_to){
								if( (element.from == selected_from.name) && (element.to == selected_to.name) ){
									package_select_table += '<tr>\
									<td><input  type="checkbox" name="package" value="'+ element._id +'"></td>\
									<td>'+ element.name +'</td>\
									<td>'+ element.from + '</td>\
									<td>' + element.to + '</td>\
									<td>' + element.mass + '</td>\
									<td>' + element.volume + '</td>\
									<td>' + element.deadline + '</td>\
										</tr>\
									';
								}
							});
						});
					});
					package_select_table +='</tbody>\
								</table>';
					res.render('calculation-select_parameters', {
						actual_form: "package",
						select_table: package_select_table
					}, function(err,html) {
						callback(header,html);
					});
				} else {
					var header = "List is empty"
					res.render('calculation-select_parameters', {}, function(err, html) {
						callback(header,html);
					});
				}


			} else{
				var header = "Error happened"
				res.render('calculation-select_parameters', {}, function(err, html) {
					callback(header,html);
				});
			}

		}

		if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes' && req.body.whichFormWasIt ==='storage' ){
			var records = calc_model.Storage_List;
			var IDs = req.body.storage;
			records.forEach(function(record){
				IDs.forEach(function(id){
					if(record._id == id){
						calculation_storage_list.push(record);
					}
				});
			});
			//2. ha a storages formbol kaptunk vissza adatokat akkor tudjuk,
			//hogy most a Truckos formot kell ki renderelni
			returnTheForm('truck');
		} else if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes' && req.body.whichFormWasIt ==='truck'){
			var records = calc_model.Truck_List;
			var IDs = req.body.truck;
			records.forEach(function(record){
				IDs.forEach(function(id){
					if(record._id == id){
						calculation_truck_list.push(record);
					}
				});
			});
			console.log(calculation_storage_list);
			//3. ha a truckos formbol kaptunk vissza adatokat akkor tudjuk,
			//hogy most a packages formot kell ki renderelni
			returnTheForm('package');

		} else if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes' && req.body.whichFormWasIt ==='package'){
			var records = calc_model.Package_List;
			var IDs = req.body.package;
			records.forEach(function(record){
				IDs.forEach(function(id){
					if(record._id == id){
						calculation_package_list.push(record);
					}
				});
			});
			var header = 'Calculation Results';
			res.render('calculation-result', {
				list: "<h1> Fityisz</h1>"
			}, function(err,html) {
				callback(header,html);
			});
			//4. ha a packages formbol kaptunk vissza adatokat akkor tudjuk,
			//hogy most adott minden számoláshoz való adat indulhat a kalkuláció
			// make calculation
			// eredmeny form kirenderelese
		}else{
			// 1. először a storage formot rendereltetjük ki.
			//TODO ha egy elemet választtunk ki akkor nem tömb
			calculation_storage_list=[];
			calculation_truck_list=[];
			calculation_package_list=[];
			returnTheForm('storage'); 
		}
	}
});