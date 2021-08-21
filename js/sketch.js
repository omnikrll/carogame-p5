let gotham = false,
	ds_digital = false,
	digital7 = false,
	bg = false,
	mainWindow = false,
	data = false,
	post = false,
	postDiv = false,
	displayPost = false,
	button1 = false,
	button2 = false,
	button3 = false,
	menu = false,
	timerDisplay = false,
	timerFontSize = 32;

let scoreboard = {
	"correct": 0,
	"fail": 0,
	"pass": [0,0,0,0,0,0,0,0,0]
}

let timer = 10;

let run = false;

let reasons = [
	'Sexism / Misogyny',
	'Racism / Xenophobia',
	'Ethnic or Religious Slur',
	'Physical Threats',
	'Sexual Threats',
	'Other',
	'Harassment (negative)'
];

function preload() {
	gotham = loadFont('assets/fonts/gotham/Gotham/Gotham-Book.otf');
	digital7 = loadFont('assets/fonts/digital_7/digital-7 (mono italic).ttf');
	ds_digital = loadFont('assets/fonts/ds_digital/DS-DIGIT.TTF');
	data = loadJSON('/js/data.json');
	bg = loadImage('assets/img/bliss-pic.jpg');
}

function setup() {
	let canvas = createCanvas(displayWidth, displayHeight);
	canvas.parent('sketch');
	// noLoop();
}

function draw() {
	if (!post) {
		renderPlayfield();
		renderPost();
	}


	if (run && frameCount % 60 == 0 && timer > 0) {
		timer--;

		if (timer <= 5) {
			timerFontSize += 4;
			timerDisplay.style('font-size', timerFontSize + 'px');
		}
	}

	timerDisplay.html('00:' + timer.toString().padStart(2,'0')); 

	if (timer <= 10) {
		timerDisplay.style('color', 'red');
	}



	if (timer == 0) {
		roundOver();
	}
}

function renderPlayfield() {
	// background(bg);

	if (!mainWindow) {
		mainWindow = createDiv().addClass('mainWindow');
		mainWindow.parent('sketch');
	}
	// div.center();

	if (!timerDisplay) {
		timerDisplay = createDiv().addClass('timerDisplay');
		timerDisplay.parent(mainWindow);
		timerDisplay.style('font-size', timerFontSize + 'px');
	}
	
	if (!button1) {
		button1 = createButton('Approve');
		button1.parent(mainWindow);
		button1.size(180, 80);
		button1.position(15, 367);
		button1.style('font-family', 'Gotham');
		button1.style('font-weight', 'lighter');
		button1.style('text-align', 'center');
		button1.mousePressed(approve);
	}

	if (!button2) {
		button2 = createButton('AI Decides');
		button2.parent(mainWindow);
		button2.size(180, 80);
		button2.position(228, 367);
		button2.style('font-family', 'Gotham');
		button2.style('font-weight', 'lighter');
		button2.style('text-align', 'center');
		button2.mousePressed(pass);
	}

	if (!button3) {
		button3 = createButton('Harmful');
		button3.parent(mainWindow);
		button3.size(180, 80);
		button3.position(441, 367);	
		button3.style('font-family', 'Gotham');
		button3.style('font-weight', 'lighter');
		button3.style('text-align', 'center');
		button3.mousePressed(denyMenu);
	}
}

function getRandomPost() {
	let i = Math.floor(Math.random() * data.content.length);

	return data.content.splice(i, 1)[0];
}

function renderPost() {
	noLoop();
	post = getRandomPost();
	if (typeof postDiv == 'object') postDiv.remove();
	postDiv = createDiv(post.text).size(606, 240);
	postDiv.parent(mainWindow);
	postDiv.position(15, 15);
	postDiv.style('font-family', 'Gotham');
	postDiv.style('font-size', '18px');
	postDiv.style('border', '1px solid black');
	postDiv.style('padding', '2em');
	postDiv.style('box-sizing', 'border-box');
	loop();
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
	menu = createDiv().addClass('menu').parent(mainWindow);

	let ul = createElement('ul').parent(menu);

	for (var i=0, ii=reasons.length; i<ii; i++) {
		let reason = reasons[i];
		let value = i + 1;
		let option = createElement('li', reason).parent(ul);	
		option.mousePressed(function() {
			deny(value);
		});
	}
}

function deny(value) {
	if (!!menu) menu.remove();
	if (post.human_rating == value) {
		scoreboard.correct++;
	} else {
		scoreboard.fail++;
	}
	renderPost();
}

function pass() {
	scoreboard.pass++;
}

function roundOver() {
	alert('round over');
}