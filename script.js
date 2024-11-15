let currentMonth = new Date();
let selectedDate = null;

// Initialize year options
function initializeYearOptions() {
	const yearSelect = document.getElementById("yearSelect");
	const currentYear = currentMonth.getFullYear();
	for (let year = currentYear - 50; year <= currentYear + 50; year++) {
		const option = document.createElement("option");
		option.value = year;
		option.text = year;
		if (year === currentYear) option.selected = true;
		yearSelect.add(option);
	}
}

function generateCalendar(year, month) {
	const date = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const startDay = date.getDay();

	document.getElementById("currentMonth").innerText = `${date.toLocaleString(
		"default",
		{
			month: "long",
		}
	)} ${year}`;

	const calendarElement = document.getElementById("calendar");
	calendarElement.innerHTML = "";

	for (let i = 0; i < startDay; i++) {
		const emptyDiv = document.createElement("div");
		calendarElement.appendChild(emptyDiv);
	}

	for (let day = 1; day <= daysInMonth; day++) {
		const dayElement = document.createElement("div");
		dayElement.className = "calendar-day";
		dayElement.innerText = day;
		dayElement.onclick = () => openNotepad(`${day}-${month + 1}-${year}`);
		calendarElement.appendChild(dayElement);
	}
}

function openNotepad(date) {
	selectedDate = date;
	document.getElementById("selectedDate").innerText = date;
	document.getElementById("notepad").style.display = "block";
	document.getElementById("background-overlay").style.display = "block";
	document.getElementById("entryText").value = "";
}

function closeNotepad() {
	document.getElementById("notepad").style.display = "none";
	document.getElementById("background-overlay").style.display = "none";
}

function saveEntry() {
	const text = document.getElementById("entryText").value;
	if (text.trim()) {
		console.log(`Saving entry for ${selectedDate}: ${text}`);
		// API call to save to DynamoDB
		closeNotepad();
	} else {
		alert("Please write something in your entry!");
	}
}

function changeMonth(direction) {
	currentMonth.setMonth(currentMonth.getMonth() + direction);
	generateCalendar(currentMonth.getFullYear(), currentMonth.getMonth());
}

function openYearMonthPopup() {
	document.getElementById("year-month-overlay").style.display = "flex";
}

function closeYearMonthPopup() {
	document.getElementById("year-month-overlay").style.display = "none";
}

function setYearMonth() {
	const month = parseInt(document.getElementById("monthSelect").value);
	const year = parseInt(document.getElementById("yearSelect").value);
	currentMonth = new Date(year, month, 1);
	closeYearMonthPopup();
	generateCalendar(year, month);
}

// Initialize calendar and year options
initializeYearOptions();
generateCalendar(currentMonth.getFullYear(), currentMonth.getMonth());
