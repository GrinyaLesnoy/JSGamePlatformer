classes.Viewed.Characters.Humanoids.Humans = {
	objectType : 'classExtend',
	extendOf : 'classes.Viewed.Characters.Humanoids',
	
	$_import : ['Girls'],

	live : 10,//Кол-во жизней или здоровья
	
	//Событие, происходящее каждый раз, при воиспроизведении анимации
	onEntereFrame: function(){
		this.GravTY= 1; this.GravTX= 0;
		if(this._controller==0){this.controller();}else{ this._controller--; }//для перехвата управления
			
			
			
			if(this.Act=="Zacep"){
				this.Act="Visit";
			}else if(this.actPoseClass=="Visit"||this.actPoseClass=='Vzbiratsya'){ 
			this.Visit();
			}else if(this.actPoseClass=='toJump'||this.jumpIndex>0){
			//Прыжок
				this.Jump(); 
			if(this.Keys["UP"]){ this.Zacep(); } 
			  
			}else{
				var on_ground = this.onGround();
				this.GravTY= on_ground ? 1 : 0;
				if(on_ground&&this.Act!='Fall'){ 
					//if(this.Act=='Fall'){console.log(this.Act);this._controller=1; this.Act='Stand'; this.Keys["DOWN"]=true; }
					if(this.Keys["LEFT"]||this.Keys["RIGHT"]){
						this.NapX=(this.Keys["LEFT"])? -1 : 1;
						this.speedX= 1; 
						if(this.Keys["SHIFT"]){this.speedX= 4; }  
						this.view.changeNap(this.NapX); 
					} else { this.speedX=0; /*this.Act='Stand';*/ }
					
					if((this.actPoseClass =='Sit' || this.actPoseClass == 'Crawl' ) && this.onGround(-1,1)){ this.Keys["DOWN"]=true;}
					
					if(this.Keys["SHIFT"]&&this.actPoseClass!='Stand'){
						this.Lejat();
					}else if(this.Keys["DOWN"]||this.actPoseClass=='Lejat'|| this.actPoseClass == 'Crawl' ){ 
						this.Sit(); 
					} else{  this.Stand(); }
					if(this.actPoseClass == 'Stand' && this.Keys["UP"]){
						this.Zacep();
					}
					this.speedXUPD();
					if( this.Keys["JUMP"] && this.actPoseClass == 'Stand'){this.Jump(1);}
					 
				}else{ 
					if(!on_ground){this.Fall(); } 
					if(this.speedY<=0){
						this._controller= parseInt(this.speedDY/10)-1; this.Act='Stand';this.Keys["DOWN"]=true; this.Keys["SHIFT"]=true; this.actPoseClass='Stand';this.GravTY= 1;  this.Sit(); 
					 }
					 if(this.Keys["UP"]){ this.Zacep(); } 
				}
			}
			this.setPose();
			this.move();
			if(this.Vassals){
				for(var l in this.Vassals){this.Vassals[l].onEntereFrame();}
			} 
		},
		
		global : ['live', 'NapX','NapY','speedX','speedY','Act','actPoseClass'], //Глобальный объект - т.е. может перемещаться между уровнями. Имеет доп. сохранения
	type: 'Humanoids',
	view : {
		bg_zoom : 80,
		pose : {//pose[stand][(speedX<speedMax ? speedX : speedMax)]; 'stand' - для стоящих, 0 - стоит, 1 - идет, 2 - бежит  speedMax = 2;
		//2й - автозаполнение pose: WidthC расчитывается автоматом
			Stand:{
				//Параметры долны быть четными (для исп. полуширины/полувысоты)
				width : 4,// ширина текстуры 
				//WidthC : 2,// полуширина (от центра до края)
				//WidthAct : 4,//активная ширина (может быть меньше или больше ширины текстуры)
				height : 10
				//HeightC : 5,
				//HeightAct : 4,
				,bg : [[0,0]]
				,hend : [0,-3]
			},
			Walk:{ //Идти
				width : 6, 
				WidthC : 4,
				height : 10 
				,bg : function(){	return {x:0, y:900, step : 480, count : 12};	}
				,hend : [1,-3]
			},
			Run:{ 
				width : 10, 
				height : 8 
				,bg : function(){	return {x:0, y:1800, step : 800, count : 7};	}
				,hend : [1,-3]
			},
			StandToSit:{ 
				width : 4, height:8, bg : [[640,0]] 
			}, 
			Sit:{ 
				width : 4, 
				height : 6
				,bg : [[960,0]] 
				},
			CrawlStop : { //На четвереньках 
				width : 10, 
				height : 6, 
				WidthAct : 8,
				HeightAct : 4,
				bg : [[0,6780]],
				lockNap : 'Sit'				
			},
			Crawl:{ //На четвереньках  
				width : 10, 
				height : 6,
				WidthAct : 8,
				HeightAct : 4,
				bg : function(){	return {x:0, y:6780, step : 800, count : 12 };	},
				lockNap : 'Sit'
			},
			LejatToSit : { 
				width : 8, height:4 //Пусть сначала встает на четвереньки
			},  
			Lejat : {
				width : 12, // WidthAct : 10,
				height : 4,
				WidthAct : 10,
				HeightAct : 2,
				bg : [[0,7260]],
				lockNap : 1				
			}, 
			PolztiLeja : {//Ползти лежа
				width : 12, // WidthAct : 10,
				height : 4,
				WidthAct : 10,
				HeightAct : 2,
				bg : [[0,7260]],
				lockNap : 1
			},
			Fall : {
				width : 4, 
				height : 10 
				,bg :  function(){	return {x:0, y:4800, step : 320, count : 3};	},
				hend : [0,-3]
			},
			toJump : {
				index : 0,
				//WidthAct : 4, HeightAct : 4,
				bg : [[0,5650],[320,5650],[640,5650],[960,5650]],
				whAct : [[4,8],[4,4],[4,8],[4,12]],
				wh : [[4,10],[4,8],[4,10],[4,12]],
				//xy : [[1, -2],[-1, -2],[0, -2],[1, 0],[1, 0],[1, 0]]//смещение x y
			},
			Jump : {
				//width : 4,  
				//height : 12,
				bg : [[1280,5650],[1600,5650],[2080,5650] ,[2560,5650],[3040,5650]],
				whAct : [[4,8],[6,8],[6,10],[6,8],[4,8]],
				wh : [[4,10],[6,10],[6,12],[6,10],[4,10]],
				hend : [0,-3],
				noLoop : true
			},
			JumpToFall : { 
				index : 0,
				bg : [[3360,5650],[3980,5650]],
				whAct : [[6,6],[6,6]],
				wh : [[8,8],[8,8]],
				hend : [0,-3]
			},
			Zacep : {
				width : 2, 
				height : 14 
				,bg : [[0,2500]]
				,hend : [0,-3]
			},
			Visit : {
				width : 4, 
				WidthAct:2,
				height : 14 
				,bg : [[0,2500]]  
			},
			Vzbiratsya : {
				count:6, index:0,
				WidthAct : 4, HeightAct : 4,
				width : 6, 
				height : 6, 
				bg : [[320,2500],[800,2500],[1120,2500],[1440,2500],[1920,2500],[2400,2500]],
				whAct : [[4,14]],
				wh : [[6,14],[4,14],[4,12],[6,12],[6,10],[6,6]],
				xy : [[1, -2],[-1, -2],[0, -2],[1, 0],[1, 0],[1, 0]]//смещение x y
			} 
			
		}
	},
	
	
	init : function(a){
		this.addLayer({
		id: "Hero_Pset",
		class:"pset",
		parent: this.parent,
		onEntereFrame: function(){ 
			this.view.el.XC(Game.Hero.xC*main.zoom);
			this.view.el.YC(Game.Hero.yC*main.zoom);
		}
		});
		//this.add(a);
		
	}
}

//Один из классав, описывающих человеческого персонажа. Т.к. специальных методов у него пока нет выносить в отдельный файл не стал 
classes.Viewed.Characters.Humanoids.Humans.Girls = {
	objectType : 'classExtend',
	extendOf : 'classes.Viewed.Characters.Humanoids.Humans'
}