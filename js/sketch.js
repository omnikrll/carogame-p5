let gotham,
	ds_digital,
	digital7,
	bg,
	div,
	data,
	post,
	displayPost,
	button1,
	button2,
	button3;

let scoreboard = {
	"correct": 0,
	"fail": 0,
	"pass": [0,0,0,0,0,0,0,0,0]
}

let keyCodes = [70, 74, 32];

function preload() {
	gotham = loadFont('assets/fonts/gotham/Gotham/Gotham-Book.otf');
	digital7 = loadFont('assets/fonts/digital_7/digital-7 (mono italic).ttf');
	ds_digital = loadFont('assets/fonts/ds_digital/DS-DIGIT.TTF');
	data = loadJSON('/js/data.json');
	bg = loadImage('assets/img/bliss-pic.jpg');
}

function setup() {
	createCanvas(displayWidth, displayHeight);
	noLoop();
}

function draw() {
	renderPlayfield();
	if (post == undefined) {
		renderPost();
	} else {
		loop();
	}
}

function renderPlayfield() {
	background(bg);

	div = createDiv().size(640, 480);
	div.style('background', '#959595');
	div.style('border', '3px outset black');
	div.style('border-radius', '5px');
	div.center();
	
	// displayPost = rect(192, 80, 640, 240);

	button1 = createButton('Approve');
	button1.parent(div);
	button1.size(180, 80);
	button1.position(15, 367);
	button1.style('font-family', 'Gotham');
	button1.style('font-weight', 'lighter');
	button1.style('text-align', 'center');
	button1.mousePressed(approve);

	button2 = createButton('AI Decides');
	button2.parent(div);
	button2.size(180, 80);
	button2.position(228, 367);
	button2.style('font-family', 'Gotham');
	button2.style('font-weight', 'lighter');
	button2.style('text-align', 'center');
	button2.mousePressed(pass);

	button3 = createButton('Harmful');
	button3.parent(div);
	button3.size(180, 80);
	button3.position(441, 367);	
	button3.style('font-family', 'Gotham');
	button3.style('font-weight', 'lighter');
	button3.style('text-align', 'center');
	button3.mousePressed(denyMenu);
}

function getRandomPost() {
	let i = Math.floor(Math.random() * data.content.length);

	return data.content.splice(i, 1)[0];
}

function renderPost() {
	noLoop();
	post = getRandomPost();
	let postDiv = createDiv(post.text).size(606, 240);
	postDiv.parent(div);
	postDiv.position(15, 15);
	postDiv.style('font-family', 'Gotham');
	postDiv.style('font-size', '18px');
	postDiv.style('border', '1px solid black');
	postDiv.style('padding', '2em');
	postDiv.style('box-sizing', 'border-box');
}

function approve() {
	if (post.human_rating == 0) {
		scoreboard.correct++
	} else {
		scoreboard.fail++;
	}	
	renderPost();
}

function denyMenu() {
	let menu = createDiv().size(144,320).position(223,300);

	let ul = createElement('ul').parent(menu);
	createElement('li', 'Sexism / Misogyny').value(1).parent(ul).mousePressed(deny);
	createElement('li', 'Racism / Xenophobia').value(2).parent(ul).mousePressed(deny);
	createElement('li', 'Homophobia / Transphobia').value(3).parent(ul).mousePressed(deny);
	createElement('li', 'Ethnic or Religious Slur').value(4).parent(ul).mousePressed(deny);
	createElement('li', 'Physical Threats').value(5).parent(ul).mousePressed(deny);
	createElement('li', 'Sexual Threats').value(6).parent(ul).mousePressed(deny);
	createElement('li', 'Other').value(7).parent(ul).mousePressed(deny);
	createElement('li', 'Harassment (negative)').value(8).parent(ul).mousePressed(deny);	
}

function deny(event) {
	console.log(event);
	// if (post.human_rating > 0) {
	// 	scoreboard.correct++;
	// } else {
	// 	scoreboard.fail++;
	// }
	// renderPost();
}

function pass() {
	scoreboard.pass++;
}

// function keyPressed(event) {
// 	if (keyCodes.indexOf(keyCode) > -1) {
// 		event.preventDefault();	
// 		console.log(scoreboard);
// 		switch (keyCode) {
// 			case 70:
// 				approve();
// 				break;
// 			case 74:
// 				deny();
// 				break;
// 			case 32:
// 				pass();
// 				break;

// 		}
// 		renderPlayfield();
// 		renderPost();
// 	}

// }