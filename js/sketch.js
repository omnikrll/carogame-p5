let data,
	post,
	displayPost,
	button1,
	button2,
	button3;

let scoreboard = {
	"correct": 0,
	"fail": 0,
	"pass": 0
}

let keyCodes = [70, 74, 32];

function preload() {
	data = loadJSON('/js/data.json');
}

function setup() {
	createCanvas(1024, 768);
	console.log(data.content);
	noLoop();
}

function draw() {
	renderPlayfield();
	renderPost();
}

function renderPlayfield() {
	background('#959595');
	
	displayPost = rect(192, 80, 640, 240);
	button1 = rect(192, 480, 180, 80);
	text('Approve', 200, 488, 172, 72);

	button2 = rect(422, 480, 180, 80);
	text('AI Decides', 430, 488, 172, 72);

	button3 = rect(652, 480, 180, 80);	
	text('Harmful', 660, 488, 172, 72);
}

function getRandomPost() {
	let i = Math.floor(Math.random() * data.content.length);

	return data.content.splice(i, 1)[0];
}

function renderPost() {
	post = getRandomPost();
	textSize(24);
	text(post.text, 216, 104, 616, 216);
}

function approve() {
	if (post.human_rating == 0) {
		scoreboard.correct++
	} else {
		scoreboard.fail++;
	}	
}

function deny() {
	if (post.human_rating > 0) {
		scoreboard.correct++;
	} else {
		scoreboard.fail++;
	}
}

function pass() {
	scoreboard.pass++;
}

function keyPressed(event) {
	if (keyCodes.indexOf(keyCode) > -1) {
		event.preventDefault();	
		console.log(scoreboard);
		switch (keyCode) {
			case 70:
				approve();
				break;
			case 74:
				deny();
				break;
			case 32:
				pass();
				break;

		}
		renderPlayfield();
		renderPost();
	}

}