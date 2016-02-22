/**
Разширение для статичных персонажей (а точнее - объектов):
То, что не может двигаться, но может взаимодействовать: от не способных двигаться персонажей, до предметов и выключателей
 **/

classes.Viewed.Characters.Static = {
	
	objectType : 'classExtend',
	extendOf : 'classes.Viewed.Characters' ,
	$_import : [ 'Gate'],
	
	_controller : 0,
	controller : function(){ 
		for(var k in Game.keysControll){ 
			this.Keys[k] = $_SYS.Key.isDown(Game.keysControll[k]);
		}
	}
	
	}