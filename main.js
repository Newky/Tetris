//Tetris Game
//
//Created By Richard Delaney

//This is a 2d array which stores the grid
//It is initially all set to 0 which signifys an empty
var grid;
//ID <-> color
//KEY BASED ARRAY
var ids;

//Height & width of the grid
var height=400;
var width=300;
//This is the size of each grid piece
var piece_size = 20;
//HTML5 CANVAS CONTEXT Variable
var ctx;
//Current piece
var cur_piece;
//Number of pieces
var id;
//Score variable
var score=0;
document.onkeyup = key_pressed;

//Initial Setup function, called on load
function init()
{
	//Grid is a 2d array 
	//it first sets the first bit to be of height size 
	// this is divided by piece to show the amount of squares in the grid there will actualy be
	grid = new Array(height/piece_size);
	ids = new Array();
	//Same here
	var wide =(width/piece_size);
	var i=0;
	for(;i<grid.length;i++)
	{
		//Each element of the array is made into a new array
		//of width size
		grid[i] = new Array(wide);
		var j=0;
		for(;j<wide;j++)
		{
			//Each element within each array is set to 0
			//signifying empty
			grid[i][j] = 0;
		}
	}
	var canvas = document.getElementById('canvas');  
	if (canvas.getContext)
	{
		ctx = canvas.getContext('2d'); 
		//Draw Border
		ctx.strokeRect(0,0,width,height);
	}
	id = 1;
	var piece = random_piece(0,0, id);
	draw(piece);
	cur_piece = piece;
	setInterval("do_movement();", 1000);
}

function grid_draw()
{
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.strokeRect(0,0,width,height);
}

function do_movement()
{
	if(!down(cur_piece))
	{
		cur_piece = random_piece(0,0,++id);
		check_line_full();
	}
	grid_draw();
}

function drop()
{
	while(down(cur_piece))
	{
		grid_draw();
	}
	cur_piece = random_piece(0,0,++id);
	check_line_full();
}
function random_piece(x, y, id)
{
	var num = rand_between(0, 7);
	++score;update_score();
	switch(num)
	{
		case 0:
			return new line_piece(x, y, id);
			break;
		case 1:
			return new cube(x, y, id);
			break;
		case 2:
			return new l_piece(x, y, id);
			break;
		case 3:
			return new axis(x,y,id);
			break;
		case 4:
			return new zig_zag(x, y, id);
			break;
		case 5:
			return new zig_zag_alt(x,y,id);
			break;
		case 6:
			return new l_piece_alt(x,y,id);
			break;
		default:
			return new cube(x, y, id);
	}
}

function re_draw_grid()
{
	ctx.clearRect(0,0, width, height);
	var i=0;
	for(;i<grid.length;i++)
	{
		var j=0;
		for(;j<grid[i].length;j++)
		{
			if(grid[i][j] != 0)
			{
				ctx.fillStyle = ids[""+grid[i][j]];
				ctx.fillRect((j*20), (i*20), piece_size, piece_size);
			}
		}
	}
	grid_draw();
}

//This Object Represents 
//A line piece

function draw(piece)
{
	/*var last_line = piece.footprint[piece.footprint.length-1];*/
	/*var next_line = grid[piece.y+piece.footprint.length-1];*/
	/*var i = 0;*/
	/*for(;i<last_line.length;i++)*/
	/*if(last_line[i] != -1)*/
	/*if(next_line[piece.x+i] != 0)*/
	/*return 0;*/
	/*i=0;*/
		var i =0;
		for(;i < piece.footprint.length;i++)
		{
			var j = 0;
			for(;j < piece.footprint[i].length;j++)
			{
				if(piece.footprint[i][j] != -1)	
				{
					if(grid[piece.y+i][piece.x+j] != 0)
					{
						return 0;
					}
				}
			}
		}
		for(i=0;i<piece.footprint.length;i++)
		{
			for(var j=0;j < piece.footprint[i].length;j++)
			{
				if(piece.footprint[i][j] != -1)
				{
					if(grid[piece.y+i][piece.x+j] == 0)
					{
						grid[piece.y+i][piece.x+j] = piece.footprint[i][j];
						ctx.fillStyle = ids[piece.id];
						ctx.fillRect((piece.x+j)*20,(piece.y+i)*20,piece_size,piece_size);
					}
					else
					{
						return 0;
					}
				}
			}
		}
		return 1;
}

