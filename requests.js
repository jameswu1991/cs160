function request(action, callback) {
	$.ajax({
		data: {action: JSON.stringify(action)},
		url: 'server/submit.php',
		type: 'POST',
		success: function(data) {
			callback(JSON.parse(data));
		}
	});
}

var Store = function() {
	this.read = function(model, success) {
		// fetch single, otherwise fetch all
		if (model.id)
			request({command: 'fetch', table: model.table, id: model.id},
				function(attributes){
					$.each(attributes, function(attr, val){
						model.set(attr, val);
					});
					success(model);
				});
		else
			request({
					command: 'fetchAll', 
					table: model.table, 
					params: model.params
				},
				function(data){
					var items = [];
					$.each(data, function(id, itemData){
						var item = new model.model();
						$.each(itemData, function(attr, val){
							if (isNaN(parseInt(attr)) && attr != 'id') {
								var args = {};
								args[attr] = val;
								item.set(args);
							}
						});
						item.id = id;
						items.push(item);
					});
					success(items);
				});
	}
	this.create = function(model, success) {
		request({command: 'add', table: model.table, attributes: model.toJSON()},
			function(data){
				model.id = data.insertId;
				success(model);
			});
	}
	this.update = function(model, success) {
		request({command: 'update', table: model.table, id: model.id, attributes: model.toJSON()}, function(data){
			success(model);
		});
	}
	this['delete'] = function(model, success) {
		request({command: 'delete', table: model.table, id: model.id}, function(data){
			success(model);
		});
	}
}

window.store = new Store();

Backbone.sync = function(method, model, options) {
	var resp = window.store[method](model, options.success);
};
