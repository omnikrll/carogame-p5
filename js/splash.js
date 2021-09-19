let timer = 25;
let	scoreboard,
	messages,
	messageSet;

function preload() {
	messages = loadJSON('/js/messages.new.json');
}

function setup() {
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
			"results": []
		};

		storeItem('scoreboard', JSON.stringify(scoreboard));
	}

	loadMessages();

	timer = scoreboard.timer;
	select('#timer').html(timer);
	select('#start').mousePressed(startGame);
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
	if (frameCount % 180 == 0) {
		displayMessage();
	}
}

function displayMessage() {
	let i = Math.floor(Math.random() * messageSet.length),
		message = messageSet[i];

	console.log(message);
}

function startGame() {
	window.location.assign(window.location.origin + '/rating.html');
}