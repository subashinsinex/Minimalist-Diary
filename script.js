const apiUrl =
	"https://q1lny9hyoj.execute-api.us-east-1.amazonaws.com/production/entries"; // Replace with your API Gateway URL

let currentMonth = new Date();
let selectedDate = null;

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
		{ month: "long" }
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

async function saveEntry() {
	const text = document.getElementById("entryText").value.trim();
	if (!text) {
		alert("Please write something in your entry!");
		return;
	}

	const entry = {
		date: selectedDate,
		text: text,
	};

	// Wrap the entry object in the desired format
	const requestBody = {
		body: JSON.stringify(entry), // Stringify the entry object
	};

	// Show loading indicator
	document.getElementById("notepad").classList.add("loading");

	try {
		const response = await fetch(`${apiUrl}`, {
			method: "POST", // POST method
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody), // Send the request body in the required format
		});

		if (response.ok) {
			// Parse the response body as it's stringified JSON
			const data = await response.json();
			const parsedData = JSON.parse(data.body);

			console.log("Response after saving entry:", parsedData);

			// Assuming the result contains sentiment and a success message
			alert(`Entry saved successfully! Sentiment: ${parsedData.sentiment}`);
			fetchEntries(); // Refresh the entries list
			closeNotepad(); // Close the notepad only after success
		} else {
			const error = await response.json();
			console.error("Failed to save entry:", error);
			alert("Failed to save the entry. Please try again.");
		}
	} catch (error) {
		console.error("Error saving entry:", error);
		alert("An error occurred. Please try again.");
	} finally {
		// Remove loading indicator
		document.getElementById("notepad").classList.remove("loading");
	}
}

async function fetchEntries() {
	const entriesList = document.getElementById("entries-list");
	entriesList.innerHTML = "Loading entries...";

	try {
		const response = await fetch(`${apiUrl}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch entries");
		}

		// Parse the response body
		const data = await response.json();

		// Since the response body is a stringified JSON, parse it
		const parsedData = JSON.parse(data.body);

		console.log("Parsed Response Data:", parsedData);

		entriesList.innerHTML = ""; // Clear loading text

		// Ensure 'entries' exists and is an array
		if (parsedData.entries && Array.isArray(parsedData.entries)) {
			parsedData.entries.forEach((entry) => {
				const entryDiv = document.createElement("div");
				entryDiv.className = "entry";
				entryDiv.innerHTML = `
                    <strong>${entry.date}</strong>: ${entry.text}
                    <em>(${entry.sentiment})</em>`;
				entriesList.appendChild(entryDiv);
			});
		} else {
			entriesList.innerHTML = "No entries available.";
		}
	} catch (error) {
		console.error("Error fetching entries:", error);
		entriesList.innerHTML = "Failed to load entries.";
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
fetchEntries(); // Load entries when the app starts
