$(function(){

window.users = new window.UsersList();
window.items = new window.ItemsList();
window.foods = new window.FoodsList();
window.misc = new window.MiscList();
window.users = new window.UsersList();

var login = function(facebookId) {
	var usr = window.users.findByFacebook(facebookId);
	if (!usr) {
		usr = new window.User({facebook:facebookId});
		usr.save({}, {success:function(){
			window.users.fetch({success:renderAll});
		}});
	}
	else renderAll();
	window.user = usr;
}

var renderLogin = function() {
	$('body').html('\
		<div id="facebook">Log in with facebook</div>\
		<div id="fb-root"></div>\
	');
	$('#facebook').click(function(){
		FB.login(function(response) {
		   if (response.authResponse) {
		     FB.api('/me', function(response) {
	            login(response.id);
	          });
	         FB.api('/me/friends', function(response) {
	         	window.friends = response.data;
	         });
		   } else {
		     alert('You cancelled login or did not fully authorize.');
		   }
		 }, {scope: 'email, publish_stream, read_friendlists'});
	});
}

/* window.users.bind('fetched', function() {
	login('100001150209629');
}); */

renderLogin();

window.friends = 
	[
      {
         "name": "Jingchen Wu",
         "id": "1050540111"
      },
   ];

var renderAll = function() {
	$('body').html('\
		<h3>Organic Shopping Helper</h3>\
		<div id="headerContainer">\
		<div id="header" style="display:none">\
			<div id="homebutton" style="display:inline-block"></div>\
			<div id="title" style="display:inline-block"></div>\
			<div id="plusbutton" style="display:inline-block"></div>\
		</div>\
		</div>\
		<div id="main">\
			<div class="front">\
				<img src="res/front-logo.jpg" style="width:300px; height:300px"/>\
			</div>\
			<div class="front">\
				<p id="buyButton">To Buy</p><br>\
				<p id="trophiesButton">Showcase</p><br>\
				<p id="battleButton">Battle!</p>\
			</div>\
		</div>\
		<div id="fb-root"></div>\
	');
	$('body').find('#homebutton').click(function(){
		renderAll();
	});
	$('#buyButton').click(function(){
		$('body').find('#homebutton').html('home');
		$('body').find('#header').css('display','inline-block');
		$('body').find('#header #title').html('Your To-Buy List');
		(new window.BuyView ({
			el: $('body').find('#main')
		})).render();
	});
	
	$('#trophiesButton').click(function(){
		$('body').find('#homebutton').html('home');
		$('body').find('#header').css('display','inline-block');
		$('body').find('#header #title').html('Your Showcase');
		(new TrophiesView ({
			el: $('body').find('#main')
		})).render();
	});
	
	$('#battleButton').click(function(){
		$('body').find('#homebutton').html('home');
		$('body').find('#header').css('display','inline-block');
		$('body').find('#header #title').html('Battle!');
		(new BattleView ({
			el: $('body').find('#main')
		})).render();
	});
	window.scrollTo(0, 1);
}

window.BuyView = Backbone.View.extend({
	render: function() {
		var el = this.el.html('\
			<div id="left">\
			<div id="add">\
				<div id="addForm" style="display:none">\
					<input id="name" style="display:inline-block" type="text"/>\
					<div id="addItemButton" style="display:inline-block">add</div>\
					<div id="purchaseButton" style="display:inline-block">buy</div>\
				</div>\
			</div>\
			<div id="itemsList"></div>\
			</div>\
			<div id="itemDetail"></div>\
		');
		var self = this;
		
		$('body').find('#header #plusbutton').html('add').click(function(){
			if (el.find('#addForm').css('display')!='none')
				el.find('#addForm').css('display','none');
			else if (el.find('#addForm').css('display')=='none')
				el.find('#addForm').css('display','');
		});
		
		el.find('#addForm #name').autocompleteArray(window.foods.pluck('name'));
		
		var addFunction = function(check){
			var name = el.find('#addForm').find('#name').val();
			if (name == '') {
				el.find('#addForm').css('display','none');
				el.find('#addButton').css('display','');
				return;
			}
			
			var makeNewItem = function(foodId) {
				var item = new Item({
					foodId: foodId,
					userId: user.id
				});
				if (check)
					item.set({purchasedDate: (new Date()).getTime()});
				item.save({},{success:function(){
					window.items.fetch({success:function(){
						window.foods.fetch({success:function(){
							self.render();
						}});
					}});
					self.render();
				}});
			}
			
			var food = window.foods.findByName(name);
			
			if (!food) {
				food = new Food();
				food.set({name: name});
				food.save({}, {success:function(){
					window.foods.fetch({success:function(){
						makeNewItem(food.id);
					}});
				}});
			}
			else 
				makeNewItem(food.id);
		}
		
		el.find('#addItemButton').click(function() {
			addFunction();
		});
		el.find('#purchaseButton').click(function(){
			addFunction('checked');
		});
		
		var myItems = window.items.filter(function(item){
			return item.get('userId') == user.id;
		});
		
		$.each(myItems, function(idx, item){
			var div = $('<div class="item">\
				<div id="checkDiv"><input id="check" value="1" type="checkbox"></div>\
				<div id="name"></div>\
				<div id="delete">delete</div>\
			');
			
			div.find('#check')
				.attr('checked',
					item.get('purchasedDate')=='0'?false:true)
				.click(function(){
					var date = new Date();
					if (this.checked) {
						item.set({'purchasedDate': date.getTime()});
						user.set({
							'score': parseInt(user.get('score')) + parseInt(item.getFood().get('points')),
							'va': parseInt(user.get('va')) + parseInt(item.getFood().get('va')),
							'vb': parseInt(user.get('vb')) + parseInt(item.getFood().get('vb')),
							'vc': parseInt(user.get('vc')) + parseInt(item.getFood().get('vc')),
							'calcium': parseInt(user.get('calcium')) + parseInt(item.getFood().get('calcium')),
							'protein': parseInt(user.get('protein')) + parseInt(item.getFood().get('protein')),
							'carbs': parseInt(user.get('carbs')) + parseInt(item.getFood().get('carbs'))
						});
						user.save();
					}
					else {
						item.set({'purchasedDate': 0});
						user.set({
							'score': parseInt(user.get('score')) - parseInt(item.getFood().get('points')),
							'va': parseInt(user.get('va')) - parseInt(item.getFood().get('va')),
							'vb': parseInt(user.get('vb')) - parseInt(item.getFood().get('vb')),
							'vc': parseInt(user.get('vc')) - parseInt(item.getFood().get('vc')),
							'calcium': parseInt(user.get('calcium')) - parseInt(item.getFood().get('calcium')),
							'protein': parseInt(user.get('protein')) - parseInt(item.getFood().get('protein')),
							'carbs': parseInt(user.get('carbs')) - parseInt(item.getFood().get('carbs'))
						});
						user.save();
					}
					item.save({},{success:function(){
						self.render();
					}});
				});
			div.find('#delete').click(function(){
				item.destroy({success: function(){
					self.render();
				}});
			});
			div.find('#name').html(item.getFood().get('name'))
				.click(function(){
					self.renderDetail(item);
				});
			el.find('#itemsList').append(div);
		});
	},
	renderDetail: function(item) {
		var food = item.getFood();
		var el = this.el.find('#itemDetail').html('\
			<div id="show">\
				<div id="name"></div>\
				<div id="details"></div>\
				<div id="nutrition"></div>\
				<div id="editButton">edit</div>\
			</div>\
			<div id="edit" style="display:none">\
				<div>\
					<input id="name" style="display:inline-block" type="text" />\
					<input id="points" style="display:inline-block" type="text" />\
				</div>\
				<textarea id="details"></textarea>\
				<div id="nutrition">\
					<div>Vitamin A: <input id="va" type="text" value='+food.get('va')+'></div>\
					<div>Vitamin B: <input id="vb" type="text" value='+food.get('vb')+'></div>\
					<div>Vitamin C: <input id="vc" type="text" value='+food.get('vc')+'></div>\
					<div>Protein: <input id="protein" type="text" value='+food.get('protein')+'></div>\
					<div>Calcium: <input id="calcium" type="text" value='+food.get('calcium')+'></div>\
					<div>Carbohydrates: <input id="carbs" type="text" value='+food.get('carbs')+'></div>\
				</div>\
				<div id="saveButton">save</div>\
			</div>\
		');
		
		var self = this;
		el.find('#name').html(item.getFood().get('name')+' ('+
			item.getFood().get('points')+' points)');
		el.find('#details').html(item.getFood().get('description'));
		var f = item.getFood();
		el.find('#show #nutrition').html('\
			<div><img src="res/va.png" />Vitamin A: '+f.get('va')+'g</div>\
			<div><img src="res/vb.png" />Vitamin B: '+f.get('vb')+'g</div>\
			<div><img src="res/vc.png" />Vitamin C: '+f.get('vc')+'g</div>\
			<div><img src="res/protein.png" />Protein: '+f.get('protein')+'g</div>\
			<div><img src="res/calcium.png" />Calcium: '+f.get('calcium')+'g</div>\
			<div><img src="res/carbs.png" />Carbohydrates: '+f.get('carbs')+'g</div>\
		');
		el.find('#editButton').click(function(){
			var f = item.getFood();
			el.find('#show').css('display','none');
			el.find('#edit').css('display','');
			el.find('#edit #name').val(f.get('name'));
			el.find('#edit #details').val(f.get('description'));
			el.find('#edit #points').val(f.get('points'));
		});
		el.find('#saveButton').click(function(){
			item.save({},{success:function(){
				var f = item.getFood();
				f.set({
					name: el.find('#edit #name').val(),
					description: el.find('#edit #details').val(),
					points: el.find('#edit #points').val(),
					va: el.find('#edit #va').val(),
					vb: el.find('#edit #vb').val(),
					vc: el.find('#edit #vc').val(),
					protein: el.find('#edit #protein').val(),
					calcium: el.find('#edit #calcium').val(),
					carbs: el.find('#edit #carbs').val(),
				});
				f.save({},{success:function(){
					self.renderDetail(item);
				}});
			}});
		});
	}
});

var TrophiesView = Backbone.View.extend({
	render: function() {
		var score = parseInt(user.get('score'));
		this.el.empty();
		this.el.append('<div id="score">Your score: '+score+'\
			<div id="facebook">post to facebook</div>\
			</div>');
		this.el.append('<div id="case">');
		rank = 'Seed';
		this.el.find('#case').append($('<div class="gridEl">').append('<img class="trophy" src="res/seed.png" />'));
		if (score >= 100) {
			rank = 'Sprout';
			this.el.find('#case').append($('<div class="gridEl">').append('<img class="trophy" src="res/sprout.png" />'));
		} if (score >= 200) {
			rank = 'Sapling';
			this.el.find('#case').append($('<div class="gridEl">').append('<img class="trophy" src="res/sapling.png" />'));
		} if (score >= 500) {
			rank = 'Tree';
			this.el.find('#case').append($('<div class="gridEl">').append('<img class="trophy" src="res/tree.png" />'));
		} if (score >= 1000) {
			rank = 'DEKU TREE';
			this.el.find('#case').append($('<div class="gridEl">').append('<img class="trophy" src="res/dekutree.png" />'));
		}
		var self = this;
		var facebook = $('#facebook')
		facebook.click(function(){
			var body = 'I have '+score+' points on ecopanion! Battle me with \
				your ecopanion while saving the environment and making\
				healthy choices on http://grocerapp.nfshost.com/!';
			var pix;
			switch(rank) {
				case 'Seed': pix = 'seed'
				case 'Sprout': pix = 'sprout'
				case 'Sapling': pix = 'sapling'
				case 'Tree': pix = 'tree'
				case 'DEKU TREE': pix = 'dekutree'
			}
			var picture = 'http://grocerapp.nfshost.com/res/' 
				+ pix + '.png';
			var caption = 'I\'m a '+rank+ ' on Ecopanion';
			FB.login(function(response) {
			   if (response.authResponse) {
			     FB.api('/me', function(response) {
		            console.log('Good to see you, ' + response.name + '.');
		          });
			     FB.api('/me/feed', 'post', {
			     		message: body,
			     		picture: picture,
			     		caption: caption
			     	}, function(response) {
			       if (!response || response.error) {
			         alert('Error occured');
			       } else {
			       	alert('Your score has been posted!');
			       }
			     });
			   } else {
			     alert('You cancelled login or did not fully authorize.');
			   }
			 }, {scope: 'email, publish_stream'});
		});
		this.el.append('<div id="rank">Your rank: '+rank+'!</div>')
		this.el.append('<div id="friends"></div>');
		
		var self = this;
		
		self.el.find('#friends').empty().append('<div id="friendsHeader">Your friends:</div>');
		$.each(window.friends, function(idx, friendData){
//			$.each(FAKEDATA, function(idx, friendData){
			var friend = window.users.findByFacebook(friendData.id);
			if (friend) {
				var friendScore = friend.get('score');
				var div = $('<div class="friend">\
					<div id="friendName"></div>\
					<div id="friendTrophies"></div>\
					<div id="friendRank"></div>\
					<div id="friendScore"></div>\
				</div>');
				div.find('#friendName').html(friendData.name);
				div.find('#friendScore').html(friendScore);
				
				var ft = div.find('#friendTrophies');
				var rank = 'Seed';
				ft.append('<img src="res/seed.png" />');
				if (friendScore >= 100) {
					rank = 'Sprout';
					ft.append('<img src="res/sprout.png" />');
				} if (friendScore >= 200) {
					rank = 'Sapling';
					ft.append('<img src="res/sapling.png" />');
				} if (friendScore >= 500) {
					rank = 'Tree';
					ft.append('<img src="res/tree.png" />');
				} if (friendScore >= 1000) {
					rank = 'DEKU TREE';
					ft.append('<img src="res/dekutree.png" />');
				}
				
				div.find('#friendRank').html(rank);
				
				self.el.find('#friends').append(div);
			}
		});
	}
});

window.rankIt = function(score) {
	var rank = 'Seed';
	if (score >= 100) {
		rank = 'Sprout';
	} if (score >= 200) {
		rank = 'Sapling';
	} if (score >= 500) {
		rank = 'Tree';
	} if (score >= 1000) {
		rank = 'DEKU TREE';
	}
	return rank;
};

randomAvatar = function() {
	var avatars = [
		'res/avatar1.png',
		'res/avatar2.png',
		'res/avatar3.png',
		'res/avatar4.png',
		'res/avatar5.png',
		'res/avatar6.png',
	];
	return avatars[Math.floor(Math.random()*avatars.length)];
}

var BattleView = Backbone.View.extend({
	render: function() {
		var el = this.el.empty().append('\
			<div id="chooseText">\
			Choose your opponent!\
			<div id="choose"></div>\
			</div>\
		');
		
		var self = this;
		$.each(window.friends, function(idx, friendData) {
			var opp = window.users.findByFacebook(friendData.id);
			if (!opp) return;
			var div = $('<div id="op">\
				<div id="opname">'+friendData.name+'</div>\
				<div id="opname">'+window.rankIt(opp.get('score'))+'</div>\
				<div id="opname">'+opp.get('score')+'</div>\
			');
			el.find('#choose').append(div);
			div.click(function(){self.renderBattle(friendData)});
		});
	},
	renderBattle: function(friendData) {
		var self = this;
		var el = this.el.empty().append('<div id="battle">\
			<div id="battletext">Battle!</div>\
			<div id="leftPerson"></div>\
			<div id="vs"><img src="res/vs.png" /></div>\
			<div id="rightPerson"></div>\
		</div>');
		
		var renderBattler = function(name, avatar, stats, div) {
			var el = div.html('\
				<div id="batName">'+name+'</div>\
				<div id="batAvatar"><img src="'+avatar+'" /></div>\
				<div id="batStats"></div>\
			');
			var max = 50;
			var barsize = 200;
			$.each(stats, function(stat,val) {
				var statDiv = $('<div id="stat">');
				statDiv.append('<div id="barText">'+stat+': '+val+'</div>');
				statDiv.append($('<div class="bar">').css('width', val/max*barsize+10));
				el.find('#batStats').append(statDiv);
				el.find('#batStats').append('<br />');
			});
		};
		
		var opp = window.users.findByFacebook(friendData.id);

		var myAvatar = randomAvatar();
		var oppAvatar = randomAvatar();

		el.find('#vs').click(function(){
			var victor = user;
			var name = 'Me';
			var avatar = myAvatar;
			var usrscore = 
				user.get('va')+user.get('vb')+user.get('vc')+
				user.get('protein')+user.get('calcium')+user.get('carbs');
			var oppscore = 
				opp.get('va')+opp.get('vb')+opp.get('vc')+
				opp.get('protein')+opp.get('calcium')+opp.get('carbs');
			if (oppscore > usrscore) {
				victor = opp;
				name = friendData.name;
				avatar = oppAvatar;
			}
			self.renderVictory(name, victor, avatar, friendData.name);
		});
		
		var oppStats = {
			'<img src="res/va.png" />Vitamin A': opp.get('va'),
			'<img src="res/vb.png" />Vitamin B': opp.get('vb'),
			'<img src="res/vc.png" />Vitamin C': opp.get('vc'),
			'<img src="res/protein.png" />Protein': opp.get('protein'),
			'<img src="res/calcium.png" />Calcium': opp.get('calcium'),
			'<img src="res/carbs.png" />Carbohydrates': opp.get('carbs')
		};
		
		renderBattler(friendData.name, oppAvatar, 
			oppStats, el.find('#rightPerson'));
		
		var usr = window.user;
		
		oppStats = {
			'<img src="res/va.png" />Vitamin A': usr.get('va'),
			'<img src="res/vb.png" />Vitamin B': usr.get('vb'),
			'<img src="res/vc.png" />Vitamin C': usr.get('vc'),
			'<img src="res/protein.png" />Protein': usr.get('protein'),
			'<img src="res/calcium.png" />Calcium': usr.get('calcium'),
			'<img src="res/carbs.png" />Carbohydrates': usr.get('carbs')
		};
		
		renderBattler("Me", myAvatar, 
			oppStats, el.find('#leftPerson'));
	},
	renderVictory: function(name, victor, avatar, noob) {
		var el = this.el.empty();
		var newScore = name=='Me'? 10:0;
		el.append('<div id="youwon">Victor: '+name+'</div><br>');
		el.append($('<div id="piccontainer">').append('<img id="winnerpic" src="'+avatar+'">')
			.append('<div id="scoreblock">Your Score:<br>\
			<div id="oldscore">'+user.get('score')+'</div>+<div id="newscore">'+newScore+'</div>\
		</div>'));
		user.set({'score':parseInt(user.get('score'))+newScore});
		user.save();

		var post = $('<div id="facebook">post to facebook</div>');
		post.click(function(){
			var body = 'I just won a battle against '+ noob
				+' on ecopanion! Battle me with \
				your ecopanion while saving the environment and making\
				healthy choices on http://grocerapp.nfshost.com/!';
			var picture = 'http://grocerapp.nfshost.com/res/' 
				+ avatar + '.png';
			var data = {
					message: body,
					picture: picture
				};
			FB.api('/me/feed', 'post', data, 
				function(response) {
					if (!response || response.error)
						alert('Error occured');
					else alert('Your score has been posted!');
				}
			);
		});
		
		if (name == 'Me') {
			el.find('#youwon').html('You won the battle!').append(post);
		}
		
	}
});

});