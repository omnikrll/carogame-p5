let scoreboard,
	reset,
	round_text = 'rounds',
	messages,
	messageSet,
	messageSound,
	restartSound;

let intro_text = [
	'Great job! You are a great moderator. Maybe even one of our best. But, play again and keep improving your score!',
	'Hmm, this wasn’t your best score, was it? Try to improve next time or your boss may need to talk to you about your performance.',
	'We’re gonna have to let you go. Here at conmod’s, the leading content moderation company for all major platforms, accuracy AND speed really matters here. You just don’t have what it takes.'
];

let outro_text = [
	'Remember, 100% is what we’re aiming for at conmod’s, the leading content moderation company for all major technology platforms.',
	'Play again and try to beat your current score! Remember, 100% is what we’re aiming for at conmod’s, the leading content moderation company for all major technology platforms.'
];

function preload() {
	messages = loadJSON('/js/messages.new.json');
	soundFormats('mp3', 'ogg');
	messageSound = loadSound('/assets/audio/gameplay-05.ogg');
	restartSound = loadSound('/assets/audio/gameplay-01.ogg');
}

function setup() {
	noCanvas();
	scoreboard = JSON.parse(getItem('scoreboard'));

	if (scoreboard.round == 1) round_text = 'round';

	let i = scoreboard.round - 1,
		result = scoreboard.results[i];

	if (result.score <= 60) {
		select('#intro_text').html(intro_text[2]);
		select('#outro_text').remove();
		select('#nextRound').html('Try Again');
	} else if (result.score > 60 && result.score <= 80) {
		select('#intro_text').html(intro_text[1]);
		select('#outro_text').html(outro_text[1]);
	} else if (result.score > 80) {
		select('#intro_text').html(intro_text[0]);
		select('#outro_text').html(outro_text[0]);
	}

	reset = scoreboard.round >= 3 || result.score <= 60;

	loadMessages();

	select('#round').html(scoreboard.round + ' ' + round_text);
	select('#count').html(result.posts.length);
	select('#timer').html(result.time_elapsed);
	select('#correct').html(scoreboard.correct);
	select('#fail').html(scoreboard.fail);
	select('#pass').html(scoreboard.pass);
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
		scoreboard.timer = 25;
		scoreboard.results = [];
	} else {
		scoreboard.round++;
		scoreboard.timer -= 5;
	}

	storeItem('scoreboard', JSON.stringify(scoreboard));

	restartSound.onended(function() {
		window.location.assign(window.location.origin + '/index.html');		
	});

	restartSound.play();
}