let timer = 10,
	amount = 20;

let	scoreboard,
	messages,
	messageSet,
	messageSound,
	music,
	startSound;

function preload() {
	messages = loadJSON('/js/messages.new.json');
	soundFormats('mp3', 'ogg');
	music = loadSound('/assets/audio/gameloop.ogg');
	messageSound = loadSound('/assets/audio/gameplay-05.ogg');
	startSound = loadSound('/assets/audio/gameplay-01.ogg');
}

function setup() {
	noCanvas();

	if (getItem('scoreboard') != null) {
		scoreboard = JSON.parse(getItem('scoreboard'));
	} else {
		scoreboard = {
			"round": 1,
			"correct": 0,
			"fail": 0,
			"pass": 0,
			"running_score": 0,
			"timer": timer,
			"ai_rate": 0.02,
			"amount": amount,
			"results": []
		};

		storeItem('scoreboard', JSON.stringify(scoreboard));
	}

	loadMessages();

	timer = scoreboard.timer;
	select('#timer').html(timer);
	select('#amount').html(amount);
	select('#start').mousePressed(startGame);

	music.loop();
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

function draw() {
	if (frameCount % 420 == 0) {
		displayMessage();
	}
}

function displayMessage() {
	let i = Math.floor(Math.random() * messageSet.length),
		message = messageSet[i];

	let messageDiv = createDiv(message).addClass('message');
	document.querySelector('.message').addEventListener('animationend', function() {
		messageDiv.remove();
	});

	messageSound.play();
}

function startGame() {
	music.stop();

	startSound.onended(function() {
		window.location.assign(window.location.origin + '/rating.html');
	});

	startSound.play();
}