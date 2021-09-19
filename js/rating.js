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
	time_elapsed = null,
	timerDisplay = false,
	timerFontSize = 32,
	goal = 1000,
	newTickets = 100,
	results = [],
	correctSound,
	failSound,
	messageSound,
	passSound,
	roundOverSound,
	music,
	messages,
	messageSet;

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
	correctSound = loadSound('/assets/audio/gameplay-01.ogg');
	failSound = loadSound('/assets/audio/p5_alert_2-0db.ogg');
	messageSound = loadSound('/assets/audio/gameplay-05.ogg');
	passSound = loadSound('/assets/audio/gameplay-04.ogg');
	roundOverSound = loadSound('/assets/audio/p5_alert_4-0db.ogg');
	music = loadSound('/assets/audio/gameloop.ogg');
	messages = loadJSON('/js/messages.new.json');
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

	loadMessages();

	music.loop();
}

function draw() {
	select('#count').html(results.length);
	select('.newTickets span').html(newTickets);

	if (!post) {
		renderPost();
	}

	if (run && frameCount % 60 == 0 && timer > 0) {
		timer--;

		time_elapsed = scoreboard.timer - timer;

		if (timer <= 5) {
			timerFontSize += 4;
			timerDisplay.style('font-size', timerFontSize + 'px');
		}

		console.log(time_elapsed, data.content.length);
	}

	if (run && frameCount % 105 == 0) {
		newTickets += Math.floor(Math.random() * 20);
	}

	if (frameCount % 180 == 0) {
		displayMessage();
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
		noLoop();
		roundOver();
	}
}

function loadMessages() {
	if (scoreboard.running_score == 0) {
		messageSet = messages[0];
	} else if (scoreboard.running_score > 0 && scoreboard.running_score <= 60) {
		messageSet = messages[3];
	} else if (scoreboard.running_score > 60 && scoreboard.running_score <= 80) {
		messageSet = messages[2];
	} else if (scoreboard.running_score >= 80) {
		messageSet = messages[1];
	}
}

function displayMessage() {
	let i = Math.floor(Math.random() * messageSet.length),
		message = messageSet[i];

	console.log(message);
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
	if (data.content.length == 0) {
		roundOver();
	}
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
	if (post.human_rating == post.ai_rating) {
		scoreboard.correct++
		correctSound.play();
	} else {
		scoreboard.fail++;
		failSound.play();
	}	
	handleResult(-1);
}

function handleResult(value) {
	if (!!menu) {
		menu.remove();
	}
	post.player_rating = value;
	results.push(post);
	console.log(results.length);
	renderPost();
}

function processScore() {
	let time_modifier = results.length / time_elapsed,
		base_score = +scoreboard.correct / +scoreboard.fail,
		ai_modifier = +scoreboard.pass / +results.length,
		modified_score = base_score - ai_modifier,
		score = modified_score * time_elapsed,
		round = {
			"posts": results,
			"time_elapsed": time_elapsed,
			"score": score
		};

	scoreboard.running_score = score;

	return round;
}

function roundOver() {
	music.stop();

	roundOverSound.onended(function() {
		alert('Round Over');
		let i = scoreboard.round - 1;
		scoreboard.results[i] = processScore();
		console.log(scoreboard.results);
		storeItem('scoreboard', JSON.stringify(scoreboard));
		window.location.assign(window.location.origin + '/result.html');
	});

	roundOverSound.play();
}