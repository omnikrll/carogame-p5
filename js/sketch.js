let mainWindow = false,
	header = false,
	data = false,
	post = false,
	postDiv = false,
	displayPost = false,
	button1 = false,
	button2 = false,
	button3 = false,
	menu = false,
	timer = null,
	timerDisplay = false,
	timerFontSize = 32,
	round = [];

let scoreboard = {
	"round": 1,
	"correct": 0,
	"fail": 0,
	"pass": 0,
	"timer": 30,
	"results": []
}

let run = true;

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
	data = loadJSON('/js/data.json');
}

function setup() {
	renderPlayfield();

	if (getItem('scoreboard') != null) {
		scoreboard = JSON.parse(getItem('scoreboard'));
	}

	timer = scoreboard.timer;
}

function draw() {
	if (!post) {
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
	if (!mainWindow) {
		mainWindow = createDiv().addClass('mainWindow');
		mainWindow.parent('sketch');
	}

	if (!header) {
		header = createElement('h1', 'conmod');
		header.parent(mainWindow);
	}

	if (!timerDisplay) {
		timerDisplay = createDiv().addClass('timerDisplay');
		timerDisplay.parent(mainWindow);
		timerDisplay.style('font-size', timerFontSize + 'px');
	}
	
	if (!button1) {
		button1 = createButton('Approve');
		button1.parent(mainWindow);
		button1.addClass('rateButton').addClass('approve');
		button1.position(15, 367); //move this to css
		button1.mousePressed(approve);
	}

	if (!button2) {
		button2 = createButton('AI Decides');
		button2.parent(mainWindow);
		button2.addClass('rateButton').addClass('pass');
		button2.position(228, 367); //move this to css
		button2.mousePressed(pass);
	}

	if (!button3) {
		button3 = createButton('Harmful');
		button3.parent(mainWindow);
		button3.addClass('rateButton').addClass('deny');
		button3.position(441, 367);	//move this to css
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
	postDiv.class('postDiv');
	loop();
}

function approve() {
	if (post.human_rating == 0) {
		scoreboard.correct++
	} else {
		scoreboard.fail++;
	}	
	handleResult(0);
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
	handleResult(value);
}

function pass() {
	scoreboard.pass++;
	handleResult(-1);
}

function handleResult(value) {
	post.player_rating = value;
	scoreboard.results.push(post);
	renderPost();
}

function roundOver() {
	alert('round over');
	storeItem('scoreboard', JSON.stringify(scoreboard));
	window.location.assign(window.location.origin + '/result.html');
}