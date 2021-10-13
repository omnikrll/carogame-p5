let scoreboard = JSON.parse(window.localStorage.getItem('scoreboard'));
let reset = scoreboard.round >= 3;
let round_text;

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

function processScore() {
	//time modifier = total / time

	//base score = correct / incorrect

	//ai modifier = pass / total

	//ai modified score = base - modifier

	//final score = ai modified score * time modifier
}

document.getElementById('round').innerHTML = round_text;
document.getElementById('count').innerHTML = scoreboard.results.length;
document.getElementById('timer').innerHTML = scoreboard.timer;
document.getElementById('correct').innerHTML = scoreboard.correct;
document.getElementById('fail').innerHTML = scoreboard.fail;
document.getElementById('pass').innerHTML = scoreboard.pass;

function nextRound(event) {
	event.preventDefault();
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

	window.localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
	window.location.assign(window.location.origin + '/index.html');
}

document.getElementById('nextRound').addEventListener('click', nextRound);