function clear(piece)
{
	var i = 0;
	while(i < piece.footprint.length)
	{
		var j = 0;
		while(j < piece.footprint[i].length)
		{
			if(piece.footprint[i][j] != -1)
			{
				grid[piece.y+i][piece.x+j] = 0;
				ctx.fillStyle = "rgb(255,255,255)";
				ctx.fillRect((piece.x+j)*20,(piece.y+i)*20,piece_size, piece_size);
			}
			j ++;
		}
		i++;
	}
	
}

function p_grid(piece)
{
	var str = "";
	i=0;
	for(;i<piece.length;i++)
	{
		var j=0;
		for(;j<piece[i].length;j++)
			str += piece[i][j]+",";
		str += "\n"
	}
	alert(str);
}


function down(piece)
{
	if(!check_down_blank(piece))
	{
		if(piece.y+4 >= height/piece_size)
			return 0;
		clear(piece);
		piece.y += 1;
		if(!draw(piece))
		{
			//clear(piece);
			piece.y -= 1;
			draw(piece);
			return 0;
		}
		return 1;
	}
	else
	{
		clear(piece);
		shift(piece, 2);
		draw(piece);
		return 1;
	}
}

function left(piece)
{
	if(!check_left_blank(piece))
		dir(piece, 0);
	else
	{
		clear(piece);
		shift(piece, 0);
		if(!draw(piece))
		{
			shift(piece, 1);
			draw(piece);
		}
	}
}

function right(piece)
{
	if(!check_right_blank(piece))
		dir(piece, 1);
	else
	{
		clear(piece);
		shift(piece, 1);
		if(!draw(piece))
		{
			shift(piece, 0);
			draw(piece);
		}
	}
}

function shift(piece, dir)
{
	//Dir equal 0 left
	//equal 1 right
	var temp = copy(piece)
	if(dir == 0)
	{
		var i = temp[0].length-1;
		for(;i>0;i--)
		{
			var j=0;
			for(;j<temp.length;j++)
				piece.footprint[j][i-1] = temp[j][i];
		}
		var j =0;
		for(;j<temp.length;j++)
			piece.footprint[j][3] = -1;
	}
	else if(dir == 1)
	{
		var i = 0;
		for(;i<temp[0].length-1;i++)
		{
			var j=0;
			for(;j<temp.length;j++)
				piece.footprint[j][i+1] = temp[j][i];
		}
		var j =0;
		for(;j<temp.length;j++)
			piece.footprint[j][0] = -1;
	}
	else
	{
		var i = 0;
		for(;i<temp.length-1;i++)
		{
			var j = 0;
			for(;j<temp[i].length;j++)
				piece.footprint[i+1][j] = temp[i][j];
		}
		var j = 0;
		for(;j<temp.length;j++)
			piece.footprint[0][j] = temp[temp.length-1][j];
	}
}

function copy(piece)
{
	var temp = new Array(piece.footprint.length);
	var i =0;
	for(;i<piece.footprint.length;i++)
	{
		var j=0;
		temp[i] = new Array(piece.footprint[i].length);
		for(;j<piece.footprint[i].length;j++)
			temp[i][j] = piece.footprint[i][j];
	}
	return temp;
}

function check_left_blank(piece)
{
	var i = 0;
	for(;i<piece.footprint.length;i++)
		if(piece.footprint[i][0] != -1)
			return 0;
	return 1;
}

function check_right_blank(piece)
{
	var i = 0;
	var j = piece.footprint[i].length-1;
	for(;i<piece.footprint.length;i++)
		if(piece.footprint[i][j] != -1)
			return 0;
	return 1;
}

function check_down_blank(piece)
{
	var j=0;
	var i = piece.footprint.length-1;
	for(;j<piece.footprint[i].length;j++)
		if(piece.footprint[i][j] != -1)
			return 0;
	return 1;
}

function check_line_full()
{
	var i=0;
	var needed = 0;
	for(;i<grid.length;i++)
	{
		var full = 1;
		var j =0;
		for(;j<grid[i].length;j++)
		{
			if(grid[i][j] == 0)
			{
				full = 0;
				break;
			}
		}
		if(full)
		{
			needed ++;
			grid.splice(i,1);
			var blank = new Array(grid[0].length);
			for(var i=0;i<blank.length;i++)
				blank[i] = 0;
			grid.splice(0,0, blank);
		}
	}
	if(needed)
	{
		score += (needed*5);update_score();
		re_draw_grid();
	}
}

function dir(piece, dirc)
{
	//if dirc is 0 = left
	//if dirc is 1 = right
	if(piece.x == 0 && !dirc)
		return;
	if(piece.x == ((width/piece_size)-piece.footprint.length) && dirc)
		return;
	clear(piece);
	if(!dirc)
		piece.x -= 1;
	else
		piece.x += 1;
	if(!draw(piece))
	{
		if(!dirc)
			piece.x += 1;
		else
			piece.x -= 1;
		draw(piece);
	}
}

