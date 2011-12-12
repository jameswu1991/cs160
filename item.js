/*
THIS IS THE OLD VERSION
$(function(){

window.Item = Backbone.Model.extend({
	table: 'items',
	defaults: function() {
		return {
			name: '',
			description: '',
			points: 0,
			checked: 0,
			userId: 0
		}
	},
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

});
*/