// end page
const username = document.querySelector("#username");
const saveScoreBtn = document.querySelector("#saveScoreBtn");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const finalScore = document.querySelector(".final-score");
finalScore.innerText = mostRecentScore;
const MAX_HIGHSCORES = 5;

//saving score
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; //prevent null return

username.addEventListener("keyup", () => {
	saveScoreBtn.disabled = !username.value;
});
saveHighScore = (e) => {
	e.preventDefault();
	const score = {
		score: mostRecentScore,
		name: username.value,
	};
	highScores.push(score);
	highScores.sort((a, b) => (b.score = a.score));
	highScores.splice(MAX_HIGHSCORES);
	localStorage.setItem("highScores", JSON.stringify(highScores));
	window.location.assign("https://mominsarder12.github.io/ShortQuiz");
};
