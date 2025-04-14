let config;
let found = [];
let score = 0;

// Load sounds
const foundSound = new Audio('sounds/found.mp3');
const winSound = new Audio('sounds/win.mp3');

fetch('config.json')
	.then(res => res.json())
	.then(data => {
		config = data;
		document.getElementById("title").innerText = config.gameTitle;
		loadImages();
	});

function loadImages() {
	const img1 = document.getElementById("image1");
	const img2 = document.getElementById("image2");

	img1.src = config.images.image1;
	img2.src = config.images.image2;

	img1.onload = () => setupCanvas("canvas1", img1);
	img2.onload = () => setupCanvas("canvas2", img2);

	img1.addEventListener("click", handleClick);
	img2.addEventListener("click", handleClick);
}

function setupCanvas(canvasId, image) {
	const canvas = document.getElementById(canvasId);
	canvas.width = image.clientWidth;
	canvas.height = image.clientHeight;
}

function handleClick(e) {
	const rect = e.target.getBoundingClientRect();
	const xClick = e.clientX - rect.left;
	const yClick = e.clientY - rect.top;

	config.differences.forEach((diff, index) => {
		if (!found.includes(index)) {
			const scaleX = e.target.naturalWidth / e.target.clientWidth;
			const scaleY = e.target.naturalHeight / e.target.clientHeight;

			const scaledX = diff.x / scaleX;
			const scaledY = diff.y / scaleY;
			const scaledW = diff.width / scaleX;
			const scaledH = diff.height / scaleY;

			if (
				xClick >= scaledX && xClick <= scaledX + scaledW &&
				yClick >= scaledY && yClick <= scaledY + scaledH
			) {
				found.push(index);
				drawCircle("canvas1", scaledX + scaledW / 2, scaledY + scaledH / 2);
				drawCircle("canvas2", scaledX + scaledW / 2, scaledY + scaledH / 2);
				foundSound.play(); // 🔊 Play sound when a difference is found
				updateScore();
			}
		}
	});
}

function drawCircle(canvasId, x, y) {
	const canvas = document.getElementById(canvasId);
	const ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.strokeStyle = "red";
	ctx.lineWidth = 3;
	ctx.arc(x, y, 20, 0, 2 * Math.PI);
	ctx.stroke();
}

function updateScore() {
	score++;
	document.getElementById("score").innerText = `Score: ${score}`;
	if (score === config.differences.length) {
		document.getElementById("message").innerText = "🎉 Well Done! All differences found!";
		winSound.play(); // 🔊 Play final sound
	}
}
