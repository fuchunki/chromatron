var levelCodes=new Array(14+1);

//level code, constructing items

// 1st row: ray genrators 
// in the form of [[input of 1st], [input of 2nd].....]
// [x,y,orientation,colour]

// 2nd: targets 
// in the form of [[input of 1st], [input of 2nd].....]
//[x,y,colour]

// 3rd: tools | 1.mirror 2.splitter 3.Bender 4.Filter"s" of different colours
// in the form of [#mirror, #splitter, #Bender, [x,#blue,#green,#cyan,#red,#magenta,#magenta], ....]

// 4th: description: ["1st line", "2nd line",.....] or ".....whole string...."

// 5th: blocks
// in the form of [[], [      ],[      ]....]
// 		accept 2 forms [x,y] or [x1,y1,x2,y2](cluster of blocks creation, from x1 y1 to x2 y2,top left to right bottom)
// or present all 255 cells directly: [1,1,1,9,9,9,1,1,1,.......] from left right, top down; 1 means block, 9 means no block

// 6th: conduits
// in the form of [[], [      ],[      ]....]
// 		accept 2 forms [x,y,orientation] or [x1,y1,x2,y2,orientation](cluster of blocks creation, from x1 y1 to x2 y2, top left to right bottom)
// or present all 255 cells directly: [1,0,3,9,9,9,4,5,6.......] from left right, top down; 0~7 means block, 9 means no block
 
levelCodes[0] = []; //not using, avoid confusion

levelCodes[1] = [
  			[[2,7,2,4]],
  			[[8,2,4]],
  			[1],
			["Drag the REFLECTOR in", 
			"the toolbox above onto",
			"the board and place it",
			"in front of the laser beam.",
			"Click on it to rotate it.",
			"Position the mirror so ",
			"that the laser beam is",
			"reflected into the pinwheel"]
		];
		

levelCodes[2] = [
  			[[3,8,2,4],[12,6,6,1]],
  			[[8,6,4],[7,9,1]],
  			[3],
			"To complete a level, every pinwheel must be hit by light of the same color, and not by any other colors."
		];


levelCodes[3] = [
  			[[0,3,3,1],[3,14,1,2],[14,11,6,4]],
  			[[7,4,6],[7,8,5],[9,6,3]],
  			[3],
			"Some pinwheels require multiple lasers to light them up. You get magenta from red and blue. Yellow is formed by green plus red. Combining green and blue yields a color known variously as cyan, teal, or aqua."
		];
	

levelCodes[4] = [
  			[[1,7,2,2]],
  			[[9,3,2],[8,4,2],[4,4,2],[6,5,2],[6,11,2]],
  			[0,3],
			"If a laser hits a SPLITTER at the correct angle, it bounces off at an angle and also goes straight through. If it hits head on, it just goes through."
		];
		
levelCodes[5] = [
  			[[1,6,2,4],[1,8,2,2]],
  			[[12,7,6],[7,11,6]],
  			[2,1],
			"Mirrors and lenses generally work in both directions. The splitter not only splits a laser beam coming in, but it can merge two laser beams into a single one, forming a new colored beam."
		];

levelCodes[6] = [
  			[[13,6,6,1],[1,8,2,4]],
  			[[7,2,4],[10,4,4],[4,4,4],[7,12,1],[10,10,1],[4,10,1]],
  			[0,4]
		];

levelCodes[7] = [
  			[[3,1,4,4],[10,1,4,1]],
  			[[7,3,1],[11,4,4],[4,5,1],[5,10,4]],
  			[0,0,3],
			"The BENDER is an angled reflector. Because of its angle, it bends lasers from horizontal and vertical to the diagonals, and vice versa.",
			[[0,0,14,0],[0,14,14,14],[0,1,0,13],[14,1,14,13]]
		];
		
levelCodes[8] = [
  			[[3,11,2,1]],
  			[[4,3,1],[12,5,1],[2,9,1]],
  			[0,2,1],
		];
		
levelCodes[9] = [
  			[[0,14,0,2]],
  			[[2,11,2],[6,5,2],[12,3,2],[12,13,2]],
  			[3,2,1],
			"The conduits on the map will only allow light to pass in one direction, such as up&down or left&right.",
			[],
			[[1,0,1,14,3],[4,0,4,14,3],[10,0,10,14,3],[13,0,13,14,3]]
		];
		
levelCodes[10] = [
  			[[0,1,2,4]],
  			[[12,1,4],[13,2,4],[11,13,4],[7,14,4],[1,9,4],[2,5,4],[7,5,4],[10,7,4],[5,9,4]],
  			[1,0,18],
			[],
			[[0,3,11,3],[11,3,11,12],[2,12,10,12],[2,6,2,11],[3,6,8,6],[8,7,8,10],[4,10,7,10],[4,8,6,8],[4,9]],
		];

levelCodes[11] = [
  			[[1,7,2,4], [13,8,6,2]],
  			[[4,2,4],[10,2,2]],
  			[3,0,1],
			[],
			[[3,1,11,1],[5,2,9,2],[6,3,8,3],[7,4],[3,2,3,5],[4,3,4,5],[5,4,5,5],[6,5],[11,2,11,5],[10,3,10,5],[9,4,9,5],[8,5]]
		];

levelCodes[12] = [
  			[[2,9,2,4], [12,5,6,1]],
  			[[5,5,1],[2,6,4],[10,6,1],[11,9,4],[8,10,1],[5,11,4]],
  			[1,3]
		];

levelCodes[13] = [
  			[[14,1,6,1], [14,13,6,4]],
  			[[7,4,4],[2,5,1],[8,8,4],[12,9,1],[5,10,4],[9,10,1]],
  			[0,2,7],
			[],
			[[0,3,1,3],[3,3,14,3],[0,7,11,7],[13,7,14,7],[0,11,1,11],[3,11,14,11]]
		];
		
levelCodes[14] = [
  			[[6,0,4,1], [0,6,2,4],[14,8,6,2],[8,14,0,7]],
  			[[6,6,2],[8,6,1],[6,8,7],[8,8,4]],
  			[5,0,2],
			"The white laser combines red, blue, and green light in a single beam. The white pinwheel requires at least one each of red, blue, and green. (The white laser does nicely.)"
		];

levelCodes[15] = [
  			[[0,7,2,7]],
  			[[2,4,4],[3,10,2],[7,7,7],[9,9,5],[10,4,3],[11,7,1],[12,2,6]],
  			[0,2,5,[null,1,1,0,1]],
			"The FILTER only allows one color of light through - try them on a white laser",
			[],
			[[4,7,2],[6,7,2],[8,7,2],[10,7,2]]
		];
		