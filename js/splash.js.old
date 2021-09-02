let scoreboard = window.localStorage.getItem('scoreboard');
let timer = 30;
let messages,
	timeout,
	interval;

fetch('/js/messages.json')
	.then(response => response.json())
	.then(data => {
		if (scoreboard.round == 1) {
			messages = data.splash.start;
		} else if (scoreboard.correct > fail) {
			messages = data.splash.good;
		} else if (scoreboard.correct == fail) {
			messages = data.splash.okay;
		} else if (scoreboard.correct < fail) {
			messages = data.splash.bad;
		}
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
	let i = Math.floor(Math.random() * messages.length),
		message = messages[i];

	messageText.innerHTML = message;
	messageBox.classList.add('active');

	messageBox.addEventListener('animationend', function(event) {
		alert('hello');
		messageBox.removeEventListener('animationend');
		messageBox.classList.remove('active');
	});
}

function initialize() {
	displayMessage();
	clearTimeout(timeout);
	interval = setInterval(displayMessage, 5000);
}

timeout = setTimeout(initialize, 300);

document.getElementById('start').addEventListener('click', function(event) {
	event.preventDefault();
	clearInterval(interval);
	window.location.assign(window.location.origin + '/rating.html');
});