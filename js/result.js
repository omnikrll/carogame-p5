let scoreboard,
	reset,
	messages,
	messageSet,
	messageSound,
	restartSound;

function preload() {
	messages = loadJSON('/js/messages.new.json');
	soundFormats('mp3', 'ogg');
	messageSound = loadSound('/assets/audio/gameplay-05.ogg');
	restartSound = loadSound('/assets/audio/gameplay-01.ogg');
}

function setup() {
	noCanvas();
	scoreboard = JSON.parse(getItem('scoreboard'));

	let i = scoreboard.round - 1,
		result = scoreboard.results[i];

	let winner = result.player_score > result.ai_score ? "You" : "The AI";

	reset = scoreboard.round >= 3 || result.score <= 60;

	loadMessages();

	select('#ai_rate').html(scoreboard.ai_rate);
	select('#ai_score').html(result.ai_score *= 100);
	select('#time_elapsed').html(result.time_elapsed);
	select('#player_score').html(result.player_score *= 100);
	select('#winner').html(winner);
	select('#nextRound').mousePressed(nextRound);
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

function nextRound() {
	scoreboard.correct = 0;
	scoreboard.fail = 0;
	scoreboard.pass = 0;

	if (reset) {
		scoreboard.round = 1;
		scoreboard.timer = 10;
		scoreboard.results = [];
	} else {
		scoreboard.round++;
	}

	storeItem('scoreboard', JSON.stringify(scoreboard));

	restartSound.onended(function() {
		window.location.assign(window.location.origin + '/index.html');		
	});

	restartSound.play();
}