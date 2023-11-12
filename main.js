
var scoringSystem = document.getElementById('scoringSystem').value;
var participantsContainer = document.getElementById('participantsContainer');
var judgesContainer = document.getElementById('judgesContainer');
var resultsContainer = document.getElementById('resultsContainer');


var participantsNames = [];
var judgesNames = [];

function createFields(container, count, labelPrefix, inputNamePrefix, namesArray) {
    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        let label = document.createElement('label');
        label.textContent = labelPrefix + i + ': ';

        let input = document.createElement('input');
        input.type = 'text';
        input.name = inputNamePrefix + i;
        input.addEventListener('input', function (event) {
            namesArray[i - 1] = event.target.value;
        });

        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(document.createElement('br'));
    }
}

function createParticipantAndJudgesFields() {
    let participantsCount = document.getElementById('participants').value;;
    let judgesCount = document.getElementById('judgesCount').value;;

    createFields(participantsContainer, participantsCount, 'Учасник ', 'participant', participantsNames);
    createFields(judgesContainer, judgesCount, 'Суддя ', 'judge', judgesNames);
}

function calculateRowTotal(row) {
    let total = 0;

    for (let i = 1; i < row.cells.length - 1; i++) {
        let cell = row.cells[i];
        if (cell) {
            let input = cell.querySelector('input');
            if (input) {
                total += parseFloat(input.value) || 0;
            }
        }
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
}
