classes.Debugger = {
	id : 'Debugger',
	parent : 'root',
	Init : function(){
		Game.view.el.position({right:this.view.width});
		this.DTabs = $_SYS._New(classes.Debugger.DTabs);
		root.Game.onResize();
		
		//Debugger.Map = _New
	},
	__construct : function(){
		root.Debugger = this; 
		Debugger.Init();
	}, 
	Close : function(){},
	
	view : {
		width : 550,
		__styles : {
			position : {left:'auto'},
			width :  550
		}
	}
}

classes.Debugger.DTabs = {
	objectType : 'classExtend',
	id : 'DTabs',
	parent : 'Debugger',
	parentNode : 'Debugger',
	__construct : function(){ 
		this.DMapTab = $_SYS._New(classes.Debugger.DTabs.DMapTab);
		 
	}, 
	view : {__styles : {position : {}}}
}

classes.Debugger.DTabs.DMapTab = {
	objectType : 'classExtend',
	id : 'DMapTab',
	parent : 'DTabs',
	parentNode : 'DTabs',
	__construct : function(){
		this.DMap = $_SYS._New(classes.Debugger.DTabs.DMapTab.DMap);
		//this.Init();
	}, 
	view : {__styles : {position : {}}}
}

classes.Debugger.DTabs.DMapTab.DMap = {
	objectType : 'classExtend',
	id : 'DMap',
	parent : 'DMapTab',
	parentNode : 'DMapTab', 
	__construct : function(){
		this.view.sel=this.view.el.addChild({id:'DMapBox'}); 
		
	//this.Init();
	
			var grounds = Data.Maps[Game.Level.level_id].Ground, g_type;
			var zoom = 2;
			var minX=0, minY =0;
		for(var g in grounds){
			 
		minX = Math.min(minX,grounds[g]._x); 
		minY = Math.min(minY,grounds[g]._y);
			n = $_SYS.fn.createBlock("DMapBox", {className:"ground", id:("groundMap_"+g), __styles: {
				_X : grounds[g]._x*zoom,
				_Y : grounds[g]._y*zoom,
				width : grounds[g].w*zoom,
				height : grounds[g].h*zoom
			}},true);     
		}
		this.view.sel._X(-1*minX*zoom);
		this.view.sel._Y(-1*minY*zoom); 
		
		  
		this.screenEl = $_SYS._New(classes.Debugger.DSmartScreen,{parentNode : "DMapBox", animate : true, zoom : zoom});
		this.screenCh = $_SYS._New(classes.Debugger.DSmartScreen,{parentNode : "DMapBox", animate : true, zoom : zoom,ListenerSize : 'Game.Hero', id: "screenCh"});
		 
	}, 
	 
	view : {
	__styles : {
			position : {left:10,right:10, top:10, overflow : "hidden"},
			width :  (classes.Debugger.view.width-20)
		}
		}
}

classes.Debugger.DSmartScreen = {  
	objectType : 'classExtend',
	extendOf : 'classes.Debugger',
	
	id : 'DSmartScreen', 
	zoom:1,
	ListenerSize : 'Game',
	onResize:function(){ 
		var o = eval('root.'+this.ListenerSize);
		this.WidthC = o.WidthC;
		this.HeightC = o.HeightC;
		this.view.el.width(this.WidthC*2*this.zoom);
		this.view.el.height(this.HeightC*2*this.zoom);
	},
	__construct : function(_this){
		this.onResize();
		this.comtroller();
		if(this.animate ){$_SYS.Animation.objects[this.id] = this;}
		setTimeout(function(){_this.onResize();},500);
	},
	ListenerID : 'Game.Level.view.Layers.lr._0',
	comtroller : function(){
		//this.xC = (Game.Camera.xC-this.WidthC)*this.zoom;
		this.view.el.XC(Game.Camera.xC*this.zoom);
		this.view.el.YC(Game.Camera.yC*this.zoom);
		//(Game.Camera.xC+Game.HeightC);
	},
	onEntereFrame  : function(){
		this.comtroller();  
	},
	view : {
		__styles : {position:{zIndex : 100}, background:{color : 'rgba(255,255,255,0.7)'}}
	}
}