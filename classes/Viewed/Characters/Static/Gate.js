/**
Объект Врат. Отвечает за переход персонажа между подуровнями
Содержит управление самоактивацией, а так же сведения о точке перехода
**/
 
classes.Viewed.Characters.Static.Gate = {
	objectType : 'classExtend',
	extendOf : 'classes.Viewed.Characters.Static',
	act : false,
	className : 'Gate',
	__update : function(data){
		//if(this.map)
		if(data)$_SYS.fn._import(this,data);
		//this.view.resize(this.WidthC,this.HeightC);
		//this.move(this.xC,this.yC);
		var _this = this;
		_this.act=false;
		//setTimeout(function(){_this.act=true;},2000);
		//this.view.el.XC(this.xC).YC(this.yC);
		 
		this.view.el.show();
		this.move(this.xC,this.yC); 
		this.lock();
	}, 
	//Защита от случайного повторного срабатывания
	lock : function(){if(!Game.LockGates){Game.LockGates = true; setTimeout(function(){Game.LockGates=false;},1000);}},
	Go : function(){
		this.lock();
		if(this.LevelID!=Game.Level.level_id){
			//Переход на новый уровень		
			Game.Hero.gate = 'gate_'+this.GateID;
			Game.Level.__update({level_id:this.LevelID});	
		}else if(this.GateID!=this.MapID){
			//Внутри одного уровня	
				var _gate = Game.Level.Gates.Gate['gate_'+this.GateID];
				Game.Hero.gate = 'gate_'+this.GateID;
				Game.Hero.move(_gate.xC, _gate.yC);
				}
		console.log('Gate',Game.Level.level_id,this.MapID,'=>',this.LevelID, this.GateID );
	},
	onEntereFrame : function(){ if( !Game.LockGates && Game.Hero.Keys["UP"]&&this.hitTest(Game.Hero))this.Go();  },
	//__construct : function(_this){this.__update();} 
	view: {
		$ClassStyle : {
			'.$' : {
			  'box-shadow' : '0px 0px 5px 5px rgba(255,125,0, 0.3)',
			  'border-radius' : '5px'
			 }
		}, 
		pose : {
			Stand:{
				width : 10,
				height : 10,
				WidthAct : 2
				
			}
			}
		}
	}