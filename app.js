document.addEventListener("DOMContentLoaded", () => {
	const question = document.getElementById("question");
	const choices = Array.from(document.getElementsByClassName("choice-text"));
	const questionText = document.getElementById("question-text");
	const scoreText = document.getElementById("score-text");
	const progressBarFull = document.querySelector(".progress-fill");
	//console.log(progressBarFull);

	let currentQuestion = {};
	let acceptingAnswer = true;
	let score = 0;
	let questionCounter = 0;
	let availableQuestions = [];
	let questions = [];

	fetch("questions.json")
		.then((res) => {
			console.log(res);
			return res.json();
		})
		.then((loadedQuestion) => {
			console.log(loadedQuestion);
			questions = loadedQuestion;
			startGame();
		})
		.catch((err) => {
			console.log(err);
		});

	//CONSTANTS
	const CORRECT_BONUS = 10;
	const MAX_QUESTIONS = 3;

	startGame = () => {
		questionCounter = 0;
		score = 0;
		availableQuestions = [...questions];
		//console.log(availableQuestions);
		getNewQuestion();
	};

	getNewQuestion = () => {
		//exit point
		if (availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS) {
			localStorage.setItem("mostRecentScore", score);
			return window.location.assign("/end.html");
		}

		questionCounter++;
		questionText.innerText = `${questionCounter} / ${MAX_QUESTIONS}`;
		progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

		//console.log(progressBarFull);
		const questionIndex = Math.floor(Math.random() * availableQuestions.length);
		currentQuestion = availableQuestions[questionIndex];
		question.innerText = currentQuestion.question;

		choices.forEach((choice) => {
			const number = choice.dataset["number"];
			//console.log(number);
			choice.innerText = currentQuestion["choice" + number];
		});

		availableQuestions.splice(questionIndex, 1);
		acceptingAnswer = true;
	};

	choices.forEach((choice) => {
		choice.addEventListener("click", (e) => {
			if (!acceptingAnswer) return;

			acceptingAnswer = false;
			const selectedChoice = e.target;
			const selectAnswer = selectedChoice.dataset["number"];

			let classToApply;

			if (selectAnswer == currentQuestion.answer) {
				classToApply = "correct";
			} else {
				classToApply = "incorrect";
			}
			if (classToApply === "correct") {
				incrementScore(CORRECT_BONUS);
			}
			selectedChoice.parentElement.classList.add(classToApply);
			setTimeout(() => {
				selectedChoice.parentElement.classList.remove(classToApply);
				getNewQuestion();
			}, 1000);
		});
	});

	incrementScore = (num) => {
		score += num;
		scoreText.innerText = score;
	};
});
