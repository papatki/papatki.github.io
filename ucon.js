var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var grd,
    keys_down = [],
	  letters = [];


var symbols=[{k:81,s:"Java",x:5},
				{k:87,s:"C#",x:15},
				{k:69,s:".NET",x:25},
				{k:82,s:"PHP",x:35},
				{k:84,s:"HMTL",x:45},
				{k:89,s:"JS",x:55},
				{k:85,s:"SQL",x:65},
				{k:73,s:"C++",x:75},
				{k:79,s:"Scala",x:85},
				{k:80,s:"Phyton",x:95}];

function Letter (key) {
	this.x = findX(key);
	this.symbol = findS(key);
	this.color = "rgba(255, 255, 255, "+Math.random()+")";
	this.size = Math.floor((Math.random() * 40) + 12);
	this.path = getRandomPath(this.x);
	this.rotate = Math.floor((Math.random() * Math.PI) + 1);
	this.percent = 0;
}

Letter.prototype.draw = function() {
	var percent= this.percent/100;
	var xy = getQuadraticBezierXYatPercent(this.path[0],this.path[1],this.path[2],percent);
	ctx.save();
	ctx.translate(xy.x, xy.y);
	ctx.rotate(this.rotate);
	ctx.font = this.size+"px Arial";
	ctx.fillStyle = this.color;
	ctx.fillText(this.symbol, -15, -15);
	ctx.restore();
};

Letter.prototype.drawPath = function(){
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(this.path[0].x, this.path[0].y);
	ctx.quadraticCurveTo(this.path[1].x, this.path[1].y, this.path[2].x, this.path[2].y);
	ctx.stroke();
}

function findX(key){
	for (var i = 0; i < symbols.length; i++) {
		if(symbols[i].k == key){
			return (symbols[i].x * canvas.width / 100);
		}
	};
	return false;
}

function findS(key){
	for (var i = 0; i < symbols.length; i++) {
		if(symbols[i].k == key){
			return symbols[i].s;
		}
	};
	return false;
}

function getRandomPath(x){
	var x_start = x;
	var x_end = x_start + Math.floor((Math.random() * 400) - 199);

	return [{
		x: x_start,
		y: canvas.height
	},{
		x: (x_start + x_end)/2,
		y: Math.floor((Math.random() * canvas.height) - canvas.height)
	},{
		x: x_end,
		y: canvas.height 
	}];
}

function drawBackground(){
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function getQuadraticBezierXYatPercent(startPt,controlPt,endPt,percent) {
	var x = Math.pow(1-percent,2) * startPt.x + 2 * (1-percent) * percent * controlPt.x + Math.pow(percent,2) * endPt.x; 
	var y = Math.pow(1-percent,2) * startPt.y + 2 * (1-percent) * percent * controlPt.y + Math.pow(percent,2) * endPt.y; 
	return( {x:x,y:y} );
}


function resize() {
	var box = canvas.getBoundingClientRect();
	canvas.width = box.width;
	canvas.height = box.height;
	grd = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.height);
}

function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBackground();

	for (var i = 0; i < letters.length; i++) {
		letters[i].percent += 1;
		letters[i].draw();
		if(letters[i].percent > 100){
			letters.splice(i, 1);
		}
	};

	for (var i = 0; i < keys_down.length; i++) {
		if(keys_down[i]){
			letters.push(new Letter(i));
		}
	};
	requestAnimationFrame(draw);
}
var start_keys = [81,87,69,82,84,89,85,73,79,80];

function startAnimation(){
	setTimeout(function(){
		var key = start_keys.pop();
		keys_down[key] = true;
		setTimeout(function(){
			keys_down[key] = false;
		},180);
		if(start_keys.length > 0){
			startAnimation();
		}
	}, 180);
}
resize();
draw();
startAnimation();

window.onresize = resize;



window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();