const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImxlcmFuam9obnNvbjQyMEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjEwNzA4IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy92ZXJzaW9uIjoiMTA5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9saW1pdCI6IjEwMCIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcCI6IkJhc2ljIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9sYW5ndWFnZSI6ImVuLWdiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjA5OS0xMi0zMSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcHN0YXJ0IjoiMjAyMy0xMi0yMCIsImlzcyI6Imh0dHBzOi8vYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTcwMzc2NzA0NCwibmJmIjoxNzAzNzU5ODQ0fQ.dljP2hRkGpHkfxnt62P46kW9Es3-ci_E2s5J-M93ITE';

let symptoms = [];
let gender = '';
let birthYear = '';

document.addEventListener('DOMContentLoaded', function () {
    const url = 'https://healthservice.priaid.ch/symptoms?token=' + token + '&format=json&language=en-gb';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            symptoms = data;

            const selectElement = document.getElementById('symptoms');
            symptoms.forEach(item => {
                const option = document.createElement('option');
                option.value = item.Name;
                option.textContent = item.Name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching symptoms:', error));
    const storedGender = localStorage.getItem('selectedGender');
    const storedBirthYear = localStorage.getItem('selectedBirthYear');

    if (storedGender) {
        gender = storedGender;
        document.getElementById('gender').value = gender;
    }

    if (storedBirthYear) {
        birthYear = storedBirthYear;
        document.getElementById('birthYear').value = birthYear;
    }
});

document.getElementById('gender').addEventListener('change', function () {
    gender = this.value;
    localStorage.setItem('selectedGender', gender);
});

document.getElementById('birthYear').addEventListener('input', function () {
    birthYear = this.value;
    localStorage.setItem('selectedBirthYear', birthYear);
});


function addSymptom() {
    const selectedSymptomInput = document.getElementById('selectedSymptom');
    const selectedSymptomsList = document.getElementById('selectedSymptoms');

    const selectedSymptomName = selectedSymptomInput.value.trim();

    if (selectedSymptomName === '') {
        return;
    }

    getSymptomIds(selectedSymptomName)
        .then(selectedSymptomId => {
            const listItem = document.createElement('li');
            listItem.textContent = selectedSymptomName;

            listItem.classList.add('symptom-item');
            listItem.dataset.id = selectedSymptomId;

            listItem.addEventListener('click', function () {
                removeSymptom(selectedSymptomId);
                selectedSymptomsList.removeChild(listItem);
            });

            listItem.addEventListener('mouseover', function () {
                listItem.style.color = 'red';
            });

            listItem.addEventListener('mouseout', function () {
                listItem.style.color = '';
            });

            if (!selectedSymptoms.includes(selectedSymptomId)) {
                selectedSymptoms.push(selectedSymptomId);
            }

            selectedSymptomsList.appendChild(listItem);

            selectedSymptomInput.value = '';
        })
        .catch(error => console.error('Error getting symptom IDs:', error));
}

function removeSymptom(symptomId) {
    const index = selectedSymptoms.indexOf(symptomId);
    if (index !== -1) {
        selectedSymptoms.splice(index, 1);
    }
}


function getSymptomIdByName() {
    const url = 'https://healthservice.priaid.ch/symptoms?token=' + token + '&format=json&language=en-gb';
    return fetch(url).then(res => res.json()).then(symptoms => symptoms);
}

async function getSymptomIds(selectedSymptomName) {
    const symptomList = await getSymptomIdByName();
    const selectedSymptom = symptomList.find(item => item.Name === selectedSymptomName);

    if (selectedSymptom) {
        return selectedSymptom.ID;
    } else {
        throw new Error('Symptom not found');
    }
}

const selectedSymptoms = [];


function updateDiagnosesList(diagnoses) {
    const diagnosesList = document.getElementById('Diagnoses');

    diagnosesList.innerHTML = '';

    diagnoses.forEach(diagnosis => {
        const listItem = document.createElement('li');
        listItem.textContent = 'Diagnoses: ' + diagnosis.Issue.Name + ' Accuracy: ' + diagnosis.Issue.Accuracy + '%';
        diagnosesList.appendChild(listItem);
    });
}

function getDiagnoses() {
    if (selectedSymptoms.length > 0) {
        const diagnosisUrl = 'https://healthservice.priaid.ch/diagnosis?symptoms=[' + selectedSymptoms.join(',') + ']&gender=' + gender + '&year_of_birth=' + birthYear + '&token=' + token + '&format=json&language=en-gb';

        fetch(diagnosisUrl)
            .then(res => res.json())
            .then(diagnoses => {
                console.log('Diagnoses:', diagnoses);
                if (diagnoses.length > 0) {
                    const firstDiagnosis = diagnoses[0];
                    localStorage.setItem('firstDiagnosis', JSON.stringify(firstDiagnosis));
                }

                updateDiagnosesList(diagnoses);
            })
            .catch(error => console.error('Error fetching diagnoses:', error));
    } else {
        console.log('No symptoms selected for diagnosis.');
    }
}
