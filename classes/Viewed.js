/**
Все объекты, имеющие отображение в DOM: 
Включает методы
-Перемещения
-Регистрации нажатых клавишь (с клавиатуру или ИИ)
-Соприкасновение с другими объектами
**/
classes.Viewed = { 
	objectType : 'class',
	extendOf : '',
	
	
	
	$_import : ['Characters', 'Ground' ],
	
		Keys : {},//Регистрирует нажатие клавишь (реальное или виртуальное - ИИ)
		
		//Направление и скорость по умолчанию. Виртуальный "шаг" - минимальный отрезок расстояния в игре. Скорость - количество "шагов", на которое перемещается объект при каждом вызове функции
		NapX : 1,
		NapY : 1,
		speedX : 0,
		speedY : 0, 
		
		
		//Отвечает за перемещение и объекта и DOM-элемента
		move : function(x,y,z){
			// Если параметры не заданы - берет автоматом. z пока ни за что не отвечает
			var xC = x ? x : this.xC + this.NapX*this.speedX;
			var yC = y ? y : this.yC + this.NapY*this.speedY;
			//if(xC != this.xC||yC != this.yC){this.moveChange=true;} 
			if(x || y || z || xC != this.xC||yC != this.yC){
			// if(xC == this.xC&&yC == this.yC){this.moveChange=false;}
			this.xC = xC; this.yC = yC; 
			this.view.move(this.xC,this.yC);
			}
		},
		//Генерит подчененные объекты. (в отличаи от внутренних слоев, размещаются в родительском объете)
		addVassal : function(a){//Переименовать
			var _default = {
				parentNode : this.parentNode,
				parent : this.parent,
				view : true,
				onEntereFrame : function(){}
			}
			if(!this.Vassals)this.Vassals={};
			var a = $_SYS.fn.marge(_default,a); 
			this.Vassals[a.id] = a.parent[a.id] = $_SYS._New(a); 
		},
	//Пытается определить пересечение с другим объектом
	hitTest : function(obj){   
		return ($_SYS.fn.delta(this.xC,obj.xC)<(this.WidthC+obj.WidthC)&&$_SYS.fn.delta(this.yC,obj.yC)<(this.HeightC+obj.HeightC))? true : false;
	},
					
	view : {
		BgIndex : 0,
		move : function(x,y){ 
					//this.xC = x; this.yC=y; 
					this.el.XC(Game.zoom(x)); this.el.YC(Game.zoom(y));
					this.xC=x; this.yC=y; 
				},
				resize : function(w,h){
					this.el.WidthC(Game.zoom(w)); this.el.HeightC(Game.zoom(h));
					if(this.sel){this.sel.width(Game.zoom(2*w)); this.sel.height(Game.zoom(2*h));}//console.log(w,Game.zoom(w),this.sel.WidthC());
				}
	}
}