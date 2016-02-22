classes.Camera = {
	objectType : 'class',
	
	id:'Camera',
	zMax : 10,//Максимальный zIndex (что считать за точку 0) zIndex => zMax - движится в унисон с перс zIndex => 0 - в унисон с фоном. 
	__construct : function(){
		Game.Camera = this; 
			this.onResize(); 
		$_SYS.ScreenResizes.objects.Camera=Game.Camera; 
		$_SYS.Animation.objects.Camera = Game.Camera;
	}, 
	move_old : function(){//старый вариант, не привязан к ширине. Пока оставил, т.к. формула может пригодится
		var _x = -1*Math.round(this.xC*Game.Level.zoom-Game.WidthCZ),
			_y = -1*Math.round(this.yC*Game.Level.zoom-Game.HeightCZ);
			for(var l in Game.Level.view.Layers.lr){ 
				var Layer =  Game.Level.view.Layers.lr[l]; 
				if(!Layer.act){continue;}
				var p =  (1+Layer.zIndex/Game.zMax); 
				Layer.view.el._X(parseInt(_x*p + Layer._xP) );//
				Layer.view.el._Y(parseInt(_y*p + Layer._yP));
		}
	},
	move : function(){
		var _x = -1*Math.round(this.xC*Game.Level.zoom-Game.WidthCZ),//Отн-но левого угла экрана
			_y = -1*Math.round(this.yC*Game.Level.zoom-Game.HeightCZ);  
			var _xM = (this.xC*Game.Level.zoom - this.MainLayerX0)/this.MainLayerWidth , _yM = (this.yC*Game.Level.zoom - this.MainLayerY0)/this.MainLayerHeight; //Расстояние до края слоя  
			var lX,lY;
			for(var l in Game.Level.view.Layers.lr){ 
				var Layer =  Game.Level.view.Layers.lr[l]; 
				if(!Layer.act){continue;}
					//При 0 и max должны совпадать 
					//(this.MainLayerWidth - Layer.Width)/(_xM-_x) (разность полуширин, деленная на 2 - середин)
					//
				if(Layer.zIndex==0||Layer.Width<=1){
			
					var p =  (1+Layer.zIndex/Game.zMax); 
					Layer.view.el._X(parseInt(_x*p) );//
					Layer.view.el._Y(parseInt(_y*p)); 
				}else{ //Game.WidthCZ - размер слоев указан без учета выпуска за пределы экрана, что существенно или нужна парабалическая траектория
				//Прийти должно не в 0, а на расстояние полуэкрана (от  - Game.WidthCZ до Game.HeightCZ)
					
					lX = parseInt(_x +  this.MainLayerX0 - Game.WidthCZ  + ( this.MainLayerWidth - Layer.Width  + 2*Game.WidthCZ) *_xM);
					lY = parseInt(_y +  this.MainLayerY0  -  Game.HeightCZ + ( this.MainLayerHeight - Layer.Height  + 2* Game.HeightCZ)*_yM ) ;
					 Layer.view.el._X(lX)  ; 
					 Layer.view.el._Y(lY);
					 
						if(Layer.zIndex==-4)console.log( _xM,_yM );
				}
		}
	},
	onEntereFrame : function(){ 
		var xC = Game.Hero.xC;
		var yC = Game.Hero.yC;
		if(this.xC == xC && this.yC == yC){return;}
		this.xC = xC; this.yC = yC;  
		this.move();
	},
	onResize : function(){
		//this.xC =  Game.Hero.xC; this.yC = Game.Hero.yC; 
		 // !!!Game.WidthCZ - это ПОЛУ ширина
		 
		var GroundBox = $_SYS.$Get('GroundBox'); 
		this.MainLayerWidth  = GroundBox.Width ;
		this.MainLayerHeight  = GroundBox.Height ; 
		this.MainLayerX0  =  GroundBox.Size.Xmin ;
		this.MainLayerY0  =  GroundBox.Size.Ymin ; 
		console.log(GroundBox.Size,GroundBox.Height,this.MainLayerHeight);
			this.move();
	}
}