// --- DOM Elements ---
const groupSizeInput = document.getElementById("group-size");
const pickRandomGroupBtn = document.getElementById("pick-button");
const deselectAfterPickedInput = document.querySelector(".deselect-after-picked > input");
const resultBox = document.getElementById("result-text");

const namesInput = document.getElementById("names-input");
const csvUpload = document.getElementById("csv-upload");
const fileNameDisplay = document.getElementById("file-name");
const loadNamesBtn = document.getElementById("load-names");

const peopleSection = document.getElementById("people-section");
const peopleList = document.getElementById("people-list");
const peopleCount = document.getElementById("people-count");

const selectAllBtn = document.getElementById("select-all");
const deselectAllBtn = document.getElementById("deselect-all");
const clearAllBtn = document.getElementById("clear-all");

const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// --- State ---
let deselectAfterPicked = false;
let csvData = null;
let firstTimePicking = true;

// --- Tab Switching ---
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(`${btn.dataset.tab}-tab`).classList.add("active");
    });
});

// --- CSV Upload ---
csvUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        fileNameDisplay.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
            csvData = event.target.result;
        };
        reader.readAsText(file);
    }
});

// --- Parse Names ---
function parseCSV(text) {
    const lines = text.trim().split("\n");
    if (lines.length === 0) return [];

    const firstLine = lines[0].toLowerCase().trim();
    const hasHeader = firstLine.includes("name") || firstLine.includes(",");
    const startIndex = hasHeader ? 1 : 0;

    let nameColIndex = 0;
    if (hasHeader) {
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/^"|"$/g, ""));
        const idx = headers.findIndex(h => h === "name" || h === "names");
        if (idx !== -1) nameColIndex = idx;
    }

    const names = [];
    for (let i = startIndex; i < lines.length; i++) {
        const cols = lines[i].split(",");
        const name = cols[nameColIndex]?.trim().replace(/^"|"$/g, "");
        if (name) names.push(name);
    }
    return names;
}

function parseTextarea(text) {
    return text.trim().split("\n").map(n => n.trim()).filter(n => n.length > 0);
}

// --- Load Names ---
loadNamesBtn.addEventListener("click", () => {
    const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
    let names = [];

    if (activeTab === "textarea") {
        names = parseTextarea(namesInput.value);
    } else if (activeTab === "csv" && csvData) {
        names = parseCSV(csvData);
    }

    if (names.length === 0) {
        alert("No names found. Please enter names or upload a valid CSV file.");
        return;
    }

    loadPeopleList(names);
});

function loadPeopleList(names) {
    peopleList.innerHTML = "";
    names.forEach((name, i) => {
        const div = document.createElement("div");
        div.className = "person";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.id = `person-${i}`;
        checkbox.className = "person-checkbox";

        const label = document.createElement("label");
        label.htmlFor = `person-${i}`;
        label.textContent = name;

        div.appendChild(checkbox);
        div.appendChild(label);
        peopleList.appendChild(div);

        checkbox.addEventListener("change", () => {
            div.classList.toggle("selected", !checkbox.checked);
        });
    });

    peopleCount.textContent = names.length;
    peopleSection.style.display = "";
    resultBox.textContent = "Ready! Click 'Pick Random Group' to start.";
    firstTimePicking = true;
}

// --- Select / Deselect / Clear ---
selectAllBtn.addEventListener("click", () => {
    document.querySelectorAll(".person-checkbox").forEach(cb => {
        cb.checked = true;
        cb.parentElement.classList.remove("selected");
    });
});

deselectAllBtn.addEventListener("click", () => {
    document.querySelectorAll(".person-checkbox").forEach(cb => {
        cb.checked = false;
        cb.parentElement.classList.add("selected");
    });
});

clearAllBtn.addEventListener("click", () => {
    peopleList.innerHTML = "";
    peopleCount.textContent = "0";
    peopleSection.style.display = "none";
    resultBox.textContent = "Load names to get started";
});

// --- Deselect After Picked ---
deselectAfterPickedInput.addEventListener("change", () => {
    deselectAfterPicked = deselectAfterPickedInput.checked;
});

// --- Pick Random Group ---
pickRandomGroupBtn.addEventListener("click", () => {
    const groupSize = parseInt(groupSizeInput.value);
    const allPeople = document.querySelectorAll(".person");
    const selectedPeople = Array.from(allPeople).filter(p => p.querySelector(".person-checkbox").checked);

    if (selectedPeople.length === 0) {
        alert("No people available. Load some names first!");
        return;
    }
    if (groupSize > selectedPeople.length) {
        alert(`Group size (${groupSize}) exceeds the number of selected people (${selectedPeople.length}).`);
        return;
    }

    const pickedPeople = [];
    const availablePeople = [...selectedPeople];

    while (pickedPeople.length < groupSize) {
        const randomIndex = Math.floor(Math.random() * availablePeople.length);
        const person = availablePeople[randomIndex];

        pickedPeople.push(person);
        availablePeople.splice(randomIndex, 1);

        if (deselectAfterPicked) {
            person.querySelector(".person-checkbox").checked = false;
            person.classList.add("selected");
        }
    }

    const pickedNames = pickedPeople.map(p => p.querySelector("label").textContent);
    resultBox.textContent = pickedNames.join(", ");

    firstTimePicking = false;
});
