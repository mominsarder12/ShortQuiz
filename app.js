document.addEventListener("DOMContentLoaded", () => {
	const question = document.getElementById("question");
	const choices = Array.from(document.getElementsByClassName("choice-text"));
	const questionText = document.getElementById("question-text");
	const scoreText = document.getElementById("score-text");
	const progressBarFull = document.querySelector(".progress-fill");
	const loader = document.querySelector(".loader");
	const game = document.querySelector("#game");
	//console.log(progressBarFull);

	let currentQuestion = {};
	let acceptingAnswer = true;
	let score = 0;
	let questionCounter = 0;
	let availableQuestions = [];
	let questions = [];

	function decodeHTML(html) {
		const txt = document.createElement("textarea");
		txt.innerHTML = html;
		return txt.value;
	}

	fetch("https://opentdb.com/api.php?amount=20&category=9&difficulty=easy")
		.then((res) => res.json())
		.then((loadedQuestions) => {
			//console.log(loadedQuestions.results);

			// questions = loadedQuestions.results.map((loadedQuestion) => {
			// 	const formattedQuestion = {
			// 		question: loadedQuestion.question,
			// 	};

			// 	// copy incorrect answers
			// 	const answerChoices = [...loadedQuestion.incorrect_answers];

			// 	// insert correct answer at random position
			// 	formattedQuestion.answer =
			// 		Math.floor(Math.random() * answerChoices.length) + 1;
			// 	answerChoices.splice(
			// 		formattedQuestion.answer - 1,
			// 		0,
			// 		loadedQuestion.correct_answer
			// 	);

			// 	// assign choices into choice1, choice2, ...
			// 	answerChoices.forEach((choice, index) => {
			// 		formattedQuestion["choice" + (index + 1)] = choice;
			// 	});
			// 	//console.log(formattedQuestion);
			// 	return formattedQuestion;
			// });

			questions = loadedQuestions.results.map((loadedQuestion) => {
				const formattedQuestion = {
					question: decodeHTML(loadedQuestion.question),
				};

				// copy incorrect answers
				const answerChoices = [...loadedQuestion.incorrect_answers].map((a) =>
					decodeHTML(a)
				);

				// insert correct answer at random position
				formattedQuestion.answer =
					Math.floor(Math.random() * answerChoices.length) + 1;
				answerChoices.splice(
					formattedQuestion.answer - 1,
					0,
					decodeHTML(loadedQuestion.correct_answer)
				);

				// assign choices into choice1, choice2, ...
				answerChoices.forEach((choice, index) => {
					formattedQuestion["choice" + (index + 1)] = choice;
				});

				return formattedQuestion;
			});

			 startGame();
		})
		.catch((err) => {
			console.log(err);
		});

	//CONSTANTS
	const CORRECT_BONUS = 10;
	const MAX_QUESTIONS = 20;

	startGame = () => {
		questionCounter = 0;
		score = 0;
		availableQuestions = [...questions];
		//console.log(availableQuestions);
		getNewQuestion();
		//Hide or show appears here
		game.classList.remove("hidden");
		loader.classList.add("hidden");
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
