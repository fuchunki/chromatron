function drawLvlsButton(){

	ctx.font = CELLSIZE/2 + "px Verdana";;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.strokeStyle = 'black';

	function draw(i){
		let centreX = ((i-1)%totalCellColNum+0.5)*CELLSIZE;
		let centreY = (~~((i-1)/totalCellColNum)+CELLSNUMBER+.5)*CELLSIZE;
		ctx.translate(centreX, centreY);
		ctx.fillText(i, 0, 0);
		ctx.strokeText(i, 0, 0);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	};
	
	var i = 1;
	for (; i <= uptoLevel; i++) {
		ctx.fillStyle = "blue";
		draw(i);
	}
	for (; i < levelCodes.length; i++) {
		ctx.fillStyle = "red";
		draw(i);
	}
	
	ctx.fillStyle = "lime";
	draw(currentLevel);
	
}
  
function drawGrid(){
	ctx.fillStyle = 'DimGray';
	ctx.fillRect(0, 0, boardLength, boardLength);
	ctx.fillRect(toolboxPos, 0, toolboxW, toolboxH);
  
	ctx.strokeStyle = 'darkgrey';
	ctx.beginPath();
	for (var i = 0; i < boardLength; i+=CELLSIZE) {
		ctx.moveTo(i,0);
		ctx.lineTo(i,boardLength);
		ctx.moveTo(0,i);
		ctx.lineTo(boardLength,i);
	}
	for (var i = toolboxPos; i < toolboxPos+toolboxW; i+=CELLSIZE) {
		ctx.moveTo(i,0);
		ctx.lineTo(i,toolboxH);
	}
	for (var i = 0; i < toolboxH; i+=CELLSIZE) {
		ctx.moveTo(toolboxPos,i);
		ctx.lineTo(toolboxPos+toolboxW,i);
	}
	ctx.stroke();
  
  
}



function drawRaysForCell(i,j){
	
	if(cellsContent[i][j][0]=="invalid")return;
	
	ctx.lineWidth = rayWidth;
	centreX=(i+0.5)*CELLSIZE;
	centreY=(j+0.5)*CELLSIZE;         
	for (var k = 0; k < 8; k++){		
			ctx.strokeStyle = getRayColourName(cellsContent[i][j][0][k]);
      
      let d=orientationToDxdy(k);
  
			if (cellsContent[i][j][0][k]!=0){
				ctx.beginPath();
				ctx.moveTo(centreX,centreY);
				ctx.lineTo(centreX+(d.x)*CELLSIZE/2,centreY+(d.y)*CELLSIZE/2);
				ctx.stroke();
			}
	}
  ctx.lineWidth = 1;
}

function drawText(){

	let centreX = text1stCell.i*CELLSIZE;
	let centreY = text1stCell.j*CELLSIZE;
	ctx.translate(centreX, centreY);
	
	ctx.font = CELLSIZE/2 + "px Verdana";;
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillStyle = 'black';
	
	var text=description;
	
	if (typeof text == "string"){
		let max = CELLSIZE*(TOOLBOX.col+0.5); //max width per line
		
		function recursiveWrap(txt){
			if(ctx.measureText(txt).width<max)return [txt];
			let newline;
			for(let i=0;ctx.measureText(txt.slice(0,i+1)).width<max;i++)
				if(txt[i]==" ")
					newline=i;
			return [txt.slice(0,newline)].concat(recursiveWrap(txt.slice(newline+1)));
		}
		
		text=recursiveWrap(text);
	}
	
	for(var i=0;i<text.length;i++)ctx.fillText(text[i], 0, i*CELLSIZE*0.75);

	ctx.setTransform(1, 0, 0, 1, 0, 0);
}


