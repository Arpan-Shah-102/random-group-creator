let groupSizeInput = document.getElementById("group-size");
let pickRandomGroupBtn = document.getElementById("pick-button");
let deselectAfterPickedInput = document.querySelector(".deselect-after-picked > input");

let deselectAfterPicked = false;
let resultBox = document.querySelector(".result > p");
let firstTimePicking = true;

deselectAfterPickedInput.addEventListener("change", () => {
    deselectAfterPicked = deselectAfterPickedInput.checked;
});
pickRandomGroupBtn.addEventListener("click", pickRandomGroup);

let eighthGradeCheckbox = document.getElementById("grade8");
let seventhGradeCheckbox = document.getElementById("grade7");
let peopleCheckboxes = document.querySelectorAll(".person");

peopleCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        checkbox.classList.toggle("selected");
        updateGradeCheckbox("seventh", seventhGradeCheckbox);
        updateGradeCheckbox("eighth", eighthGradeCheckbox);
    });
});
seventhGradeCheckbox.addEventListener("change", () => {
    let seventhGradePeople = document.querySelectorAll(".seventh .person-checkbox");
    seventhGradePeople.forEach(personCheckbox => {
        personCheckbox.checked = seventhGradeCheckbox.checked;
        personCheckbox.parentElement.classList.toggle("selected", !seventhGradeCheckbox.checked);
    });
});
eighthGradeCheckbox.addEventListener("change", () => {
    let eighthGradePeople = document.querySelectorAll(".eighth .person-checkbox");
    eighthGradePeople.forEach(personCheckbox => {
        personCheckbox.checked = eighthGradeCheckbox.checked;
        personCheckbox.parentElement.classList.toggle("selected", !eighthGradeCheckbox.checked);
    });
});

function updateGradeCheckbox(gradeClass, gradeCheckbox) {
    let gradePeople = document.querySelectorAll(`.${gradeClass} .person-checkbox`);
    let allChecked = Array.from(gradePeople).every(checkbox => checkbox.checked);
    gradeCheckbox.checked = allChecked;
}

function pickRandomGroup() {
    let groupSize = parseInt(groupSizeInput.value);
    let selectedPeople = Array.from(peopleCheckboxes).filter(checkbox => checkbox.querySelector(".person-checkbox").checked);
    
    if (groupSize > selectedPeople.length) {
        alert("Group size exceeds the number of selected people.");
        return;
    }
    
    let pickedPeople = [];
    let availablePeople = [...selectedPeople]; // Create a copy to pick from
    
    while (pickedPeople.length < groupSize) {
        let randomIndex = Math.floor(Math.random() * availablePeople.length);
        let person = availablePeople[randomIndex];
        
        pickedPeople.push(person);
        availablePeople.splice(randomIndex, 1); // Remove picked person from available pool
        
        if (deselectAfterPicked) {
            person.querySelector(".person-checkbox").checked = false;
            person.classList.remove("selected");
        }
    }
    
    resultBox.textContent = pickedPeople.map(person => person.querySelector("label").textContent).join(", ");
    if (!firstTimePicking) {
        alert(`Group Created:\n\n${pickedPeople.map(person => person.querySelector("label").textContent).join("\n")}`);
    } else {firstTimePicking = false;}

    // Update grade checkboxes after picking
    updateGradeCheckbox("seventh", seventhGradeCheckbox);
    updateGradeCheckbox("eighth", eighthGradeCheckbox);
}
pickRandomGroup();
