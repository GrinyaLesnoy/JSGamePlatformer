/**
Объект управляемого персонажа. Вынесен вне цепочки классов, т.к., по сути, может быть расширением любой цепочки классов персонажей
**/
classes.Hero = {
	objectType : 'classExtend',
	extendOf : 'classes.Viewed.Characters.Humanoids.Humans.Girls',
	
	className : 'Hero',
	$style : {
		//background : ''
	},
	live : 10,//Кол-во жизней или здоровья
	global : ['live', 'NapX','NapY','speedX','speedY','Act','actPoseClass'], //Глобальный объект - т.е. может перемещаться между уровнями. Имеет доп. сохранения
	
	 gate : "gate_0",//Врата. 
	 
	_controller : 0,
	controller : function(){ 
		for(var k in Game.keysControll){ 
			this.Keys[k] = $_SYS.Key.isDown(Game.keysControll[k]);
		}
	},
	__update : function(){//При переходе на новый уровень
		
		var _gate = Game.Level.Gates.Gate[this.gate];
		console.log(_gate.xC, _gate.yC, this.xC,this.yC);this.move(_gate.xC, _gate.yC);console.log(this.gate,_gate.xC, _gate.yC, this.xC,this.yC, Game.Hero.xC, Game.Hero.yC); 
	},
	init : function(a){
		if(!this.Vassals)this.addVassal({
		id: "Hero_Pset",
		class:"pset",
		parent: this.parent,
		onEntereFrame: function(){ 
			this.view.el.XC(Game.Hero.xC*main.zoom);
			this.view.el.YC(Game.Hero.yC*main.zoom);
		}
		});
		//this.add(a);
		
	},
	view : {
		vId : 'Hero',
		$ClassStyle : {
			'.debug #Hero':{ 'box-shadow': '0px 0px 1px 1px rgba(255,0,0, 0.5)'},
			'.debug #Hero_Pset':{ width:1, height:1, 'box-shadow' :'0px 0px 2px 2px rgba(255,0,0, 0.5)'}
		}
	}
}

 