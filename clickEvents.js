//mouseevent 
var isMousedown = false;
var isDragging = false;
var THRESHOLD = 5; //threshold for detecting movement event
var startX; //record the starting pos of movement event
var startY;
var focusItem;

function down(offsetX,offsetY){
	let x = ~~(offsetX/CELLSIZE);//using bitwise operator to perform intergral division
	let y = ~~(offsetY/CELLSIZE);
	startX=x;
	startY=y;
	
	if(y>=CELLSNUMBER){
		let lvl=x+(y-CELLSNUMBER)*totalCellColNum+1;
		if(lvl<=uptoLevel){
			gotoLevel(lvl);
		}
	}
	if(cellsContent[x][y][1]!=null)
		if(cellsContent[x][y][1].clickable){
			isMousedown = true;
			focusItem=cellsContent[x][y][1];
		}
}

function move(offsetX,offsetY){
	if (isMousedown){
		if(!isDragging){
			if (Math.pow(startX-offsetX,2)+Math.pow(startY-offsetY,2)>THRESHOLD)
				isDragging = true;
		}
		else{
			refreshBoard();

			//redraw the cell to cover the original item
			ctx.beginPath();
			ctx.fillStyle = BOARDCOLOUR;
			ctx.strokeStyle = BORDERCOLOUR;
			ctx.lineWidth = borderWidth;
			ctx.rect(focusItem.x*CELLSIZE, focusItem.y*CELLSIZE, CELLSIZE, CELLSIZE);
			ctx.fill();
			ctx.stroke();
		
			drawRaysForCell(focusItem.x,focusItem.y);
			
			ctx.translate(offsetX, offsetY);
			focusItem.draw();
		}
	}
}

function up(offsetX,offsetY){
	let x = ~~(offsetX/CELLSIZE);//using bitwise operator to perform intergral division
	let y = ~~(offsetY/CELLSIZE);
	if(isDragging){		
		if(cellsContent[x][y][1]==null)focusItem.setNewLocation(x,y);
	}
	else if(isMousedown){
		focusItem.orientation++;
		if(focusItem.orientation>7)focusItem.orientation=focusItem.orientation-8;

	}
	isMousedown = false;
	isDragging = false;
	
	refreshRays();

	
	//winning check
	let isWin=true;
	for(var i = 0; i<targets.length;i++)if(targets[i].hit==false){
		isWin=false;
		break;
	}

	if(isWin&&currentLevel==uptoLevel){
		if(uptoLevel<levelCodes.length-1){
			description=["CONGRATULATIONS!!","Click on a level or ","press spacebar for next."];
			++uptoLevel;
		}
		else description=[["that's it so far..."],["more levels soon...."]];
	}
	
	refreshBoard();
	
	//save game record
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("currentLevel", currentLevel);
		localStorage.setItem("uptoLevel", uptoLevel);
		localStorage.setItem("save"+currentLevel,JSON.stringify(tools));
	}
}

gameCanvas.addEventListener('mousedown', e => down(e.offsetX,e.offsetY));
gameCanvas.addEventListener('mousemove', e => move(e.offsetX,e.offsetY));
window.addEventListener('mouseup', e => up(e.offsetX,e.offsetY));


var rect=gameCanvas.getBoundingClientRect();
gameCanvas.addEventListener("touchstart", e => {
	e.preventDefault();
	down(e.changedTouches[0].clientX - rect.left,e.changedTouches[0].clientY - rect.top);
});
gameCanvas.addEventListener("touchmove", e => {
	e.preventDefault();
	move(e.changedTouches[0].clientX - rect.left,e.changedTouches[0].clientY - rect.top);
});	
gameCanvas.addEventListener("touchend", e => {
	e.preventDefault();
	up(e.changedTouches[0].clientX - rect.left,e.changedTouches[0].clientY - rect.top)
});


document.addEventListener( "keydown", e => {
	if(e.which==32)
		if(currentLevel+1<=uptoLevel)
			gotoLevel(currentLevel+1);
});


