$(function(){

window.Item = Backbone.Model.extend({
	table: 'items',
	defaults: function() {
		return {
			foodId: 0,
			purchasedDate: 0,
			organic: 0,
			userId: 0
		}
	},
	getFood: function() {
		return window.foods.get(this.get('foodId'));
	}
});

window.ItemsList = Backbone.Collection.extend({
	model: window.Item,
	table: 'items',
	initialize: function() {
		var self = this;
		this.fetch({success: function(){
			self.trigger('fetched');
		}});
	}
});

window.Food = Backbone.Model.extend({
	table: 'foods',
	defaults: function() {
		return {
			points: 10,
			name: '',
			description: '',
			va: 0,
			vb: 0,
			vc: 0,
			protein: 0,
			calcium: 0,
			carbs: 0
		}
	},
});

window.FoodsList = Backbone.Collection.extend({
	model: window.Food,
	table: 'foods',
	initialize: function() {
		var self = this;
		this.fetch({success: function(){
			self.trigger('fetched');
		}});
	}, 
	findByName: function(name) {
		var toreturn = null;
		$.each(this.models, function(idx, food){
			if (food.get('name') == name)
				toreturn = food;
		});
		return toreturn;
	}
});

window.User = Backbone.Model.extend({
	table: 'users',
	defaults: function() {
		return {
			facebook: '',
			score: 0,
			va: 0,
			vb: 0,
			vc: 0,
			protein: 0,
			calcium: 0,
			carbs: 0
		}
	},
});

window.UsersList = Backbone.Collection.extend({
	model: window.User,
	table: 'users',
	initialize: function() {
		var self = this;
		this.fetch({success: function(){
			self.trigger('fetched');
		}});
	},
	findByFacebook: function(facebookId) {
		var toreturn = null;
		$.each(this.models, function(idx, user){
			if (user.get('facebook') == facebookId)
				toreturn = user;
		});
		return toreturn;
	}
});

window.Misc = Backbone.Model.extend({
	table: 'misc',
	defaults: function() {
		return {
			param: '',
			data: ''
		}
	},
});

window.MiscList = Backbone.Collection.extend({
	model: window.Misc,
	table: 'misc',
	initialize: function() {
		var self = this;
		this.fetch({success: function(){
			if (!self.findByName('score')) {
				(new Misc({
					param: 'score',
					data: 0
				})).save({},{success:function(){
					self.fetch();
				}});
			}
			self.trigger('fetched');
		}});
	},
	findByName: function(name) {
		var toreturn = null;
		$.each(this.models, function(idx, prop){
			if (prop.get('param') == name)
				toreturn = prop;
		});
		return toreturn;
	}
});

});