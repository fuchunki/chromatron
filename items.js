//objects of items

function Item(x,y,orientation) {
	this.orientation = orientation%8;
	this.x=x;
	this.y=y;
	cellsContent[x][y][1]=this;
};
Item.prototype.resultRay=function(x, y, ori,colour){};
Item.prototype.clickable=false;
Item.prototype.draw = function() {ctx.textAlign = "center";ctx.fillText("err",0,0);};
Item.prototype.localDraw = function() {
	let centreX = (this.x+0.5)*CELLSIZE;
	let centreY = (this.y+0.5)*CELLSIZE;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(centreX, centreY);
	this.draw();
}




function Block(x,y) {
	Item.call(this,x,y,1);
	
};
Block.prototype = Object.create(Item.prototype);
Block.prototype.constructor = Block;
Block.prototype.draw = function() {
	
	let shadowThickness = CELLSIZE/20;	
	ctx.translate(-0.5*CELLSIZE, -0.5*CELLSIZE);
	ctx.fillStyle = '#585858';
	ctx.fillRect(0, 0, CELLSIZE, CELLSIZE);
	ctx.fillStyle = '#AAAAAA';
	ctx.fillRect(0, 0, CELLSIZE, shadowThickness);	
	ctx.fillRect(0, 0, shadowThickness, CELLSIZE);	
	ctx.fillStyle = '#282828';
	ctx.fillRect(CELLSIZE-shadowThickness, 0, shadowThickness, CELLSIZE);	
	ctx.fillRect(0,CELLSIZE-shadowThickness, CELLSIZE,shadowThickness);	
		
	ctx.setTransform(1, 0, 0, 1, 0, 0);
};





function Conduit(x,y,orientation) {
	Item.call(this,x,y,orientation);
};
Conduit.prototype = Object.create(Item.prototype);
Conduit.prototype.constructor = Conduit;
Conduit.prototype.draw = function() {

	let tubeHalfThick = CELLSIZE/10;
	let tubeHalfLen = CELLSIZE*0.35;
	let sideHalfLen = CELLSIZE*0.40;
	
	ctx.rotate(this.orientation * Math.PI / 4);
	
	ctx.fillStyle = 'grey';
	ctx.fillRect(-tubeHalfThick, -tubeHalfLen, 2*tubeHalfThick, 2*tubeHalfLen);
	
	ctx.beginPath();
	ctx.lineWidth = borderWidth;
	ctx.strokeStyle = 'black';
	ctx.moveTo(-tubeHalfThick, -sideHalfLen);
	ctx.lineTo(-tubeHalfThick, sideHalfLen);
	ctx.moveTo(tubeHalfThick, -sideHalfLen);
	ctx.lineTo(tubeHalfThick, sideHalfLen);
	ctx.stroke();
		
	ctx.setTransform(1, 0, 0, 1, 0, 0);
};
Conduit.prototype.resultRay = function(x, y, ori ,colour,steps){
		let orientDifference = this.orientation-ori;
		if(orientDifference<0)orientDifference+=8;
		if(orientDifference==0||orientDifference==4)
			rayTraceOut(x, y, (ori+4)%8,colour,steps);
};	





function BeamGenerator(x,y,orientation,colour) {
	Item.call(this,x,y,orientation);
	this.colour=colour;
};
BeamGenerator.prototype = Object.create(Item.prototype);
BeamGenerator.prototype.constructor = BeamGenerator;
BeamGenerator.prototype.draw = function() {
	
	ctx.rotate(this.orientation * Math.PI / 4);
	ctx.fillStyle = 'lightgrey';
	ctx.beginPath();
	ctx.arc(0, CELLSIZE*0.3, CELLSIZE/6, 0, 2 * Math.PI, false);
    ctx.fill();	
	ctx.fillRect(-CELLSIZE/10, -CELLSIZE/4, CELLSIZE/5, CELLSIZE*0.625);	

	ctx.beginPath();
	ctx.fillStyle = getRayColourName(this.colour);
	ctx.arc(0, CELLSIZE*0.3, CELLSIZE/10, 0, 2 * Math.PI, false);
    ctx.fill();	
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	};
BeamGenerator.prototype.act = function(){
		rayTraceOut(this.x,this.y,this.orientation,this.colour,0);
};





