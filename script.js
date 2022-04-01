const bounds = document.getElementById('bounds');
const p1 = document.getElementById('p1');
const p2 = document.getElementById('p2');
const ball = document.getElementById('ball');

let containerCords = bounds.getBoundingClientRect();
let gamePaused = true;

function moveCharacter(character, num) {
	const char = character === 1 ? p1 : p2;
	const top = window.getComputedStyle(char, null).getPropertyValue('top');
	const dist = parseInt(top.replace('px', '')) + (num * 20);
	if (dist > 0 && (dist + 120) < containerCords.bottom) {
		char.style.top = dist + 'px';	
	}
	
}

const keys = {
	'ArrowUp': false,
	'ArrowDown': false,
	'KeyW': false,
	'KeyS': false
};

window.addEventListener('keydown', function(e) {
	keys[e.code] = true;
})

window.addEventListener('keyup', function(e) {
	keys[e.code] = false;
	if (e.code == 'Space') {
		const pause = document.getElementById('paused');
		pause.classList.toggle('hidden');
		gamePaused = !gamePaused;
		playSound('pause');
	}
})

function paddleCheck(pNum) {
	
	const ballHeight = Math.round(ball.getBoundingClientRect().top + 10);
	const p1Height = Math.round(p1.getBoundingClientRect().top);
	const p1Bottom = p1Height + 100;
	const p2Height = Math.round(p2.getBoundingClientRect().top);
	const p2Bottom = p2Height + 100;
	
	if (pNum == 1) {
		if (!moveLeft && ballHeight > p1Height && ballHeight < p1Bottom) {
			distX ++;
			distY ++;
			moveLeft = true;
			playSound('hit');
		}
	}
	if (pNum == 2) {
		if (moveLeft && ballHeight > p2Height && ballHeight < p2Bottom) {
			distX ++;
			distY ++;
			moveLeft = false;
			playSound('hit');
		}
	}
	
}

let score = [0,0];
function updateScore(ind) {
	score[ind] ++ ;
	document.getElementById('p1-score').innerHTML = score[0];
	document.getElementById('p2-score').innerHTML = score[1];
}


// moving ball function

let moveDown = true;
let moveLeft = true;
const startX = (Math.round(containerCords.right) - 5) / 2;
const startY = (Math.round(containerCords.bottom) - 5) / 2;
let elementPosition = [startX, startY];
let distX = 7;
let distY = 11;

function step() {
	if (gamePaused) {return};
	const touchLeft = elementPosition[0] < 0;
	const touchTop = elementPosition[1] < 0;
	const touchRight = (elementPosition[0] + 20) >= containerCords.width - 15;
	const touchBottom = (elementPosition[1] + 20) > containerCords.height - 15;
	
	if (elementPosition[0] < 30 && elementPosition[0] > 20) {
		paddleCheck(1);
	}
	if ((elementPosition[0] + 20) > containerCords.width - 30 && (elementPosition[0] + 20) < containerCords.width - 20)  {
		paddleCheck(2);
	}
	
	if (touchRight) {
		moveLeft = false;
		updateScore(0);
		playSound('score');
	}
	if (touchBottom) {
		moveDown = false;
		playSound('wall');
	}
	if (touchLeft) {
		moveLeft = true;
		updateScore(1);
		playSound('score');
	}
	if (touchTop) {
		moveDown = true;
		playSound('wall');
	}
	
	
	
	elementPosition[0] += moveLeft ? distX : -distX;
	elementPosition[1] += moveDown ? distY : -distY;

		ball.style.left = elementPosition[0] + 'px';
		ball.style.top = elementPosition[1] + 'px';	
	
	// move boards
	if (keys.ArrowUp) {
		moveCharacter(2, -1);
	}
	if (keys.ArrowDown) {
		moveCharacter(2, 1);
	}
	if (keys.KeyW) {
		moveCharacter(1, -1);
	}
	if (keys.KeyS) {
		moveCharacter(1, 1);
	}
	
}

window.onload = setInterval( function() {
	step();
}, 50);


function playSound(sound) {
	// new Audio("sample.mp3");
	console.log(sound);
	var audio = document.getElementById(sound);

	audio.currentTime = 0
	audio.volume = 0.1;
   audio.play();
}