function spin(piece)
{
	if(piece.spin_rate == 0)
		return;
	clear(piece)
	var temp = copy(piece);
	var i=0;
	var horiz = temp.length -1;
	for(i=horiz;i>=0;i--)
	{
		var j =0;
		for(;j<temp[i].length;j++)
		{
				/*alert("Moving ("+i+","+j+") to ("+(horiz-j)+","+(horiz-i))*/
			piece.footprint[j][horiz-i] = temp[i][j];
		}
	}
	if(!draw(piece))
	{
		spin(piece);
	}
}

function piece(startx, starty, id, spin_rate)
{
	this.x = startx;
	this.y = starty;
	this.footprint = new Array(4);
	this.id = id;
	this.spin_rate = spin_rate;
	this.rotations = 0;
	ids[""+id] = random_fill();
}

function line_piece(startx, starty, id)
{
	this.inheritFrom = piece;
	this.inheritFrom(startx, starty, id, 1);
	this.footprint[0] = [this.id,this.id, this.id, this.id];
	this.footprint[1] = [-1, -1, -1, -1];
	this.footprint[2] = [-1, -1, -1, -1];
	this.footprint[3] = [-1, -1, -1, -1];
}

function l_piece(startx, starty, id)
{
	this.inheritFrom = piece;
	this.inheritFrom(startx, starty, id, 4);
	this.footprint[0] = [this.id,this.id, this.id, -1];
	this.footprint[1] = [-1, -1,  this.id,-1];
	this.footprint[2] = [-1, -1, -1, -1];
	this.footprint[3] = [-1, -1, -1, -1];
}

function l_piece_alt(startx, starty, id)
{
	this.inheritFrom = piece;
	this.inheritFrom(startx, starty, id, 4);
	this.footprint[0] = [-1, -1,  this.id,-1];
	this.footprint[1] = [this.id,this.id, this.id, -1];
	this.footprint[2] = [-1, -1, -1, -1];
	this.footprint[3] = [-1, -1, -1, -1];
}

function cube(startx, starty, id)
{
	this.inheritFrom = piece;
	this.inheritFrom(startx, starty, id, 0);
	this.footprint[0] = [-1, this.id, this.id, -1];
	this.footprint[1] = [-1,this.id, this.id,-1];
	this.footprint[2] = [-1, -1, -1, -1];
	this.footprint[3] = [-1, -1, -1, -1];
}

function axis(startx, starty, id)
{
	this.inheritFrom = piece;
	this.inheritFrom(startx, starty, id, 4);
	this.footprint[0] = [this.id, this.id, this.id, -1];
	this.footprint[1] = [-1,this.id, -1,-1];
	this.footprint[2] = [-1, -1, -1, -1];
	this.footprint[3] = [-1, -1, -1, -1];
}

function zig_zag(startx, starty, id)
{
	this.inheritFrom = piece;
	this.inheritFrom(startx, starty, id, 4);
	this.footprint[0] = [ -1,-1, this.id, this.id,];
	this.footprint[1] = [-1,this.id,this.id,-1];
	this.footprint[2] = [-1, -1, -1, -1];
	this.footprint[3] = [-1, -1, -1, -1];
}

function zig_zag_alt(startx, starty, id)
{
	this.inheritFrom = piece;
	this.inheritFrom(startx, starty, id, 4);
	this.footprint[0] = [-1,this.id,this.id,-1];
	this.footprint[1] = [ -1,-1, this.id, this.id,];
	this.footprint[2] = [-1, -1, -1, -1];
	this.footprint[3] = [-1, -1, -1, -1];
}

function update_score()
{
	document.getElementById("score").innerHTML = "Score:"+score;
}

function key_pressed(e)
{
	var keyid = (window.event) ? event.keyCode: e.keyCode;
	switch(keyid)
	{
		case 32:
			drop(cur_piece)
			break;
		case 37:
			left(cur_piece);
			break;
		case 39:
			right(cur_piece);
			break;
		case 38:
			spin(cur_piece);
			break;
		case 40:
			down(cur_piece);
			break;
	}
}

function random_fill()
{
	return "rgb("+rand_between(0, 255)+","+rand_between(0, 255)+","+rand_between(0,255)+")";
}

function rand_between(min, max)
{
	var rand_no = Math.floor(Math.random()*(max+1));
	return rand_no;
}
