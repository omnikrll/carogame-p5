let gotham,
	ds_digital,
	digital7,
	data,
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
	gotham = loadFont('assets/fonts/gotham/Gotham/Gotham-Book.otf');
	digital7 = loadFont('assets/fonts/digital_7/digital-7 (mono italic).ttf');
	ds_digital = loadFont('assets/fonts/ds_digital/DS-DIGIT.TTF');
	data = loadJSON('/js/data.json');
}

function setup() {
	createCanvas(1024, 768);
	console.log(data.content);
}

function draw() {
	renderPlayfield();

	console.log(post);
	if (post == undefined) {
		console.log(post == undefined);
		renderPost();
		loop();
	}
}

function renderPlayfield() {
	background('#959595');
	
	displayPost = rect(192, 80, 640, 240);

	button1 = createButton('Approve');
	button1.size(180, 80);
	button1.position(192, 480);
	button1.style('font-family', 'Gotham');
	button1.style('font-weight', 'lighter');
	button1.style('text-align', 'center');

	button2 = createButton('AI Decides');
	button2.size(180, 80);
	button2.position(422, 480);
	button2.style('font-family', 'Gotham');
	button2.style('font-weight', 'lighter');
	button2.style('text-align', 'center');

	button3 = createButton('Harmful');
	button3.size(180, 80);
	button3.position(652, 480);	
	button3.style('font-family', 'Gotham');
	button3.style('font-weight', 'lighter');
	button3.style('text-align', 'center');
}

function getRandomPost() {
	let i = Math.floor(Math.random() * data.content.length);

	return data.content.splice(i, 1)[0];
}

function renderPost() {
	noLoop();
	post = getRandomPost();
	textSize(24);
	text(post.text, 216, 104, 616, 216);
	textFont(gotham);
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

// function keyPressed(event) {
// 	if (keyCodes.indexOf(keyCode) > -1) {
// 		event.preventDefault();	
// 		console.log(scoreboard);
// 		switch (keyCode) {
// 			case 70:
// 				approve();
// 				break;
// 			case 74:
// 				deny();
// 				break;
// 			case 32:
// 				pass();
// 				break;

// 		}
// 		renderPlayfield();
// 		renderPost();
// 	}

// }