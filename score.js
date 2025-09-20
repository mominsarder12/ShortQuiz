const highScoreLists = document.querySelector("#score-lists");
console.log(highScoreLists);
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];


highScores.forEach((score, index) => {
    // create a <tr>
    const row = document.createElement("tr");

    // create <td> for serial number
    const slNoCell = document.createElement("td");
    slNoCell.innerText = index + 1; // start from 1

    // create <td> for username
    const nameCell = document.createElement("td");
    nameCell.innerText = score.name;

    // create <td> for score
    const scoreCell = document.createElement("td");
    scoreCell.innerText = score.score;

    // append <td>s into <tr>
    row.appendChild(slNoCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);

    // append <tr> into the table body (score-lists)
    highScoreLists.appendChild(row);
});
