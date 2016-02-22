Data = {}

manifest = {
	tempData : [],//��������� ��������� �������
	getData : function(obj,path){ 
		for(var i in obj){
			if(typeof obj[i]=='object'){
				this.getData(obj[i], path+i+'/');
			}else{
				this.tempData[this.tempData.length] = (path+obj[i]);
			} 
		}
	},
	get_library: function(path){ if(!path){path='';}else if(path.substr(-1) !='/'){path+='/';}
	var a={};
	for(var type in manifest.library){
		this.tempData =[]; this.getData(manifest.library[type], path);
		a[type]=this.tempData; delete this.tempData;
	} 
		return a;
	}
}

manifest.library = {
	//����� ��������� ��� ������� ���� {Data : {sprites : ['s1.png','s2.png']}} ��� � ������ ['Data/sprites/s1.png','Data/sprites/s2.png'], ��� � ��������������� (�������� ������ ���������� ��������� ��������)
	scripts : [
		'Data/Maps'
	],
	images : {
		Data : {
			sprites : [
				'Hero.png'
			],
			textures : [ 
				'ground01.gif'
			],
			backgrounds: {
				'default' : [
					'ground.jpg',
					'dymka_1.png',
					'planets_in_sky.jpg',
					'sky.jpg'
				]
			
			}
		} 
	}
}
//manifest.get_library('images')