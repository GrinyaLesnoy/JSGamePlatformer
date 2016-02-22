/**
"Персонаж" в широком смысле. Все объекты способные к взаимодействию (От игровых персонажей до обрушивающийся плитки и всяких предметов)
**/
classes.Viewed.Characters = { 
	objectType : 'classExtend',
	extendOf : 'classes.Viewed',
	$_import : ['Humanoids', 'Static'],
	
	//this.global : true,//Если все физ. объекты сохраняют свои свойства				
				 
					
		//В этих переменных хранится информация о состояниях (позах) персонажа (сидит, стоит, бежит и т.д., в том числе, включен/выключен для предметов и т.п.)			
		Act : 'Stand',//Активная поза персонажа. По умолчанию - он стоит на месте
		actPoseClass : 'stand', //Активный класс поз : стоячие, сидячие и т.д. В отличаи от Act - это скорее "положение", чем поза: к примеру, 'stand' - стоячее положение - включает в себя стояние на месте, хотбу и бег. Необходимо для обобщения, когда надо проверить, что, например, персонаж в стоячем, а не сидячем положении (а не что конкретно он делает). По умолчанию - стоящие 
		
		//Точки гравитации - "центра тяжести" относительно которого происходят все изменения (к примеру, в воздухе или воде - отн-но центра персонажа, а на земле - относительно пола)
		GravTX: 0,// По X - от центра (1 - спереди, (-1) - сзвди)
		GravTY: 1,// По Y - снизу ( (-1) - снизу) 
		

	
	//Применяет заданую "позу" к персонажу
	setPose : function(){
			
		if(this.actPoseClass){ 
			 //console.log(this.Act );
			if(this.Act != this.view.Act || this.pose[this.Act].whAct){
				//var newAct = (this.Act != this.view.Act)? true : false;//Это новая поза или прежняя 
				if(this.Act != this.view.Act)this.view.setPose(this.Act);  //Только, если это была новая поза
				var x=this.xC,y=this.yC;
				
				
				if(this.pose[this.Act].whAct){
					this.WidthC =  this.pose[this.Act].whAct[this.view.BgIndex][0] ;
					this.HeightC = this.pose[this.Act].whAct[this.view.BgIndex][1] ;
					//console.log(this.pose[this.Act].whAct, this.view.BgIndex, this.WidthC); 
					
				}else{
					this.WidthC =  this.pose[this.Act].WidthC;
					this.HeightC = this.pose[this.Act].HeightC;
				}
				
				if( this.lastPose && this.pose[this.lastPose.Act]){ 
				 
					 //Изменение положения
					 /*суть в том , что если персонаж висит в воздухе - все происходит отн-но центра
					 но, к примеру, если он стоит на земле - все должно происх отн-но точки опоры
					 т.е.: берется расстояние прежнее от Y до земли и считается, каково должно быть расстояние теперь (x+(a-b))
					 
					 */
					  
					x +=  $_SYS.fn.delta(this.lastPose.WidthC,this.WidthC,1)*this.GravTX *this.NapX;
					 y +=  $_SYS.fn.delta(this.lastPose.HeightC,this.HeightC,1)*this.GravTY *this.NapY;
					 
				} 
				 
				/*this.WidthC = this.pose[this.Act].whAct ? this.pose[this.Act].whAct[0][0] :this.pose[this.Act].WidthC;
				this.HeightC = this.pose[this.Act].HeightC;*/ 
				
				//this.lastPose = this.Act;  
				this.view.GravTX=this.GravTX;
				this.view.GravTY=this.GravTY;
				
				
				//if(dx){x+= parseInt(1.5*dx)*this.NapX;} if(dy){y+= parseInt(1.5*dy)*this.NapY;;}  
				
				if(this.view.pose[this.Act].xy){ //Если в шаблоне еще и смещение задано
				x+=this.NapX*this.view.pose[this.Act].xy[this.view.BgIndex][0];
				y+= this.NapY*this.view.pose[this.Act].xy[this.view.BgIndex][1];
				//console.log(this.view.pose[this.Act].xy[this.view.BgIndex][0],this.view.pose[this.Act].xy[this.view.BgIndex][1]);
				 
			} 
				 this.move(x,y);
				this.view.changePose();
			}else if(this.view.pose[this.Act].bg&&this.view.pose[this.Act].bg.length>1){
			
			//if(this.view.pose[this.Act].xy){ this.move((this.xC+this.NapX*this.view.pose[this.Act].xy[this.view.BgIndex][0]),(this.yC+this.NapY*this.view.pose[this.Act].xy[this.view.BgIndex][1]));  } 
			
				this.view.changePose();//проверка this.view.pose[this.Act].bg.length - нужна для экономии ресурсов
			}
			
			this.lastPose = {//Информация о предыдущей позе - для пересчета
							Act : this.Act,
							WidthC : this.WidthC,
							HeightC: this.HeightC
					 }
			/*
				Добавить:
				- позы м динамическим изменением ширины/высоты (для эк ресурсов, динам/стат определяется при смене позы отдельн параметром)
				- задний ход (BgIndex на уменьшение)
				- однократный цикл
			*/
			
		}
	},
					
	//Проверка персонажа на соприкосновение с поверхностью по вертикале (по умолчанию - стоит ли он на земле)
	//В некоторых случаях способна самостоятельно незначительно корректировать положение персонажа
	onGround : function(ny, dy, centr){
		if(!dy)dy=0;//Смещение по Y - по умолчанию, с краю
		var centr=true;//пока поставим принудительно по центру
		var ground = false, p, correct = ny ? false : true;
		//correct - корректировать ли положение персонажа, если он заехал дальше/ближе чем надо (если функцияция вызвана с параметром - то нужен просто результат без коррекции) 
		var W2k = ( centr || this.WidthC < 2 ) ? 0 : (this.WidthC - 1);//Края не беруться (-1). Если ширина не более 4х - достаточно проверить 1 центр. точку/ Или если принудительно запрашивается только одна центральная точка (centr) (например, при проверке можно ли разогнуться в полный рост или сверху глыба) 
		//console.log(Game.Level.map[this.xC+'_'+(this.yC+this.HeightC)], this.xC+'_'+(this.yC+this.HeightC));
		//this.NapY: вначале была просто 1 - заменил для унификации ф-ции (определение, когда стукнится лбом)
		if(!ny){var ny = this.NapY;}
		var YKray = this.yC+(this.HeightC+dy)*ny;
		//Ступенька
		if(correct && Game.Level.getMap(this.xC,(YKray- ny))=='ground') {this.speedY=(-1)*ny; return true;}
		for(var x=(this.xC - W2k); x<=(this.xC + W2k); x++){//Края не беруться 
				if(Game.Level.getMap(x,YKray)=='ground'){ground = true; this.speedY=0;}
				
			} 
		if(correct && ground == false && Game.Level.getMap(this.xC,(YKray+ ny))=='ground') {this.speedY=ny; return true;}	  
		 //if(ground)console.log('c');
		return ground;
		
	},
					
	//Уменьшает номинальное смещение персонажа, с учетом препятствия по горизонтале (X)
	speedXUPD : function(){ 
		if(this.speedX==0){return;}
		var p, speedX = 0;
		for(speedX=0; speedX<this.speedX; speedX++){  
			if(
			Game.Level.getMap((this.xC + this.WidthC*this.NapX + speedX*this.NapX),this.yC)=='ground'
			||
			Game.Level.getMap((this.xC + this.WidthC*this.NapX + speedX*this.NapX),(this.yC-this.HeightC+1))=='ground'
			){break;}
				
		}
		//console.log(this.speedX, speedX);
		this.speedX = speedX;
	},
	
	
	
					
	//Генерит текстуру "на лету" из текущий (когда, например, надо застыть в текущем положении)
	appyPose : function(p,_from,index){
		if(!_from)var _from=this.Act;//Взфть заданую или текущую активную
		//index - массив желательных индексов (от меньшего к большему). По умолчанию берется текущий (иногда текущий может не подходить)
		if(index){
			var tmp=index[0];//По умолчанию берется 1й элмент
			for(var i in index){if(index[i]>=this.view.BgIndex){tmp=index[i]; break;} }//Ищит следующий подходящий после текущего
			index=tmp;
		}else{
			//Если будут ошибки с неправильным индексом - можно взять такую еончтр. var index= this.view.BgIndex<this.view.pose[_from].bg.length ? this.view.BgIndex : 0; 
			var index= this.view.BgIndex; 
		}
		if(!this.view.pose[p]){this.view.pose[p]=$_SYS.fn.clone(this.view.pose[_from]);}
		if(!this.pose[p]){this.pose[p]=$_SYS.fn.clone(this.pose[_from]);}
		this.view.pose[p].bg=[(this.view.pose[_from].bg[index])];
		this.view.pose[p]['BgIndex_'+_from]=index;
		this.Act=p;
	},
	
		// создание массива текстуры из функции (упрощает ручную запись)
		// анимация текстур происходит посредством сдвигания текстурного изображения в каждую еденицу времени на заданные в массиве координаты. Иногда массив в ручную писать лень.
	setBGArray : function(o){var a=[], x; if(!o.speed){o.speed=1;} for(var x=0; x<o.count; x++){for(var i=0; i<o.speed; i++){a[a.length]=[(x*o.step+o.x),o.y];}} return a;},
	
	view : {
		BgIndex : 0,
		
		pose : {
			Stand:{
				/* 
				Кроме значение bg все остальные задаются в относительных величинах игры!
				
				width : 4,// ширина отображения персонажа (dom-объекта) в  относительных ед. (должна быть четным числом, для корректного вычисления полуширины) 
				height : 10,// Высота   
					WidthC : 2,// полуширина (от центра до края) - задавать не нужно, сейчас вычисляется автомат.
					HeightC : 5,// полувысота
					
				//"активная" ширина и высота  - реальная ширина и высота персонажа. по умолчанию, размеры персонажа и его отображения равны, но для корректного отображения некоторых текстур приходится вручную задавать их разными. Взаимодействие с другими персонажами происходят именно по ней. По умолчанию задается автомат. 
				WidthAct : 4,
				HeightAct : 4,
				
				//Для сложных текстур порой нужно динамически менять размеры отображения персонажа (нужно для компактности карты текстур - иначе бы пришлось создавать на ней большие пустые области для некоторых движений с большим диапазоном изменений размеров либо распихивать все это по отдельным позам)
				wh : [[4,10],[4,8],[4,10],[4,12]],
				//Тоже, что и WidthAct и HeightAct при заданом wh
				whAct : [[4,8],[4,4],[4,8],[4,12]],
				
				bg : [[0,0]], массив анимированных текстур (массив кадров, каждый кадр - массив с координатами x,y на карте текстур (в масштабе карты). Может быть задан как ввиде массива вида [ Кадр0[x,y], Кадр1[x,y],...], так и ввиде функции вида function(){ return {x:0, y:900, step : 480, count : 12}; }, где x,y - начальные точки на карте текстур, step - "шаг" между кадрами текстуры, count - кол-во кадров
				lockNap : 'Sit' - блокировка зеркального отражения объекта при смене направления. Значение любое не false. Планируется создание возможности смены направления через указаную позу (например, сесть чтобы развернуться)
				,hend : [1,-3] - указывает местоположение начала руки от центра - необходимо в тех случаях, когда нужно определение способности персонажа дотянутся до чего-либо (например, ухватиться в прыжке за край платформы
				index : 0,
				*/
				//width : 0,
				//height : 0,
				//bg : [[0,0]]
			},
		},
		
		setPose : function(p, newAct){ 
			this.BgIndex=0;
			//if(){}
			 if(this.Act && this.pose[this.Act]['BgIndex_'+p]) {
				this.BgIndex =  this.pose[this.Act]['BgIndex_'+p]+this.HodX;
				this.BgIndex = (this.BgIndex >= this.pose[p].bg.length) ? 0 : (this.BgIndex < 0)?  (this.pose[p].bg.length-1) : this.BgIndex;
			 } 
			this.Act = p; 
			if(this.pose[this.Act].wh){
				this.pose[this.Act].WidthC =  this.pose[this.Act].wh[this.BgIndex][0];
				this.pose[this.Act].HeightC = this.pose[this.Act].wh[this.BgIndex][1];
			} 
			this.resize(this.pose[this.Act].WidthC, this.pose[this.Act].HeightC);  
				//this.view.move(this.xC,this.yC);
		},
		HodX : 1,//1 | -1 - передний/задний ход
		changePose : function(){ 
			if(!this.pose[this.Act].bg)return;
			if(this.pose[this.Act].wh){
				this.pose[this.Act].WidthC =  this.pose[this.Act].wh[this.BgIndex][0];
				this.pose[this.Act].HeightC = this.pose[this.Act].wh[this.BgIndex][1];
				this.resize(this.pose[this.Act].WidthC, this.pose[this.Act].HeightC); 
				 
			}
			this.sel.background({position : {x : (-1)*this.pose[this.Act].bg[this.BgIndex][0], y: (-1)*this.pose[this.Act].bg[this.BgIndex][1]}});
			  
			if(this.pose[this.Act].noLoop){ 
				var max = ((this.HodX+1)/2)*(this.pose[this.Act].bg.length-1);
				if(this.BgIndex ==  max){ return;} 
			}
			this.BgIndex+=this.HodX;//Реализация заднего хода
			this.BgIndex = (this.BgIndex >= this.pose[this.Act].bg.length) ? 0 : (this.BgIndex < 0)?  (this.pose[this.Act].bg.length-1) : this.BgIndex;
			
		},
		NapX:1,
		changeNap : function(NapX){ 
			if(this.lockNap || this.pose[this.Act].lockNap){this.HodX= (this.NapX==NapX)? 1 : -1;  return;}
			this.HodX=1; 
			if(this.NapX==NapX){return;} 
			this.NapX=NapX; 
			//this.sel.scale(this.NapX,1);
			this.sel.mirror('x', NapX);
		},
		GravTX: 0,// По X - от центра (1 - спереди, (-1) - сзвди)
		GravTY: 1// По Y - снизу ( (-1) - снизу) 
	},
	pose : {},
	//Преобразует заданные позы в рабочий вариант		
	updatePoses : function(){
		
			var i =-1, bg_scale=Game.zoom(1)/this.view.bg_zoom;
		for(var pos in this.view.pose){
			var ps = this.view.pose[pos];
			if(typeof ps == 'object'){
				if(ps.wh){
					//if(!ps.whAct){ps.whAct=[];}
					for(var tmp in ps.wh){
					ps.wh[tmp][0]=Math.round(ps.wh[tmp][0]/2);ps.wh[tmp][1]=Math.round(ps.wh[tmp][1]/2);
					if(ps.whAct){
						if(typeof ps.whAct[tmp]!=='object'){
							ps.whAct[tmp]=ps.wh[tmp];
						}else{
							ps.whAct[tmp][0]= Math.round(ps.whAct[tmp][0]/2);ps.whAct[tmp][1]=Math.round(ps.whAct[tmp][1]/2);
						}
					}
					}
					ps.WidthC = ps.wh[0][0]; ps.HeightC = ps.wh[0][1];
					 
				}else{
				ps.WidthC = Math.round(ps.width/2); ps.HeightC = Math.round(ps.height/2);
				}
				//Для краткости
				if(!ps.WidthAct){ ps.WidthAct=ps.width;}if(!ps.HeightAct){ps.HeightAct=ps.height;}
				
				this.pose[pos] = {
					width : ps.WidthAct,// ширина
					WidthC :  Math.round(ps.WidthAct/2),// полуширина (от центра до края)
					height : ps.HeightAct,
					HeightC :  Math.round(ps.HeightAct/2)
				}
				 
				if(ps.whAct){this.pose[pos].whAct=ps.whAct;}
				if(typeof ps.bg=="function"){
					var _bg = ps.bg();
					ps.bg = this.setBGArray(_bg);  
				} 
				for(var b in ps.bg){ps.bg[b][0]*=bg_scale;ps.bg[b][1]*=bg_scale;}
				
				i++; 
			}else {this.pose[pos] = ps;}
		} 
	},
			__update : function(){
			
			},
			init : function(){},
			__construct : function(){
				 
				if(this.view.pose){
					this.updatePoses();
					this.view.sel=this.view.el.addChild({});//Вложенный элемент, на который проецируется бэк
					this.view.sel.background({url:('Data/sprites/'+this.view.vId+'.png'), repeat : 'no-repeat'}); //, size : {x : bg_scale, y: bg_scale, suf : ""} 
					//if(Game.Level[id].saveStatus){Game[id]=Game.Level[id];}
					this.setPose( );   
					
				}
					this.move(this._x, this._y);
					//this.Init();
					
					
					if(this.save){
						if(Game[this.id]){
							this.live=Game[this.id].live;
							this.NapX=Game[this.id].NapX;
							this.NapY=Game[this.id].NapY;
							delete Game[this.id];
						}
						Game[this.id]=this;
					}
					this.__update();
				this.setPose();
				this.move();
					
					
					this.init(); 
				this.status=1;
				if(this.global)Game[this.id] = this;
				this.view.el.show();
				$_SYS.Animation.objects[this.id] = this;
			}
}