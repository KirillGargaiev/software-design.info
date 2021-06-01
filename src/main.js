
class Road
{
	/**
     * 
     * @param {*} image 
     * @param {*} y 
     */

    constructor(image, y)
	{
		this.x = 0;
		this.y = y;
		this.loaded = false;

		this.image = new Image();
		
		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });

		this.image.src = image;
	}
    /**
     * 
     * @param {*} road 
     */
	Update(road) 
	{
		this.y += speed; //The image will move down with every frame

		if(this.y > window.innerHeight) //if the image left the screen, it will change it's position
		{
			this.y = road.y - canvas.width + speed; //New position depends on the second Road object
		}
	}
}

class Hero
{	/**
 * 
 * @param {*} image 
 * @param {*} x 
 * @param {*} y 
 * @param {*} isPlayer 
 */
	constructor(image, x, y, isPlayer)
	{
		this.x = x;
		this.y = y;
		this.loaded = false;
		this.dead = false;
		this.isPlayer = isPlayer;

		this.image = new Image();

		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });

		this.image.src = image;
	}

	Update()
	{
		if(!this.isPlayer)
		{
			this.y += speed;
		}

		if(this.y > canvas.height + 50)
		{
			this.dead = true;
		}
	}
	/**
	 * 
	 * @param {*} hero 
	 * @returns 
	 */
	Collide(hero)
	{
		var hit = false;

		if(this.y < hero.y + hero.image.height * scale && this.y + this.image.height * scale > hero.y) //If there is collision by y
		{
			if(this.x + this.image.width * scale > hero.x && this.x < hero.x + hero.image.width * scale) //If there is collision by x
			{
				hit = true;
			}
		}

		return hit;
	}
	/**
	 * 
	 * @param {*} v 
	 * @param {*} d 
	 */
	Move(v, d) 
	{
		if(v == "x") //Moving on x
		{
			d *= 2;

			this.x += d; //Changing position

			//Rolling back the changes if the hero left the screen
			if(this.x + this.image.width * scale > canvas.width)
			{
				this.x -= d; 
			}
	
			if(this.x < 0)
			{
				this.x = 0;
			}
		}
		else //Moving on y
		{
			this.y += d;

			if(this.y + this.image.height * scale > canvas.height)
			{
				this.y -= d;
			}

			if(this.y < 0)
			{
				this.y = 0;
			}
		}
		
	}
}


const UPDATE_TIME = 1000 / 60;

var timer = null;

var canvas = document.getElementById("canvas"); //Getting the canvas from DOM
var ctx = canvas.getContext("2d"); //Getting the context to work with the canvas

var scale = 0.07; //hero's scale

Resize(); //Changing the canvas size on startup

window.addEventListener("resize", Resize); //Change the canvas size with the window size

//Forbidding openning the context menu to make the game play better on mobile devices
canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; }); 

window.addEventListener("keydown", function (e) { KeyDown(e); }); //Listenning for keyboard events

var objects = []; //Game objects

var roads = 
[
	new Road("images/road.jpg", 0),
	new Road("images/road.jpg", canvas.width)
]; //Backgrounds

var player = new Hero("images/hero.png", canvas.width / 2, canvas.height / 2, true); //Player's object


var speed = 3;

Start();

/**
 * 
 */
function Start()
{
	if(!player.dead)
	{
		timer = setInterval(Update, UPDATE_TIME); //Updating the game 60 times a second
	}
	
}
/**
 * 
 */
function Stop()
{
	clearInterval(timer); //Game stop
	timer = null;
}
/**
 * 
 */
function Update() 
{
	roads[0].Update(roads[1]);
	roads[1].Update(roads[0]);

	if(RandomInteger(0, 10000) > 9700) //Generating new car
	{
		objects.push(new Hero("images/enemy.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1, false));
	}

	player.Update();

	if(player.dead)
	{
		alert("You are dead!");
		Stop();
	}

	var isDead = false; 

	for(var i = 0; i < objects.length; i++)
	{
		objects[i].Update();

		if(objects[i].dead)
		{
			isDead = true;
		}
	}

	if(isDead)
	{
		objects.shift();
	}

	var hit = false;

	for(var i = 0; i < objects.length; i++)
	{
		hit = player.Collide(objects[i]);

		if(hit)
		{
			alert("You are dead!");
			Stop();
			player.dead = true;
			break;
		}
	}

	Draw();
}
/**
 * 
 */
function Draw() //Working with graphics
{
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the canvas

	for(var i = 0; i < roads.length; i++)
	{
		ctx.drawImage
		(
			roads[i].image, //Image
			0, //First X on image
			0, //First Y on image
			roads[i].image.width, //End X on image
			roads[i].image.height, //End Y on image
			roads[i].x, //X on canvas
			roads[i].y, //Y on canvas
			canvas.width, //Width on canvas
			canvas.width //Height on canvas
		);
	}

	DrawHero(player);

	for(var i = 0; i < objects.length; i++)
	{
		DrawHero(objects[i]);
	}
}
/**
 * 
 * @param {*} hero 
 */
function DrawHero(hero)
{
	ctx.drawImage
	(
		hero.image, 
		0, 
		0, 
		hero.image.width, 
		hero.image.height, 
		hero.x, 
		hero.y, 
		hero.image.width * scale, 
		hero.image.height * scale 
	);
}
/**
 * 
 * @param {*} e 
 */
function KeyDown(e)
{
	switch(e.keyCode)
	{
		case 37: //Left
			player.Move("x", -speed);
			break;

		case 39: //Right
			player.Move("x", speed);
			break;

		case 38: //Up
			player.Move("y", -speed);
			break;

		case 40: //Down
			player.Move("y", speed);
			break;

		case 27: //Esc
			if(timer == null)
			{
				Start();
			}
			else
			{
				Stop();
			}
			break;
	}
}
/**
 * 
 */
function Resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
/**
 * 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function RandomInteger(min, max) 
{
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}