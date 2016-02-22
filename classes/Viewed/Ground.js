classes.Viewed.Ground = { 

	objectType : 'classExtend',
	extendOf : 'classes.Viewed',
	
	id : 'GroundBox',//id по умолчанию
	
	__construct : function(){
		if(this.view.$ClassStyle )$_SYS.CSS.update('ground',this.view.$ClassStyle);
		this.__update();
	},
	
	Width : 0,
	Height : 0,
	Size : {Xmin : 0, Ymin : 0, Xmax : 0, Ymax : 0},//Мин/Max значения. Позволяют в последствии определить ширину/высоту слоя
	box : function(gr,i,act){ 
		if(act)act=act.toLowerCase();
		
		if(act=='add'){
			this.Size.Xmin = Math.min(this.Size.Xmin, Game.zoom(gr._x));//Обн. Мин/Max значения
			this.Size.Ymin = Math.min(this.Size.Ymin, Game.zoom(gr._y)); 
			this.Size.Xmax = Math.max(this.Size.Xmax, Game.zoom(gr._x+gr.w)); 
			this.Size.Ymax = Math.max(this.Size.Ymax, Game.zoom(gr._y+gr.h));
		}
		
		for(var x=gr._x; x<=(gr._x+gr.w); x++){
				for(var y=gr._y; y<=(gr._y+gr.h); y++){
					if(act=='add'){
						var g_type = gr.type ? gr.type : 'g';//По умолчанию - тип 'g' - земля (ground) 
						Game.Level.map[x+'_'+y] = g_type;
					}else{ delete Game.Level.map[x+'_'+y]; }
				}
			}
			if(act=='add'){
				//Зацепы (автоматом лучше не делать, чтобы не срабатывало когда не надо)
				if(gr.lc){Game.Level.map[gr._x+'_'+gr._y]+='_zl';}
				if(gr.rc){Game.Level.map[(gr._x+gr.w)+'_'+gr._y]+='_zr';} 
				if(!this.view.gr[i])this.view.gr[i] = this.view.el.addChild({id: 'ground_'+i});  
				this.view.gr[i].className = 'ground';
				this.view.gr[i]._X(Game.zoom(gr._x)); this.view.gr[i]._Y(Game.zoom(gr._y)); 
				this.view.gr[i].width(Game.zoom(gr.w)); this.view.gr[i].height(Game.zoom(gr.h)); 
				this.view.gr[i].show();
			}else{
				if(act=='delete'){
					this.view.gr[i].remove(); delete this.view.gr[i];
				}else{
					this.view.gr[i].hidde();
				}
			}
	},
	__update : function(){
		if(this.map){this.__remove();}//скрытие старой карты
		this.Size = {Xmin : 0, Ymin : 0, Xmax : 0, Ymax : 0};
		this.map = Data.Maps[Game.Level.level_id].Ground;
		for(var g in this.map){ this.box(this.map[g],g,'add');} console.log('GMAp',this.map);
		this.Width =  (this.Size.Xmax - this.Size.Xmin); this.Height =  (this.Size.Ymax - this.Size.Ymin); 
		if(Game.Level.view.Layers.onResize)Game.Level.view.Layers.onResize(); 
	},
	__remove : function(){for(var g in this.map){  this.box(this.map[g],g); }},
	__destruct : function(){for(var g in this.map){  this.box(this.map[g],g,'delate'); }},
	
	view: {
		gr : {},//Здесь хранятся объекты
		$ClassStyle : {
			'.ground' : { 
				width:10, height:10,
				'box-shadow': 'inset 0px 1px 1px 1px rgba(255,255,255,0.5), inset 0px -1px 1px 1px rgba(0,0,0,0.7)',
				background: '#333 url("Data/textures/ground01.gif")' 
			 }
		}
		}
}