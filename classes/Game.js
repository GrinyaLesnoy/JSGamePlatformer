classes.Game={
	objectType : 'class',
	classesName : 'Game',
	id : 'Game',
	parent : 'root', 
	
	zMax : 10,//������������ zIndex (��� ������� �� ����� 0) zIndex => zMax - �������� � ������ � ���� zIndex => 0 - � ������ � �����. 
	
	zoom : function(e){
		return (this.Level.zoom ? this.Level.zoom*e : e);
	},
	
	onEntereFrame : function(){ 
	
	},
	
	onResize : function(){
		this.WidthCZ = Game.view.el.WidthC();
		this.HeightCZ = Game.view.el.HeightC();
		this.WidthC = Math.round(this.WidthCZ/Main.zoom);
		this.HeightC = Math.round(this.HeightCZ/Main.zoom);
	},
	
	//������������ ������������ ������ ������� (����� ����� ���� �������������)
	keysControll : {
		"LEFT" : "LEFT",
		"RIGHT" : "RIGHT",
		"UP" : "UP",
		"DOWN" : "DOWN",
		"SHIFT" : "SHIFT",
		"JUMP" : "Z",
		"X" : "X",
		"A" : "A",
		"CTRL" : "CONTROL"
	},
	
	// ����������/�������� ��������� ����
	Save : {
		_saves : {
			auto : { },//�������������� ����������
			global : {}//���. ����. ��� ���������� ��������
		},
		save_id : 0,
		Write : function(save_id){
			var save_id = save_id ? save_id : 'auto';
			var level_id = Game.Level.level_id;//�������� id �������� ������
			 this._saves[save_id].level_id=level_id;//���������� id �������� ������ (��� ������. ��������. )
			if(save_id!='auto'){delete this._saves[save_id]; this._saves[save_id]= $_SYS.fn.clone(this._saves.auto);}//���� ���������� ��� ����� id - �����������
			this._saves[save_id][level_id]={};//������� ����� ������ ��� ������
			var save = this._saves[save_id][level_id]; 
			
			for(var e in Game.Level){ //������� ��������, ����������� � ������
				//���� ��� �����-�� �������� (�� ��������) ������ ��� �� ����� ���������� ��� ���������� - ����������
				if(Game.Level[e].status!=1||!Game.Level[e].save){ continue;}
				//���������� �������, ������������� � ������� save �������
				save[e]={};
				for(var s in Game.Level[e].save){
					save[e][Game.Level[e].save[s]] = Game.Level[e][Game.Level[e].save[s]]; (typeof Game.Level[e][Game.Level[e].save[s]]== 'object') ? $_SYS.fn.clone(Game.Level[e][Game.Level[e].save[s]]) : Game.Level[e][Game.Level[e].save[s]]; 
				}
				//��������� ��������� ��� ��������, ������� ���������� ��-�� (��������� ������������ ����� ��������)
				if(Game.Level[e].global){ 
					this._saves.global[e] ={};
					for(var g in Game.Level[e].global){
						this._saves.global[e][Game.Level[e].global[g]] = Game.Level[e][Game.Level[e].global[g]];
					}
				};  
			}
		},
		Load : function(save_id, global){
			 
			var save_id = save_id ? save_id : 'auto'; 
			var level_id = this._saves[save_id].level_id; 
			//classes.Level.add(level_id);//������ ������� ! �� ������ - ��� ����� ������ �-��� ������
			if( level_id && this._saves[save_id][level_id]){//���� ������� ��� ����� ������ ��� ��� �� ������� �������� ������� ������� - ����������
			var save = this._saves[save_id][level_id];
			for(var e in save){
				for(var s in save[e]){
					Game.Level[e][s] = (typeof save[e][s]== 'object') ? $_SYS.fn.clone(save[e][s]) : save[e][s]; 
				}
			}
			}
			if(global && save_id == 'auto'){//���������� - ������ ��� ��������������
				for(var e in this._saves.global){
					for(var g in this._saves.global[e]){
						 Game.Level[e][g] = this._saves.global[e][g];
					}
				}
			}
		}
	},
	 
	 margeLevels : function(id){
		if(Data.Maps[id]._protoID_){
			this.margeLevels(Data.Maps[id]._protoID_);
			Data.Maps[id] = $_SYS.fn.marge(Data.Maps[Data.Maps[id]._protoID_],Data.Maps[id]); 
			delete Data.Maps[id]._protoID_;
		} 
	 },
	 
	__construct: function(_this){
		if(this.view.$ClassStyle )$_SYS.CSS.update(this,this.view.$ClassStyle);
		root.Game = this;
		root.Game.onResize();
		
		//������� ������� � �� �����������
		for(var i in Data.Maps){if(Data.Maps[i]._protoID_)this.margeLevels(i);}
		
		$_SYS._New(classes.Level, {level_id : 'Level_0'});
		Game.VirtualController = $_SYS._New(classes.VirtualController);
		$_SYS.Animation.objects.Game = this;
	},
	Screen : {
	
		startScreen : {
			init : function(){
				var $block = $_SYS.fn.createBlock("root", {id: 'startScreen'});
				$block.addChild({id:'Start'});
				$block.addEventListener('mouseup', Game.VirtualController.keyUp, false);//root.touchscreen=true;
				$block.addEventListener('touchend', Game.VirtualController.keyUp, false);
			},
			remove : function(_next){//next - ����, ����� � �.�.
				$_SYS.fn.removeBlock({id: 'startScreen'});
				this[_next].init();
			}
		},
		levelScreen :{
			init : function(){
				classes.Level.add('Level_0');
			}
		}
	},
	
	
	view : {
		$ClassStyle : {
			'#Game, .Level' : {overflow:'hidden', left:0, top:0, right:0, bottom:0, 'z-index':1}
		}
	
	}
} 


$_SYS.Save = {
	tmp : {},
	Save : function(){this.tmp = $_SYS.fn.clone(Game);},
	Load : function(){Game = $_SYS.fn.clone(this.tmp);}
}

