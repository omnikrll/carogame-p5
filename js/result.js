let scoreboard,
	reset,
	round_text = 'rounds';

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
}

function setup() {
	scoreboard = JSON.parse(getItem('scoreboard'));
	reset = scoreboard.round >= 3;

	if (scoreboard.round == 1) round_text = 'round';

	let i = scoreboard.round - 1,
		result = scoreboard.results[i];

	if (result.score <= 60) {
		select('#intro_text').html(intro_text[2]);
		select('#outro_text').remove();
	} else if (result.score > 60 && result.score <= 80) {
		select('#intro_text').html(intro_text[1]);
		select('#outro_text').html(outro_text[1]);
	} else if (result.score > 80) {
		select('#intro_text').html(intro_text[0]);
		select('#outro_text').html(outro_text[0]);
	}

	select('#round').html(scoreboard.round + ' ' + round_text);
	select('#count').html(result.posts.length);
	select('#timer').html(result.time_elapsed);
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