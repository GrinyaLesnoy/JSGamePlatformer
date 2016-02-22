/**== Класс создания и обновления набора слоев ==*/
classes.LayersBox = {
	objectType : 'class', 
	id : 'LayersBox',
	data : 1,//По умолчанию - один слой, однако, передаваемый объект data может содержать целый набор параметров
	_default : 0, 
	lr : {},//Объект для хранения слоев 
	
	dataUpdate : function(){
		if(typeof this.data=="number"){ //Задано кол-во слоев
			if(this._default<0){this._default = this.data-_default;}
			var _c = [];
			for(var i=1; i<=this._default; i++){  _c.push((-1)*i); }
			for(var i=this._default+1; i<this.data; i++){  _c.push({zIndex : (i-this._default)}); }
			this.data=_c;
		} 
		//data[c] может хранить какую угодно инф-цию, но по умолчанию - zIndex
		
		for(var c in this.data){ 
			if(typeof this.data[c]=="number"){ this.data[c]={zIndex : this.data[c]}}
			this.data[c].id = this.parentNode.id+"_layer_"+this.data[c].zIndex; 
			this.data[c].parentNode = this.parentNode; 
			if(this.data[c].zIndex!=0&&this.data[c].subB!==0){
				if(!this.data[c].__fun)this.data[c].__fun={};
				if(!this.data[c].subB)this.data[c].subB=3;
				var subArr=[];
				for(var i=0; i<this.data[c].subB;i++){subArr.push({className: 'subLevel subLevel_'+i});}
				this.data[c].__fun.addChild=subArr;  
			}
		}
	},
	__construct : function(){   
		 this.dataUpdate();  
			this.lr._0 = $_SYS._New(classes.Layer,{id : this.parentNode.id+"_layer_"+0, parentNode : this.parentNode}); 
		 
		this.__update();
	},
	
	__update : function(args){
		for(var l in this.lr){if(l!='_0'){this.lr[l].activate(false);}} 
		if(args){$_SYS.fn._import(this,args); this.dataUpdate();}//Вызов __update с новыыми параметрами 
			console.log(this.lr,this.data);
		for(var c in this.data){   if( this.data[c].id == this.lr._0.id  )continue;//this.data[c] === 0 
			if(!this.lr['_'+this.data[c].zIndex]){ 
				this.lr['_'+this.data[c].zIndex] = $_SYS._New(classes.Layer,this.data[c]);
			}else{
				$_SYS.fn._import(this.lr['_'+this.data[c].zIndex],this.data[c]);
				this.lr['_'+this.data[c].zIndex].activate(true);
				
			} 
		}
	},
	
	onResize : function(){
		var GroundBox = $_SYS.$Get('GroundBox');
		for(var l in this.lr){
			if(!this.lr[l].act || this.lr[l].zIndex==0){continue;} 
			//this.lr[l].Width = this.lr[l].view.el.width();
			//this.lr[l].Height = this.lr[l].view.el.height(); 
			

				if(this.lr[l].Width==1 && GroundBox.Width>0){
				/*
				Формула, при которой ширина при z==0 равна ширене гланого слоя, а при z = max - ширине экрана
				(GroundBox.Width-(GroundBox.Width - 2*Game.WidthCZ)*Math.abs(this.lr[l].zIndex/Game.zMax) -
				Однако, во-первых, нужен отступ как минимум на пол-экрана, используется GroundBox.Width + 2*Game.WidthCZ.  
				Далее, это позволяет упростить формулу
				*/ 
				this.lr[l].Width = 	Math.abs(GroundBox.Width-(GroundBox.Width - 2*Game.WidthCZ)*Math.abs(this.lr[l].zIndex/Game.zMax)); 	
				} 
				if(this.lr[l].Height==1 && GroundBox.Height>0){ 		
				this.lr[l].Height = Math.abs(GroundBox.Height-(GroundBox.Height - 2*Game.HeightCZ)*Math.abs(this.lr[l].zIndex/Game.zMax));	
//console.log(Game.HeightCZ,GroundBox.Height, (1-Math.abs(this.lr[l].zIndex/Game.zMax)), this.lr[l].Height);				
				}  
				this.lr[l].view.el.width(this.lr[l].Width);
				this.lr[l].view.el.height(this.lr[l].Height);
		}
	}
}

/**== Класс одного слоя ==*/
classes.Layer = {
	objectType : 'class',
	
	className : "Layer",
	zIndex : 0, 
	//parent : parentID,
	_xP :0,//Отклонение слоя от координаты 0
	_yP :0,
	Width: 1,
	Height: 1,
	act:true,
	
	__construct : function(){this.view.el.ZC(this.zIndex);this.view.el.addClass("Layer"); },
	 
	
	view : true,
	
	activate : function(a){ if(!a){this.Height=1;this.Width=1;} this.act=a; this.view.el[a ? 'show' : 'hidde']();  }
}