function Target(x,y,colour) {
	Item.call(this,x,y,0);
	this.colour=colour;
	this.hit=false;
};
Target.prototype = Object.create(Item.prototype);
Target.prototype.constructor = Target;
Target.prototype.draw = function() {
	
	ctx.fillStyle = getRayColourName(this.colour);
	
	if(!this.hit){//get dimmer if not hit
		if(ctx.fillStyle=="#ffffff")ctx.fillStyle="#cccccc";
		else{
			let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(ctx.fillStyle);//covert to ["#RRGGBB","RR","GG","BB"]
			let r= parseInt(result[1], 16)>>1;
			let g= parseInt(result[2], 16)>>1;
			let b= parseInt(result[3], 16)>>1;
			ctx.fillStyle="#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		}
		
	}
		
	let f = CELLSIZE*2 + "px Verdana";
	ctx.font = f;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("*", 0,CELLSIZE/2);
	ctx.strokeStyle = 'black';
	ctx.strokeText("*", 0,CELLSIZE/2);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
};
Target.prototype.act = function(){
	//hit check
	this.hit=false;
	var colourSum;
	for (var k = 0; k < 8; k++) colourSum=colourSum|cellsContent[this.x][this.y][0][k];				
	if(colourSum==this.colour)this.hit=true;
};
Target.prototype.resultRay=function(x,y,ori,colour,steps){rayTraceOut(x, y, (ori+4)%8,colour,steps)};





function Tool(toolboxIndex) {
	let x = toolboxIndex%TOOLBOX.col+CELLSNUMBER+SPACING;
	let y = ~~(toolboxIndex/TOOLBOX.col);
	Item.call(this,x,y,7);	//DIRECTLY PUT IT IN TOOLBOX
};
Tool.prototype = Object.create(Item.prototype);
Tool.prototype.constructor = Tool;
Tool.prototype.clickable = true;
Tool.prototype.setNewLocation = function(nx,ny){
		cellsContent[this.x][this.y][1]=null;
		cellsContent[nx][ny][1]=this;
		this.x=nx;
		this.y=ny;
	};	
Tool.prototype.resultRay = function(x, y, ori,colour){};





function Mirror(toolboxIndex) {
	Tool.call(this,toolboxIndex);
	this.orientation=7;
};
Mirror.prototype = Object.create(Tool.prototype);
Mirror.prototype.constructor = Mirror;
Mirror.prototype.draw = function() {
	
	let halfWidth=CELLSIZE*0.45;
	let mirrorHalfThick=CELLSIZE*0.1;
		
	ctx.rotate(this.orientation * Math.PI / 4);
	ctx.fillStyle = 'black';
	ctx.fillRect(-halfWidth, 0, 2*halfWidth,2*mirrorHalfThick);
	ctx.fillStyle = 'lightgrey';
	ctx.fillRect(-halfWidth*0.8, 0, halfWidth*1.6, mirrorHalfThick);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
};		
Mirror.prototype.resultRay = function(x, y, ori ,colour,steps){
	let orientDifference = this.orientation-ori;
	if(orientDifference<0)orientDifference+=8;
	if(orientDifference==1)rayTraceOut(x, y, (ori+2)%8,colour,steps);
	else if(orientDifference==7)rayTraceOut(x, y, (ori+6)%8,colour,steps);
	else if(orientDifference==0)rayTraceOut(x, y, ori,colour,steps);
}; 





function Splitter(toolboxIndex) {
	Tool.call(this,toolboxIndex);
	this.orientation=2;	
	 
};
Splitter.prototype = Object.create(Tool.prototype);
Splitter.prototype.constructor = Splitter;
Splitter.prototype.draw = function() {
	let splitterHalfWidth=CELLSIZE*0.4;
	let splitterHalfThick=CELLSIZE*0.12;
		
	ctx.rotate(this.orientation * Math.PI / 4);
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = 'lightgrey';
	ctx.fillRect(-splitterHalfWidth, -splitterHalfThick, splitterHalfWidth*2, splitterHalfThick*2);
	ctx.globalAlpha = 1;
	ctx.fillStyle = 'black';
	ctx.fillRect(-splitterHalfWidth*1.1, -splitterHalfThick*1.1, splitterHalfWidth*0.1, splitterHalfThick*2.2);
	ctx.fillRect(splitterHalfWidth*0.9, -splitterHalfThick*1.1, splitterHalfWidth*0.1, splitterHalfThick*2.2);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
};		
Splitter.prototype.resultRay = function(x, y, ori,colour,steps){
	let orientDifference = this.orientation-ori;
	if(orientDifference<0)orientDifference+=8;
	if(orientDifference==2||orientDifference==6)return;
	if(orientDifference==1||orientDifference==5)rayTraceOut(x, y, (ori+2)%8,colour,steps);
	else if(orientDifference==3||orientDifference==7)rayTraceOut(x, y, (ori+6)%8,colour,steps);
	rayTraceOut(x, y, (ori+4)%8,colour,steps);
};





function Bender(toolboxIndex) {
	Tool.call(this,toolboxIndex);	
	this.orientation=5;	
};
Bender.prototype = Object.create(Tool.prototype);
Bender.prototype.constructor = Bender;
Bender.prototype.draw = function() {
	
	let halfWidth=CELLSIZE*0.40;
	let mirrorHalfThick=CELLSIZE*0.08;
	
    ctx.rotate(Math.PI / 8);//bend it 22.5 degrees
	ctx.rotate(this.orientation * Math.PI / 4);
	ctx.fillStyle = 'black';
	ctx.fillRect(-halfWidth, 0, 2*halfWidth,2*mirrorHalfThick);
    ctx.fillRect(-halfWidth/2, 2*mirrorHalfThick, halfWidth,3*mirrorHalfThick);
	ctx.fillStyle = 'lightgrey';
	ctx.fillRect(-halfWidth*0.8, 0, halfWidth*1.6, mirrorHalfThick);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
};		
Bender.prototype.resultRay = function(x, y, ori ,colour,steps){
	let orientDifference = this.orientation-ori;
	if(orientDifference<0)orientDifference+=8;
	if(orientDifference==0)rayTraceOut(x, y, (ori+1)%8,colour,steps);	
	else if(orientDifference==1)rayTraceOut(x, y, (ori+3)%8,colour,steps);
	else if(orientDifference==6)rayTraceOut(x, y, (ori+5)%8,colour,steps);
	else if(orientDifference==7)rayTraceOut(x, y, (ori+7)%8,colour,steps);
}; 




function Filter(toolboxIndex,colour) {
	Tool.call(this,toolboxIndex);	
	this.orientation=2;
	this.colour=colour;
};
Filter.prototype = Object.create(Tool.prototype);
Filter.prototype.constructor = Filter;
Filter.prototype.draw = function() {
	let halfWidth=CELLSIZE*0.4;
	let halfThick=CELLSIZE*0.12;
	let halfInnerThick=CELLSIZE*0.04;
		
	ctx.rotate(this.orientation * Math.PI / 4);
	
	ctx.fillStyle = getRayColourName(this.colour);
	ctx.fillRect(-halfWidth, -halfThick, halfWidth*2, halfThick*2);
	ctx.fillStyle = 'black';
	ctx.globalAlpha = 0.2;
	ctx.fillRect(-halfWidth, -halfThick, halfWidth*2, halfThick*2);
	ctx.globalAlpha = 0.3;
	ctx.fillRect(-halfWidth, -halfInnerThick, halfWidth*2, halfInnerThick*2);
	
	ctx.globalAlpha = 1;
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.lineWidth = borderWidth;
	ctx.moveTo(2*halfThick-halfWidth, -3*halfThick);
	ctx.lineTo(-halfWidth, -halfThick);
	ctx.lineTo(-halfWidth, +halfThick);
	ctx.lineTo(2*halfThick-halfWidth, 3*halfThick);
	ctx.moveTo(-2*halfThick+halfWidth, -3*halfThick);
	ctx.lineTo(+halfWidth, -halfThick);
	ctx.lineTo(+halfWidth, +halfThick);
	ctx.lineTo(-2*halfThick+halfWidth, 3*halfThick);
	ctx.stroke();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	
};			
Filter.prototype.resultRay = function(x, y, ori ,colour,steps){
	let orientDifference = this.orientation-ori;
	if(orientDifference<0)orientDifference+=8;
	if(orientDifference==0||orientDifference==4)rayTraceOut(x, y, (ori+4)%8,colour&this.colour,steps);	
}




//ray tracing function used by items
function rayTraceOut(x, y, orientation,colour,steps) {
	if(colour<1||colour>7)return;
    cellsContent[x][y][0][orientation]|=colour;
    let d = orientationToDxdy(orientation);
    nextX=x+d.x;
    nextY=y+d.y;
    
  	if (nextX >= 0 && nextY >= 0 && nextX < CELLSNUMBER && nextY < CELLSNUMBER)
      if(steps<CELLSNUMBER*CELLSNUMBER)//to prevent infinte loop
          rayTraceIn(nextX, nextY, (orientation+4)%8,colour,steps+1);
    
}

function rayTraceIn(x, y, orientation,colour,steps) {
	cellsContent[x][y][0][orientation]|=colour;
	if(cellsContent[x][y][1]==null)rayTraceOut(x, y, (orientation+4)%8,colour,steps);
	else cellsContent[x][y][1].resultRay(x, y, orientation,colour,steps);

}