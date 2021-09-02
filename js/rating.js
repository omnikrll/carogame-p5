let mainWindow = false,
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
	goal = 1000,
	newTickets = 100,
	results = [],
	correctSound,
	failSound,
	messageSound,
	passSound;

let run = true;

let reasons = [
	'Sexism / Misogyny',
	'Racism / Xenophobia',
	'Homophobia / Transphobia',
	'Ethnic or Religious Slur',
	'Physical Threats',
	'Sexual Threats',
	'Other',
	'Harassment (negative)'
];

let avatars = ['square', 'triangle', 'circle', 'hex'];

function preload() {
	data = loadJSON('/js/data.json');
	soundFormats('mp3', 'ogg');
	correctSound = loadSound('/assets/audio/p5_alert_3-0db.ogg');
	failSound = loadSound('/assets/audio/p5_alert_2-0db.ogg');
	messageSound = loadSound('/assets/audio/p5_alert_1-0db.ogg');
	passSound = loadSound('/assets/audio/p5_alert_4-0db.ogg');
}

function setup() {
	renderPlayfield();

	if (getItem('scoreboard') != null) {
		scoreboard = JSON.parse(getItem('scoreboard'));
	}

	timer = scoreboard.timer;
	newTickets *= scoreboard.round;

	if (scoreboard.results[scoreboard.round - 1]) {
		goal = scoreboard.results[scoreboard.round - 1].length * 2;
	}

	select('#goal').html(goal);
}

function draw() {
	select('#count').html(results.length);
	select('.newTickets span').html(newTickets);

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

	if (run && frameCount % 105 == 0) {
		newTickets += Math.floor(Math.random() * 20);
	}

	if (results.length  > 1) {
		let rate = scoreboard.timer / results.length;
		select('#rate').html(rate.toFixed(2));
	} else {
		select('#rate').html(scoreboard.timer);
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
		mainWindow = select('.mainWindow');
	}

	if (!timerDisplay) {
		timerDisplay = select('.timerDisplay .timer');
		timerDisplay.style('font-size', timerFontSize + 'px');
	}
	
	if (!button1) {
		button1 = select('.rateButton.approve');
		button1.mousePressed(approve);
	}

	if (!button2) {
		button2 = select('.rateButton.pass');
		button2.mousePressed(pass);
	}

	if (!button3) {
		button3 = select('.rateButton.deny');
		button3.mousePressed(denyMenu);
	}
}

function getRandomPost() {
	let i = Math.floor(Math.random() * data.content.length);
	return data.content.splice(i, 1)[0];
}

function getRandomAvatarClass() {
	let i = Math.floor(Math.random() * avatars.length);
	return avatars[i];
}

let previousClass;

function renderPost() {
	noLoop();
	post = getRandomPost();
	select('.post').html(post.text);
	let newClass = getRandomAvatarClass();
	select('.avatar').removeClass(previousClass).addClass(newClass);
	previousClass = newClass;
	loop();
}

function approve() {
	if (post.human_rating == 0) {
		scoreboard.correct++;
		correctSound.play();
	} else {
		scoreboard.fail++;
		failSound.play();
	}
	handleResult(0);
}

function denyMenu() {
	menu = createDiv().addClass('menu').parent(select('.postDiv'));

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
	if (post.human_rating == value) {
		scoreboard.correct++;
		correctSound.play();
	} else {
		scoreboard.fail++;
		failSound.play();
	}
	handleResult(value);
}

function pass() {
	scoreboard.pass++;
	passSound.play();
	handleResult(-1);
}

function handleResult(value) {
	if (!!menu) {
		menu.remove();
	}
	post.player_rating = value;
	results.push(post);
	renderPost();
}

function roundOver() {
	noLoop();
	// alert('round over');
	scoreboard.results.push(results);
	storeItem('scoreboard', JSON.stringify(scoreboard));
	window.location.assign(window.location.origin + '/result.html');
}