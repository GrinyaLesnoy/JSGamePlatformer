classes.Level = {
	objectType : 'class',
	
	parent: 'Game', 
	className: 'Level',
	id: 'Level',
	
	appyMap : function(){
	
	},
	
	
	
	add : function(){ 
		$_SYS.Animation.stop();
		
		//var _levels = (Data.Maps[this.level_id].Layers )? Data.Maps[this.level_id].Layers : [1,0]; 
		//Заменить на _New
		//$_SYS.Layers.add(Game.Level, _levels);
		var _levels = (Data.Maps[this.level_id].Layers )? {data : Data.Maps[this.level_id].Layers} : {}; 
		_levels.parentNode = this.view.el; 
		if(!this.view.Layers){this.view.Layers = $_SYS._Update(classes.LayersBox, _levels); }
		else{this.view.Layers.__update(_levels);}
		//this.view.Layers = $SYS._New({parentNode : this.view.el, parent: this.id,});
		this.map={};//Объект, где хранится вся инф. о препятствиях
		//Data.Maps.add(level_id);
		this.GroundBox = $_SYS._Update(classes.Viewed.Ground,{id:'GroundBox', parentNode : this.view.Layers.lr._0.view.el});
		
		/**/if(!this.Gates){this.Gates = $_SYS._New( {id:'Gates', parentNode : this.view.Layers.lr._0.view.el, Gate : {}} );}else{
			for(var _key in this.Gates.Gate ){this.Gates.Gate[_key].view.el.hidde();}
		}
			for(var _key in Data.Maps[Game.Level.level_id].Gate ){
				 Data.Maps[Game.Level.level_id].Gate[_key].index = _key;
				 var _gtOpt = $_SYS.fn._import({},Data.Maps[Game.Level.level_id].Gate[_key]);
				 _gtOpt.parentNode = this.view.Layers.lr._0.view.el;
				  _gtOpt.id = 'gate_'+_gtOpt.index;
				  
				this.Gates.Gate[_gtOpt.id] = $_SYS._Update(classes.Viewed.Characters.Static.Gate, _gtOpt); 
				//if(this.map){this.__remove();}//скрытие старой карты
				//this.Size = {Xmin : 0, Ymin : 0, Xmax : 0, Ymax : 0};
				//this.map = Data.Maps[Game.Level.level_id].Ground;
				//for(var g in this.map){ this.box(this.map[g],g,'add');} 
				//this.Width =  (this.Size.Xmax - this.Size.Xmin); this.Height =  (this.Size.Ymax - this.Size.Ymin); 
				//if(Game.Level.view.Layers.onResize)Game.Level.view.Layers.onResize();
			
			}
		
		if(!this.Hero){
			var Hero = {id:'Hero', parentNode : this.view.Layers.lr._0.view.el, parent : 'Game.Level',controlling: true};}
			//Hero=$_SYS.fn._import(Hero,Data.Maps[this.level_id].Characters.Hero);
			this.Hero = $_SYS._Update(classes.Hero,Hero||{id:'Hero'});  
			 
		//}else{this.Hero.__update();} 
		
		var CameraDate =  Data.Maps[this.level_id].Camera || {};
		//$_SYS._Update(classes.Camera, Data.Maps[this.level_id].Camera);
		$_SYS._Update(classes.Camera, CameraDate);
		for(var e in Data.Maps[this.level_id]){ 
			if(e == "zoom"){this[e] = Data.Maps[this.level_id][e]; continue;}
			console.log(e);
			//Заменить на _New
			//if(classes[e]&&classes[e].add)classes[e].add(Data.Maps[this.level_id][e]); 
			
		} 
		//Game.Level.view.Layers.onResize();
		//Game.Save.Load();
		Game.Save.Write();
		Game.play=true;
		//$_SYS.Animation.start();
		//classes.Charters.add('Hero');
	},
	
	getMap : function(x,y,c){//Получение карты занятых точек
			var g = false;
			var p = Game.Level.map[x+'_'+y];
			if(c=='zacep'){
				if(p=='g_z'||p=='g_zl'||p=='g_zr'){
					return ['zacep', ((p=='g_zl')? -1 : (p=='g_zr') ? 1 : 0)];
				}else{return false};
			}
			if(p && p!='w'){return 'ground';}
			return false;
		},
		
	__construct : function(){
		 
		Game.Level = this;
		this.zoom  = (main.zoom ? main.zoom : 1); 
		this.add();
	},
	
	__update : function($a){//обновление объекта, вызывается, если уже существует
		this.remove(); 
		this.level_id = $a.level_id;
		var _this = this;
		//setTimeout(function(){_this.add();$_SYS.Animation.start();},200);
		this.add(); 
		Game.Save.Write()
		if(this.view.$ClassStyle )$_SYS.CSS.update();
		$_SYS.Animation.start();
	},
	
	remove : function(save){ 
		$_SYS.Animation.stop();
		if(save!==false){
			Game.Save.Write();
		}
		for(var e in Data.Maps[this.id]){ 
			if(e == "zoom"){ continue;} 
			classes[e].add(Data.Maps[Game.Level.id][e]); 
		}
	},
	view : {
		$ClassStyle : {
			'.$' : {'z-index':2},
			'.$ > div' : { 'z-index':100},
			'#Level,.Layer.Bg_Layer' : {background: '#E0B39F url("<%path:bg%>/default/sky.jpg") 0 0 repeat-x' },
			'.Layer.Bg_Layer .subLevel_0' : {
				background:  'url("<%path:bg%>/default/planets_in_sky.jpg") 100% 0 no-repeat',
				'z-index':1, 'top':0, 'right':0,'bottom':0, 'width':400 
			},
			'.Layer.Ground' : 'template:Ground',
			'<%Ground%>_<=[0,1,2]=> .subLevel_2' : { 
				background: 'url("<%path:bg%>/default/ground.jpg") repeat-x 0 100%',
				top:'50%', left:0, right:0, bottom:0,  'z-index':2
			},
			'<%Ground%>_0  .subLevel_0' : {
				background:'url("<%path:bg%>/default/dymka_1.png")  repeat-x 0 0',
				'margin-top':-10, top:'50%', left:0, right:0,bottom:'40%', 'z-index':5
			},  
			'<%Ground%>_1  .subLevel_2':{top:'65%'},
			'<%Ground%>_2  .subLevel_2':{top:'80%'}
		}
	}
}