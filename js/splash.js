let timer = 25;
let	scoreboard,
	messages;

function preload() {
	messages = loadJSON('/js/messages.json');
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
			"timer": timer,
			"results": []
		};

		storeItem('scoreboard', JSON.stringify(scoreboard));
	}

	timer = scoreboard.timer;
	select('#timer').html(timer);
	select('#start').mousePressed(startGame);
}

function draw() {

}

function startGame() {
	window.location.assign(window.location.origin + '/rating.html');
}