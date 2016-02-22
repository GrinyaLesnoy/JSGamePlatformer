Data.Maps={  
	//default : { //По умолчанию. С целью восстановления уровня (например, при гибиле персонажа - чтобы перезагрузить уровень без перезагрузки всей игры)
	/** Layers [_count,_default] - количество слоев и какой основной (см. $_SYS.Layers), по умолчанию - [1,0]**/
		Level_0 : {
			canvas : [190,135],//Размер полотна для редактора
			//Layers : [[{zIndex : -5, _yP:200, width:1904,height:900}, -2],0],
			Layers : [
				{zIndex : -10, _yP:500, className: 'Bg_Layer'},
				{zIndex : -9, _yP:500, className: 'Ground_0'},
				{zIndex : -8, _yP:500, className: 'Ground_1'},
				{zIndex : -7, _yP:500, className: 'Ground_2'},
				{zIndex : -5, _yP:200 , className: 'Background'}, 
				0
			],
			//zoom : 1,
			Ground : {
			0:{_x : -20, _y: 125, w:200, h: 10, lc: 1, rc: 1},
			1:{_x : -30, _y: -25, w:10, h: 160, lc: 1, rc: 1},
			2:{_x : 180, _y: -25, w:10, h: 160, lc: 1, rc: 1},
			
			3:{_x :-20, _y: 30, w:30, h: 2, lc: 1, rc: 1},
			4:{_x :30, _y: 30, w:10, h: 2, lc: 1, rc: 1},
			5:{_x :40, _y: 28, w:10, h: 2, lc: 1, rc: 1},
			6:{_x :60, _y: 20, w:30, h: 5, lc: 1, rc: 1},
			7:{_x :120, _y: 20, w:30, h: 5, lc: 1, rc: 1},
			8:{_x :50, _y: 48, w:10, h: 12, lc: 1, rc: 1},
			9:{_x : 0, _y: 75, w:100, h: 12, lc: 1, rc: 1},
			10:{_x : 0, _y: 61, w:2, h: 14, lc: 1, rc: 1},
			
			11:{_x :110, _y: 90, w:30, h: 5, lc: 1, rc: 1},
			12:{_x :40, _y: 115, w:90, h: 5 }
			},
			Gate : {
				0: {index : 0, xC : 48, yC : 70}
			},
			Characters: {
				//Hero : {classes: 'Viewed.Characters.Humanoids.Humans.Girl',className : 'Hero', className: 'Hero', _x : 48, _y : 70, controlling: true}
			},
			Camera : {_x : 10, _y : 10}
		} 
	//}
}