var BaseController = require("./Base"),
	View = require("../views/Base"),
	calc_model = require("../models/Calculation_Model");
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
					var storage_select_table='<table class="select_table, container">\
						<thead>';
					storage_select_table += '\
						<tr>\
							<th><h1>Selected</h1></th>\
							<th><h1>Name</h1></th>\
							<th><h1>Longitude</h1></th>\
							<th><h1>Latitude</h1></th>\
						</tr>\
						</thead>\
						<tbody>';
					for(var i=0; element = records[i]; i++){
						storage_select_table += '<tr>\
						<td><input  type="checkbox" name="storage" value="'+ element._id +'"></td>\
						<td>'+ element.name +'</td>\
						<td>'+ element.longitude + '</td>\
						<td>' + element.latitude + '</td>\
							</tr>\
						';
					}
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
					var truck_select_table='<table class="select_table, container">\
						<thead>';
					truck_select_table += '\
						<tr>\
							<th><h1>Selected</h1></th>\
							<th><h1>Current Location</h1></th>\
							<th><h1>Speed Max</h1></th>\
							<th><h1>Volume Max</h1></th>\
							<th><h1>Load Max</h1></th>\
						</tr>\
						</thead>\
						<tbody>';	
					for(var i=0; element = records[i]; i++){
						for(var j=0; selected = calc_model.calculation_storage_list[j]; j++){
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
						}
					}
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
				if(records.length > 0) {
					var header = "Select Your Packages"
					var package_select_table='<table class="select_table, container">\
						<thead>';
					package_select_table += '\
						<tr>\
							<th><h1>Selected</h1></th>\
							<th><h1>Name</h1></th>\
							<th><h1>From</h1></th>\
							<th><h1>To</h1></th>\
							<th><h1>Mass</h1></th>\
							<th><h1>Volume</h1></th>\
							<th><h1>Deadline</h1></th>\
						</tr>\
						</thead>\
						<tbody>';
					for(var i=0; element = records[i]; i++){
						for(var j=0; selected_from = calc_model.calculation_storage_list[j]; j++){
							for(var k=0; selected_to = calc_model.calculation_storage_list[k]; k++){
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
							}
						}
					}
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
			calc_model.calculation_storage_list=[];
			var records = calc_model.Storage_List;
			var IDs = [];
			if(typeof req.body.storage == "object")
				IDs = req.body.storage;
			else
				IDs.push(req.body.storage);
			for(var i=0; record = records[i]; i++){
				for(var j=0; id = IDs[j]; j++){
					if(record._id == id){
						calc_model.calculation_storage_list.push(record);
					}
				}
			}
			//2. ha a storages formbol kaptunk vissza adatokat akkor tudjuk,
			//hogy most a Truckos formot kell ki renderelni
			returnTheForm('truck');
		} else if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes' && req.body.whichFormWasIt ==='truck'){
			calc_model.calculation_truck_list=[];
			var records = calc_model.Truck_List;
			var IDs = [];
			if(typeof req.body.truck == "object")
				IDs = req.body.truck;
			else
				IDs.push(req.body.truck);
			for(var i=0; record = records[i]; i++){
				for(var j=0; id = IDs[j]; j++){
					if(record._id == id){
						calc_model.calculation_truck_list.push(record);
					}
				}
			}
			//3. ha a truckos formbol kaptunk vissza adatokat akkor tudjuk,
			//hogy most a packages formot kell ki renderelni
			returnTheForm('package');

		} else if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes' && req.body.whichFormWasIt ==='package'){
			calc_model.calculation_package_list=[];
			var records = calc_model.Package_List;
			var IDs = [];
			if(typeof req.body.package == "object")
				IDs = req.body.package;
			else
				IDs.push(req.body.package);
			for(var i=0; record = records[i]; i++){
				for(var j=0; id = IDs[j]; j++){
					if(record._id == id){
						calc_model.calculation_package_list.push(record);
					}
				}
			}
			var header = 'Calculation Results';
			var result_records = null;
			var sum_text = null;
			var table_text='<table class="content_table, container"><thead>';
			table_text += '\
			<tr>\
				<th><h1>ID</h1></th>\
				<th><h1>Original Location</h1></th>\
				<th><h1>Final Destination</h1></th>\
				<th><h1>Storages visited</h1></th>\
				<th><h1>Kms Covered</h1></th>\
			</tr>\
			</thead>\
			<tbody>';
			calc_model.evaluate_calculation(function(result, naivSum){
				sum_text = '<table class="content_table, container"><thead>\
							<tr>\
								<th><h1>Ideális út</h1></th>\
								<th><h1>'+naivSum.toFixed(2)+' km</h1></th>';
				result_records = result;
			});

			var index = 1;
			var optimisedSum = 0;
			result_records.forEach(function(record){
				table_text += '<tr>\
					<td>'+ index++ +'</td>\
					<td>'+ record.original_loc +'</td>\
					<td>'+ record.final_destination +'</td>\
					<td>'+ record.number_of_trip +'</td>\
					<td>'+ (record.sum_trip /1000).toFixed(2) +'</td>\
					</tr>';
				optimisedSum += record.sum_trip / 1000;
			});
			
			sum_text += '<th><h1>Kiszámolt út</h1></th>\
						 <th><h1>'+optimisedSum.toFixed(2)+' km</h1></th>\
						 </tr>\
						</thead>';


			table_text +='</tbody></table>';

			res.render('calculation-result', {
				status_head: sum_text,
				list: table_text
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
			calc_model.calculation_storage_list=[];
			calc_model.calculation_truck_list=[];
			calc_model.calculation_package_list=[];
			returnTheForm('storage'); 
		}
	}
});