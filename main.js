var scoringSystem = document.getElementById('scoringSystem');
var participantsContainer = document.getElementById('participantsContainer');
var judgesContainer = document.getElementById('judgesContainer');
var resultsContainer = document.getElementById('resultsContainer');
var winnersContainer = document.getElementById('winnersContainer');

var participantsNames = [];
var judgesNames = [];
var participantsData = [];

function createFields(container, count, labelPrefix, inputNamePrefix, namesArray) {
    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        let label = document.createElement('label');
        label.textContent = labelPrefix + i + ': ';

        let input = document.createElement('input');
        input.type = 'text';

        input.className = 'main__input';//added Yantowsky
        input.name = inputNamePrefix + i;
        input.addEventListener('input', function (event) {
            namesArray[i - 1] = event.target.value;
        });

        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(document.createElement('br'));
    }
}

function validateGrade(grade) {
    let maxGrade = parseInt(scoringSystem.value);
    return !isNaN(grade) && grade >= 0 && grade <= maxGrade;
}

function createParticipantAndJudgesFields() {
    let participantsCount = document.getElementById('participants').value;
    let judgesCount = document.getElementById('judgesCount').value;

    createFields(participantsContainer, participantsCount, 'Учасник ', 'participant', participantsNames);
    createFields(judgesContainer, judgesCount, 'Суддя ', 'judge', judgesNames);

    document.getElementById("btn_score").style.display = "block";//added Yantowsky
}

function calculateRowTotal(row) {
    let total = 0;
    let participantName = row.cells[0].textContent;
    let participant = participantsData.find(p => p.name === participantName);

    for (let i = 1; i < row.cells.length - 1; i++) {
        let cell = row.cells[i];
        if (cell) {
            let input = cell.querySelector('input');
            if (input) {
                let grade = parseFloat(input.value) || 0;
                if (!validateGrade(grade)) {
                    alert('Invalid grade. Please enter a valid grade between 0 and ' + scoringSystem.value);
                    input.value = '';
                } else {
                    total += grade;
                }
            }
        }
    }

    if (participant) {
        participant.score = total;
    } else {
        participantsData.push({ name: participantName, score: total });
    }

    // Update the last cell in the row with the row sum
    row.cells[row.cells.length - 1].textContent = total;
    return total;
}

function showResults() {
    let participantsCount = document.getElementById('participants').value;
    let judgesCount = document.getElementById('judgesCount').value;

    resultsContainer.innerHTML = '';

    let table = document.createElement('table');
    let headerRow = table.insertRow(0);
    headerRow.insertCell(0).textContent = 'Учасник';
    headerRow.insertCell(participantsCount.value).textContent = 'Сума балів';

    for (let i = 1; i <= judgesCount; i++) {
        headerRow.insertCell(i).textContent = judgesNames[i - 1];
    }

    for (let i = 1; i <= participantsCount; i++) {
        let row = table.insertRow(i);
        row.insertCell(0).textContent = participantsNames[i - 1];

        for (let j = 1; j <= judgesCount; j++) {
            let cell = row.insertCell(j);
            let input = document.createElement('input');
            input.type = 'number';

            input.className = 'main__input';
            input.placeholder = `макс. ${scoringSystem.value}`;//added Yantowsky

            input.name = 'judge' + j + 'participant' + i;
            input.addEventListener('input', function () {
                calculateRowTotal(row);
            });
            cell.appendChild(input);
        }

        // Add an additional cell for the row sum
        let totalCell = row.insertCell(-1);
        totalCell.textContent = calculateRowTotal(row);
    }

    resultsContainer.appendChild(table);

    document.getElementById("btn_result").style.display = "block";//added Yantowsky
}

function showVotingResult() {
    let sortedResults = participantsData.slice().sort((a, b) => b.score - a.score);

    let winnersList = document.getElementById('winnersList');
    winnersList.innerHTML = '';

    let winnersContainer = document.getElementById('winnersContainer');
    winnersContainer.innerHTML = '';

    let resultList = document.createElement('ul');

    let currentPlace = 1;
    let previousScore = null;

    sortedResults.forEach((result, index, array) => {
        let listItem = document.createElement('li');

        if (previousScore !== null && result.score < previousScore) {
            currentPlace++;
        }

        listItem.textContent = `${currentPlace} місце ➭ ${result.name} ➭ ${result.score} балів`;
        resultList.appendChild(listItem);

        previousScore = result.score;
    });

    winnersList.appendChild(resultList);

    if (sortedResults.length > 0) {
        let winnerItem = document.createElement('p');
        winnerItem.textContent = `🥇 Переможець: ${sortedResults[0].name} ➭ ${sortedResults[0].score} балів`;
        winnersContainer.appendChild(winnerItem);
    }

    if (sortedResults.length > 1) {
        let secondPlaceItem = document.createElement('p');
        secondPlaceItem.textContent = `🥈 Друге місце: ${sortedResults[1].name} ➭ ${sortedResults[1].score} балів`;
        winnersContainer.appendChild(secondPlaceItem);
    }

    if (sortedResults.length > 2) {
        let thirdPlaceItem = document.createElement('p');
        thirdPlaceItem.textContent = `🥉 Третє місце: ${sortedResults[2].name} ➭ ${sortedResults[2].score} балів`;
        winnersContainer.appendChild(thirdPlaceItem);
    }

    document.getElementById("byTeam").style.display = "block";//added Yantowsky
}

