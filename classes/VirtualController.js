classes.VirtualController = {
	objectType : 'class',
	
	id:'VirtualController',
	keys : {},//Нужно только для проверки отжатия кнопки при выходе курсора за ее пределы (если была нажата курсором - отжать, если с клавиатуры (мышью случайно дернул) - не трогать)
	keysList : { 
		left : ['UP', "Z", "LEFT","SHIFT",'DOWN'],
		right : ['UP',"Z", "RIGHT","SHIFT",'DOWN']
		},
	keyDown : function(e){ e.preventDefault();
		$_SYS.Key.press [e.target.Key]=true;
		classes.VirtualController.keys[e.target.Key][e.target.id] = true; 
		//if($_SYS.Key.onKeyDown){$_SYS.Key.onKeyDown($_SYS.Key.keyboardMap[e.target.Key]);}
		return false;
	},
	keyUp : function(e){ 
		//console.log('up',e); 
		classes.VirtualController.keys[e.target.Key][e.target.id] = false;
		var i=0;//Проверка все ли кнопки отжаты (и справа и с лева). Иначе если, к примеру, отпустить правый "SHIFT" когда зажат левый сработает событие отпускания
		for(var k in classes.VirtualController.keys[e.target.Key]){
			if(classes.VirtualController.keys[e.target.Key][k])i++;
		}
		if(i==0)$_SYS.Key.press[e.target.Key]=false;
		//if($_SYS.Key.onKeyUp){$_SYS.Key.onKeyUp($_SYS.Key.keyboardMap[e.target.Key]);}
	},
	keyOut : function(e) {//console.log(e.target.id);
			if(classes.VirtualController.keys[e.target.Key]){
				classes.VirtualController.keyUp(e);
			}
		},
		btnSize:50,
	__construct : function(){
		 this.btnSizePX=this.btnSize+"px"; 
		this.view.el.topBlock({zIndex:999, lineHeight: this.btnSizePX, textAlign:'center'});
		this.view.$ClassStyle
		for(var i in this.keysList){
		var vcb =  this.view.el.addChild({id: ("vController_"+i), className : 'vController', style:(i+":0")});
			
			for(var j in this.keysList[i]){
				var b = vcb.addChild({
					id : (this.keysList[i][j]+'_btn_'+[i]),
					className : 'keyBtn',
					style:"width:"+this.btnSizePX+"; height:"+this.btnSizePX+"; "+i+":0;bottom:"+((this.keysList[i].length - j )*this.btnSize-(this.btnSize/10)*j)+"px;", 
				});  
				b.Key = this.keysList[i][j];
				b.innerHTML=this.keysList[i][j];
				b.onmousedown = classes.VirtualController.keyDown;
				b.onmouseup = classes.VirtualController.keyUp;
				//b.onmouseout  =	classes.VirtualController.keyIn;
				b.onmouseout  =	classes.VirtualController.keyOut;
				b.oncontextmenu =function(e){e.preventDefault();} //classes.VirtualController.keyDown;//function (e){e.preventDefault(); return false};
				b.addEventListener('touchstart', function(e){e.preventDefault(); /*e.target.mousedown(); */classes.VirtualController.keyDown(e);}, false);
				b.addEventListener('touchend', classes.VirtualController.keyUp, false);
				b.addEventListener('touchcancel', classes.VirtualController.keyUp, false);
				//'touchmove'
				if(!classes.VirtualController.keys[b.Key]){classes.VirtualController.keys[b.Key]={}}
				//classes.VirtualController.keys[b.Key][(this.keysList[i][j]+'_btn_'+[i])]=false;
			}
		} 
		$_SYS.ScreenResizes.objects.vController=this;
		 
	},
	onResize : function(){
		this.view.el.width($_SYS.info.screen.Width);
		this.view.el.height($_SYS.info.screen.Height);
	},
	
		view : {
			$ClassStyle : {
				'#$, #$ *' :{position:'absolute'},
				'#$':{'z-index':999,top:0,left:0,right:0,bottom:0},
				'#$ .vController':{'z-index':1,top:0,bottom:0},
				'#$ .keyBtn':{position:'absolute', width:10, height:10, background:'rgba(48,48,48,0.5)',  padding:'0 5px', 'border-radius':5, cursor:'pointer' }
			}
		}
}