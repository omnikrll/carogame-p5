let scoreboard,
	reset,
	round_text;

function preload() {
}

function setup() {
	scoreboard = JSON.parse(getItem('scoreboard'));
	reset = scoreboard.round >= 3;

	switch (scoreboard.round) {
		case 1:
			round_text = "1st";
			break;
		case 2:
			round_text = "2nd";
			break;
		case 3:
			round_text = "3rd";
			break;
	}

	select('#round').html(round_text);
	select('#count').html(scoreboard.results.length);
	select('#timer').html(scoreboard.timer);
	select('#correct').html(scoreboard.correct);
	select('#fail').html(scoreboard.fail);
	select('#pass').html(scoreboard.pass);
	select('#nextRound').mousePressed(nextRound);
}

function draw() {
}

function nextRound() {
	scoreboard.correct = 0;
	scoreboard.fail = 0;
	scoreboard.pass = 0;

	if (reset) {
		scoreboard.round = 1;
		scoreboard.timer = 30;
		scoreboard.results = [];
	} else {
		scoreboard.round++;
		scoreboard.timer -= 5;
	}

	storeItem('scoreboard', JSON.stringify(scoreboard));
	window.location.assign(window.location.origin + '/index.html');
}