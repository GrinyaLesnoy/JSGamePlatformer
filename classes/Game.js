classes.Game={
	objectType : 'class',
	classesName : 'Game',
	id : 'Game',
	parent : 'root', 
	
	zMax : 10,//Максимальный zIndex (что считать за точку 0) zIndex => zMax - движится в унисон с перс zIndex => 0 - в унисон с фоном. 
	
	zoom : function(e){
		return (this.Level.zoom ? this.Level.zoom*e : e);
	},
	
	onEntereFrame : function(){ 
	
	},
	
	onResize : function(){
		this.WidthCZ = Game.view.el.WidthC();
		this.HeightCZ = Game.view.el.HeightC();
		this.WidthC = Math.round(this.WidthCZ/Main.zoom);
		this.HeightC = Math.round(this.HeightCZ/Main.zoom);
	},
	
	//Соответствие клавиатурных кнопок игровым (чтобы можно было переназначить)
	keysControll : {
		"LEFT" : "LEFT",
		"RIGHT" : "RIGHT",
		"UP" : "UP",
		"DOWN" : "DOWN",
		"SHIFT" : "SHIFT",
		"JUMP" : "Z",
		"X" : "X",
		"A" : "A",
		"CTRL" : "CONTROL"
	},
	
	// Сохранение/Загрузка состояния игры
	Save : {
		_saves : {
			auto : { },//Автоматическое сохранение
			global : {}//Доп. сохр. для глобальных объектов
		},
		save_id : 0,
		Write : function(save_id){
			var save_id = save_id ? save_id : 'auto';
			var level_id = Game.Level.level_id;//Получаем id текущего уровня
			 this._saves[save_id].level_id=level_id;//Записываем id текущего уровня (для послед. загрузки. )
			if(save_id!='auto'){delete this._saves[save_id]; this._saves[save_id]= $_SYS.fn.clone(this._saves.auto);}//Если сохранение под новым id - клонировать
			this._saves[save_id][level_id]={};//Создаем новые записи для уровня
			var save = this._saves[save_id][level_id]; 
			
			for(var e in Game.Level){ //Перебор объектов, находящихся в уровне
				//Если это какой-то запасной (не активный) объект или не имеет параметров для сохранения - пропустить
				if(Game.Level[e].status!=1||!Game.Level[e].save){ continue;}
				//Перебераем объекты, перечисленные в массиве save объекта
				save[e]={};
				for(var s in Game.Level[e].save){
					save[e][Game.Level[e].save[s]] = Game.Level[e][Game.Level[e].save[s]]; (typeof Game.Level[e][Game.Level[e].save[s]]== 'object') ? $_SYS.fn.clone(Game.Level[e][Game.Level[e].save[s]]) : Game.Level[e][Game.Level[e].save[s]]; 
				}
				//Отдельная переборка для объектов, имеющих глобальные св-ва (способные перемещаться между уровнями)
				if(Game.Level[e].global){ 
					this._saves.global[e] ={};
					for(var g in Game.Level[e].global){
						this._saves.global[e][Game.Level[e].global[g]] = Game.Level[e][Game.Level[e].global[g]];
					}
				};  
			}
		},
		Load : function(save_id, global){
			 
			var save_id = save_id ? save_id : 'auto'; 
			var level_id = this._saves[save_id].level_id; 
			//classes.Level.add(level_id);//Грузим уровень ! Не грузим - это будет другая ф-ция делать
			if( level_id && this._saves[save_id][level_id]){//Если записей для этого уровня нет или не удалось получить текущий уровень - пропускаем
			var save = this._saves[save_id][level_id];
			for(var e in save){
				for(var s in save[e]){
					Game.Level[e][s] = (typeof save[e][s]== 'object') ? $_SYS.fn.clone(save[e][s]) : save[e][s]; 
				}
			}
			}
			if(global && save_id == 'auto'){//Глобальные - только для автосохранений
				for(var e in this._saves.global){
					for(var g in this._saves.global[e]){
						 Game.Level[e][g] = this._saves.global[e][g];
					}
				}
			}
		}
	},
	 
	 margeLevels : function(id){
		if(Data.Maps[id]._protoID_){
			this.margeLevels(Data.Maps[id]._protoID_);
			Data.Maps[id] = $_SYS.fn.marge(Data.Maps[Data.Maps[id]._protoID_],Data.Maps[id]); 
			delete Data.Maps[id]._protoID_;
		} 
	 },
	 
	__construct: function(_this){
		if(this.view.$ClassStyle )$_SYS.CSS.update(this,this.view.$ClassStyle);
		root.Game = this;
		root.Game.onResize();
		
		//Слияние уровней с их прототипами
		for(var i in Data.Maps){if(Data.Maps[i]._protoID_)this.margeLevels(i);}
		
		$_SYS._New(classes.Level, {level_id : 'Level_0'});
		Game.VirtualController = $_SYS._New(classes.VirtualController);
		$_SYS.Animation.objects.Game = this;
	},
	Screen : {
	
		startScreen : {
			init : function(){
				var $block = $_SYS.fn.createBlock("root", {id: 'startScreen'});
				$block.addChild({id:'Start'});
				$block.addEventListener('mouseup', Game.VirtualController.keyUp, false);//root.touchscreen=true;
				$block.addEventListener('touchend', Game.VirtualController.keyUp, false);
			},
			remove : function(_next){//next - игра, опции и т.д.
				$_SYS.fn.removeBlock({id: 'startScreen'});
				this[_next].init();
			}
		},
		levelScreen :{
			init : function(){
				classes.Level.add('Level_0');
			}
		}
	},
	
	
	view : {
		$ClassStyle : {
			'#Game, .Level' : {overflow:'hidden', left:0, top:0, right:0, bottom:0, 'z-index':1}
		}
	
	}
} 


$_SYS.Save = {
	tmp : {},
	Save : function(){this.tmp = $_SYS.fn.clone(Game);},
	Load : function(){Game = $_SYS.fn.clone(this.tmp);}
}

