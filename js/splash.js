let scoreboard = window.localStorage.getItem('scoreboard');
let timer = 30;
let messages,
	timeout,
	interval;

fetch('/js/messages.json')
	.then(response => response.json())
	.then(data => {
		messages = data.splash;
	});

if (!!scoreboard) {
	scoreboard = JSON.parse(scoreboard);
} else {
	scoreboard = {
		"round": 1,
		"correct": 0,
		"fail": 0,
		"pass": 0,
		"timer": timer,
		"results": []
	}

	window.localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
}

timer = scoreboard.timer;
document.getElementById('timer').innerHTML = timer;

let messageBox = document.querySelector('#message');
let messageText = document.querySelector('#message p');

function displayMessage() {
	let subset;

	if (scoreboard.round == 1) {
		subset = messages.start;
	} else if (correct > fail) {
		subset = messages.good;
	} else if (correct == fail) {
		subset = messages.okay;
	} else if (correct < fail) {
		subset = messages.bad;
	}

	let message = subset[Math.floor(Math.random() * subset.length)];

	messageText.innerHTML = message;
	messageBox.addEventListener('animationend', function(event) {
		messageBox.removeEventListener('animationend');
		messageBox.classList.remove('active');
	});
	messageBox.classList.add('active');
}

document.getElementById('start').addEventListener('click', function(event) {
	event.preventDefault();
	window.location.assign(window.location.origin + '/rating.html');
});