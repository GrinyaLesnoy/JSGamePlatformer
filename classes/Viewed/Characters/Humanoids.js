/**
(����,����������������, ��������, ���, ��� ����� ������, �������, ������..)
**/
classes.Viewed.Characters.Humanoids = {
	
	objectType : 'classExtend',
	extendOf : 'classes.Viewed.Characters',
	
	$_import : ['Humans'],

	save : ['live', 'xC', 'yC','inventar'], //��������� ���� ������ ��� �������� ����� �������� //������ ���������� ��� ����������/ �� ��������� - ���-�� ������. ���������������
	inventar : {},//���������
	live : 10,//���-�� ������ ��� ��������
	//�-��� �������  
	Fall : function(){
	
		//���������, ��� �������� �������� �� ������ � �������
		if(this.Act=='Jump'||this.Act == 'JumpToFall'){
						//console.log(this.Act , this.view.pose[this.Act].index >=this.view.pose[this.Act].bg.length); 
			 this.Act = 'JumpToFall'; this.actPoseClass='Fall';  
			 if(this.view.pose[this.Act].index >=this.view.pose[this.Act].bg.length)
				{//���� �������� ����� �� 2� ����
					 this.view.pose[this.Act].index=0; var start=1; this.Act='Fall';   
				}else{this.view.pose[this.Act].index++;} 
							
		}else{
			this.Act='Fall';
		}
				
		this.speedXUPD();
		this.NapY = 1;
		if(this.speedY<1){this.speedDY = 10;}
		this.speedY = 4*parseInt(this.speedDY/10);
		var speedY = 0;
		var YKray = this.yC+this.HeightC*this.NapY;
		/*��� ������ ����������� �����
			- ����������� �� x
			- ����������� + ��� ������ ��� ������� �������� �� �
			- + ����� ������� ������ (g_z)//����� �������� ������ ��� ���� � ������ ����
		*/
		var tmpX = this.xC, tempXSpeed = this.NapX*this.speedX/this.speedY; //tmpX speedX ; (��� �� x)
		
		for(speedY = 0; speedY < this.speedY; speedY++){ 
			tmpX +=tempXSpeed;
			//����������� �� x
			if(Game.Level.getMap( parseInt(tmpX),(YKray+speedY*this.NapY))=='ground'){break;}
			// ����� ������� ������ (g_z)
			//if(Game.Level.getMap( parseInt(tmpX),(this.yC+this.HeightC*this.NapY+speedY*this.NapY),'zacep')=='zacep'){breack;}
			//if(){breack;}
		}
		/**/ 
		this.speedDY+=2; 
		//if(this.speedY!=speedY||Game.Level.getMap( parseInt(tmpX),(YKray+speedY*this.NapY+3))=='ground'){console.log('a');this._controller=2; this.Keys["DOWN"];}
		this.speedY = speedY;
		//if(this.Keys["UP"]){ this.Zacep(); } 
	},
	//afterFall : function(){
		//�������, ������������ �� ��������� ������� (������� �� ��������)
		//����� ��������, ������ �������� (����������), ���� � �������/������, ��� ���������
	//},
	jumpIndex : 0,//�������� �� ����� � ������ 
	preJump : 0,//�������� �� �������� ����� ������� (������ �� ������������)
	//������
	Jump : function(start){
		
	// !��������� ���������� ������������ ����� index ��������: �������� ���� - ������ �����above
	/* if((this.Act=='Stand')||(this.Act=='preJump'&& this.view.BgIndex < this.view.pose[this.Act].bg.lenght))
	{this.Act='preJump'; this.jumpIndex=10;}
	else
	{
		this.Act='Jump';
	}*/
	
		if(this.actPoseClass!='Jump'){ 
			if(this.Act=='Run')
			{this.actPoseClass='Jump';
				//this.appyPose('RunToJump','Run',[2]);
			 }  else  {
				this.preJump=5;//���� ���������, ��� ������ (��� 0 ������ ������ ��� �����, ����� ��������)
				//if(this.actPoseClass!='Jump'&&this.Act == 'Walk')this.preJump=5;
				this.actPoseClass='toJump'; 
				var sJump = ((this.Keys["LEFT"]&&this.NapX==-1)||(this.Keys["RIGHT"]&&this.NapX==1));
				//���� ���������, ��� ������ (��� ������ ������ ������ ������ ��� �����, ����� ��������)
			// if(sJump&&this.preJump<3){
			//	this.Act = 'Walk'; this.preJump++;
				//this.speedX=-1;this.view.lockNap=true; this.view.HodX= -1;//this.view.HodX=-1; this.NapX = (-1);
			 //}else{this.view.lockNap=false; this.view.HodX= 1;
			 this.Act = 'toJump'; this.actPoseClass='toJump'; this.speedX=0;
			 if(this.view.pose[this.Act].index >=this.view.pose[this.Act].bg.length)
				{//���� �������� ����� �� 2� ����
					 this.view.pose[this.Act].index=0; var start=1; this.Act='Jump';this.actPoseClass='Jump'; 
					 this.speedX=0;this.view.HodX=1;
					 if(sJump){this.speedX=3;}
		 
				}else{this.onGround(1); this.view.pose[this.Act].index++;
					 //if(sJump) this.speedX=2; 
				}
			//}//this.preJump
			}
			
		}
		
		if(this.actPoseClass=='Jump'){
		this.preJump=0;
		this.GravTY= 0;
		if(start)this.jumpIndex=10;
		this.NapY = -1;
		this.jumpIndex-=2; 
		this.speedY=Math.round(8*this.jumpIndex/10);
		var speedX = this.speedX; 
		this.speedXUPD(); 
		if(speedX != this.speedX || this.jumpIndex == 0 || this.onGround(-1)){this.speedY=0; this.jumpIndex = 0; this.NapY = 1; } 
		}
	}, 
					
	// ��������� ��������� �� ���� (������ �����������)
	Zacep : function(){
		//��������� ��������� ����� � �������� ������� ���� 
		//���������� ��� ���� ���� ��������� ����� � ���������
		//����� ���� this.view.pose.Stand.HeightC (5 ��. [-5,0],[-4,0-2],[-3,0-3], [-2,0-4],[-2,0-5] )
		//�������� ����� ���� �� 1
		var hl = this.view.pose.Stand.HeightC+1, hend = this.view.pose[this.Act].hend, t=false;
		if(!hend)return;
		var ii=(this.Act=='Stand')?0:1;//� ������� ����� ������ �� ��������� (���������� ���� �� �� ����������, �� �� ���� ����������� ���������), �� ����� - �� �������� (���������, �������� ����� ������� ��� ������
		for(var i=0; i<=hl; i++){
			for(var j=0; j<=(hl-i*ii); j++){//(hl-i)
				var x = this.xC+(hend[0]+i)*this.view.NapX, y=this.yC+hend[1]-j, pset = Game.Level.getMap(x,y,'zacep'); 
				if(pset&&(pset[1]==0||pset[1]==(-1)*this.NapX)){t = {x:x,y:y}; break;}
			}
		}
		//console.log(t,this.xC,x);
		if(t){
			 this.Act='Zacep';//this.Act='Visit';
			 this.NapY = 1;
			 this.speedX=0; x = t.x-(this.WidthC-1)*this.NapX;//*this.view.NapX;
			 this.speedY=0; this.jumpIndex = 0; y = t.y+this.HeightC;//*(1+this.GravTY);
			  this.GravTY= -1; this.GravTX= 1;
			  this.move(x,y,1);
			  //console.log(t.x, x, this.xC, (this.pose.Zacep.WidthC+1)*this.NapX);
			  //console.log(t.y, this.yC , y+this.pose.Zacep.HeightC-1);
			  //this.Act='Visit';
			  this.actPoseClass='Visit';
		}
	},
	//�������� �� ��������������
	VzbiratsyaNap : 1,
	Visit : function(){ 
		//this.actPoseClass='Visit';
		if(this.Keys["UP"]){this.VzbiratsyaNap = 1;}
		if(this.actPoseClass=='Vzbiratsya'||this.Keys["UP"]){
			this.actPoseClass='Vzbiratsya';
			var count = this.view.pose['Vzbiratsya'].bg.length; 
			this.Act='Vzbiratsya';
			//this.Act='Vzbiratsya_'+parseInt(this.view.pose['Vzbiratsya'].index);
			if(
				(this.VzbiratsyaNap==1&&this.view.pose['Vzbiratsya'].index<this.view.pose['Vzbiratsya'].count)
				||
				(this.VzbiratsyaNap==-1&&this.view.pose['Vzbiratsya'].index>0)
			)
			{ 
			this.view.pose['Vzbiratsya'].index+=this.VzbiratsyaNap;
			//������ xy ����� BgIndex
			//��������� ��������� bg-������� + index
			 this.GravTY= -1; this.GravTX= (this.view.pose['Vzbiratsya'].index>1 )? 0 : 1;
			// console.log(this.Act, this.NapX*this.view.pose[this.Act].xy[0],this.view.pose[this.Act].xy[1]);
			//this.move(parseInt(this.xC + this.NapX*this.view.pose[this.Act].xy[0]), parseInt(this.yC + this.view.pose[this.Act].xy[1]));
			//console.log(this.Act,this.xC,this.yC);
			}
			else
			{
			this.view.pose['Vzbiratsya'].index=0;
				if(this.VzbiratsyaNap===1){this.Act= 'Sit'; this.actPoseClass='Sit'; }else{
				this.Act= 'Visit'; 
				}
				
			}
		}else  if(this.Keys["DOWN"]){this.Act='Fall'; this.actPoseClass="Fall"; this.move((this.xC-this.pose[this.Act].WidthC*this.NapX),this.yC); }
	},
	
	//���, ��� ������� � ������� ����������
	Sit : function(){
		//������� � ������� ���������
		this.Act = (this.Act=='Stand'||this.Act=='Walk') ? 'StandToSit' : (this.Act=='Lejat' || this.Act=='PolztiLeja') ? 'LejatToSit' : (this.Act=='StandToSit' || this.Act=='LejatToSit') ? 'Sit' : this.Act; 
			//��������� ����� �����������: ��� ������ �������� - ������� � ���������� � �����, ����� ������, ����� ������ ���
			if(!this.Keys["DOWN"] && this.actPoseClass == 'Crawl'){this.Act='Sit'; this.actPoseClass = 'Sit'; this.speedX=0;  }//��� ����������� � ������� ��������� ����� ��������� � ������� (� �����. - � ����� ��������)
		if(this.actPoseClass != 'Sit' && this.actPoseClass != 'Crawl'){
			this.speedX=0;
			if(this.Act=='Sit'){this.actPoseClass = 'Sit'; }
		}else{ 
			if(this.speedX>0){
				if(this.Act=='Sit'){this.Act='CrawlStop';  this.speedX=0;}//�������� ��������
				if(this.speedX>2){this.speedX=2;};
				this.Act=  'Crawl';
			}else{//console.log(this.Act);
				if(this.Act== 'Crawl' ){
					this.Act= 'CrawlStop';
					this.appyPose('CrawlStop','Crawl');//,[1,3,7,8]
				}else if(this.Act!= 'CrawlStop'){this.Act= 'Sit';} 
			}
			 if(this.Act== 'CrawlStop' || this.Act== 'Crawl')this.actPoseClass = 'Crawl';
			 
		}
	},
	
	Lejat : function(){
		this.Act = (this.Act=='Sit' || this.Act=='CrawlStop' || this.Act=='Crawl') ? 'LejatToSit' : (this.Act=='LejatToSit') ? 'Lejat' : this.Act; 
		if(this.actPoseClass != 'Lejat'){
			this.speedX=0;
			if(this.Act=='Lejat'){this.actPoseClass = 'Lejat'; }
		}else{ 	
		if(this.speedX>1){this.speedX=1;};
			this.Act= (this.speedX>0) ? 'PolztiLeja' : 'Lejat'; 
		}
	},
	
	Stand : function(){  
		 //������� � ������� ���������
		this.Act = (this.actPoseClass == 'Crawl')? 'Sit' :(this.Act=='Sit') ? 'StandToSit' : (this.Act=='StandToSit' || (this.speedX==0 && this.actPoseClass == 'Stand')) ? 'Stand' : this.Act;// this.actPoseClass = 'Stand';
		 
		if(this.actPoseClass != 'Stand'){
			this.speedX=0;
			//if(this.Act=='Stand'){
			this.actPoseClass = 'Stand'; 
			//}
		}else{
			this.Act= (this.speedX>2) ? 'Run' : (this.speedX>0)? 'Walk' : 'Stand'; 
		}
	}, 
					
	//������������� �������� 				
	_ii : function(){},				
	_controller : 0,//��������� ����������� ���������� � ��������� �������
	controller : function(){ 
		if(this._controlling){
		for(var k in Game.keysControll){ 
			this.Keys[k] = $_SYS.Key.isDown(Game.keysControll[k]);
		}
		}else{this._ii();}
	}
			
	/*pose : {
		stand : {
			width : 4,// ������
			WidthC : 2,// ���������� (�� ������ �� ����)
			height : 10,
			HeightC : 5
		}
	},*/		
	

}