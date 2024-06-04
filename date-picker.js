//Modular Version Works for Every DateRange Picker that has the class input-container

class DatePicker {
  constructor(container) {
    this.container = container;
    this.initVariables();
    this.initEventsListeners();
    this.generateCalendar(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth()
    );
  }
  createElement(tag, attributes, innerHTML) {
    const element = document.createElement(tag);
    for (const key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
    if (innerHTML) {
      element.innerHTML = innerHTML;
    }
    return element;
  }
  initVariables() {
    this.toggleButton = this.container.querySelector("#toggleButton");
    this.inputPrepend = this.container.querySelector("#sub-prepend");
    this.dropdown = this.container.querySelector("#dropdown");
    this.startDateElem = this.container.querySelector("#startDate");
    this.endDateElem = this.container.querySelector("#endDate");
    this.currentMonthYear = this.container.querySelector("#currentMonthYear");
    this.prevMonthBtn = this.container.querySelector("#prevMonth");
    this.nextMonthBtn = this.container.querySelector("#nextMonth");
    this.sixMonthsBtn = this.container.querySelector(
      ".pre-defined button:nth-child(1)"
    );
    this.threeMonthsBtn = this.container.querySelector(
      ".pre-defined button:nth-child(2)"
    );
    this.lastMonthBtn = this.container.querySelector(
      ".pre-defined button:nth-child(3)"
    );
    this.startDateInput = this.container.querySelector("#startDate");
    this.endDateInput = this.container.querySelector("#endDate");

    this.selectedDates = [];
    this.currentDate = new Date();
    this.prevStartDate = "";
    this.prevEndDate = "";
    this.isDropdownOpen = false;
  }
  initEventsListeners() {
    this.sixMonthsBtn.addEventListener("click", () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 6);
      this.currentDate = new Date(startDate);
      this.updateDateRangeInputAndSelection(startDate, endDate);
    });

    this.threeMonthsBtn.addEventListener("click", () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 3);
      this.currentDate = new Date(startDate);
      this.updateDateRangeInputAndSelection(startDate, endDate);
    });

    this.lastMonthBtn.addEventListener("click", () => {
      const endDate = new Date();
      endDate.setDate(0); // Set to the last day of the previous month
      const startDate = new Date(endDate);
      startDate.setDate(1); // Set to the first day of the same month
      this.currentDate = new Date(startDate);
      this.updateDateRangeInputAndSelection(startDate, endDate);
    });

    this.startDateElem.addEventListener(
      "blur",
      () => this.updateCalendarFromInput
    );
    this.endDateElem.addEventListener(
      "blur",
      () => this.updateCalendarFromInput
    );
    this.startDateInput.addEventListener("keyup", (evt) => {
      this.formatDate(evt, "startDate");
    });
    this.endDateInput.addEventListener("keyup", (evt) => {
      this.formatDate(evt, "endDate");
    });
    this.startDateInput.addEventListener("change", (evt) => {
      this.handleDateInputChange(evt);
    });
    this.endDateInput.addEventListener("change", (evt) => {
      this.handleDateInputChange(evt);
    });
    this.startDateInput.addEventListener("focus", (e) => {
      this.prevStartDate = e.target.value;
    });
    this.endDateInput.addEventListener("focus", (e) => {
      this.prevEndDate = e.target.value;
    });
    this.prevMonthBtn.addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.generateCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth()
      );
    });

    this.nextMonthBtn.addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.generateCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth()
      );
    });
    console.log(this.inputPrepend);
    this.inputPrepend.addEventListener("click", () => {
      this.isDropdownOpen = true;
      if (this.isDropdownOpen) {
        this.isDropdownOpen = !this.isDropdownOpen;
        this.dropdown.style.display = "block";
        this.dropdown.style.maxHeight = "100%";
        this.toggleButton.innerHTML = '<img src="arrow-up.svg" alt="Up Arrow">';
      }
    });
    this.toggleButton.addEventListener("click", () => {
      this.isDropdownOpen = !this.isDropdownOpen;
      console.log(this.isDropdownOpen);
      if (this.isDropdownOpen) {
        this.dropdown.style.display = "block";
        this.dropdown.style.maxHeight = "100%";
        this.toggleButton.innerHTML = '<img src="arrow-up.svg" alt="Up Arrow">';
      } else {
        this.dropdown.style.maxHeight = "0";
        this.dropdown.style.display = "none";
        this.toggleButton.innerHTML =
          '<img src="arrow-down.svg" alt="Down Arrow">';
        this.startDateElem.style.color = "#000";
        this.endDateElem.style.color = "#000";
      }
    });
  }
  generateCalendar(year, month) {
    const calendarBody = this.container.querySelector("#calendar-body");
    calendarBody.innerHTML = "";

    this.currentMonthYear.textContent = `${this.getMonthName(month)} ${year}`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    let row = this.createElement("tr");
    for (let i = 0; i < firstDayOfWeek; i++) {
      const cell = this.createElement("td");
      row.appendChild(cell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = this.createElement("td");
      cell.classList.add("calendar-date");
      cell.id = `${String(day).padStart(2, "0")}.${String(month + 1).padStart(
        2,
        "0"
      )}.${year}`;
      cell.textContent = day;
      cell.addEventListener("click", (event) => {
        this.handleDateClick(event);
      });

      let cellDateStr = `${String(day).padStart(2, "0")}.${String(
        month + 1
      ).padStart(2, "0")}.${year}`;
      if (this.selectedDates.includes(cellDateStr)) {
        cell.classList.add("date-selected");
      }

      row.appendChild(cell);

      if (row.children.length === 7) {
        calendarBody.appendChild(row);
        row = this.createElement("tr");
      }
    }
    calendarBody.appendChild(row);
  }
  getMonthName(month) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  }
  formatDate(evt) {
    let value = evt.target.value;

    if (evt.key >= "0" && evt.key <= "9") {
      var size = value.length;

      if (size === 2 && parseInt(value) < 32) {
        evt.target.value += ".";
      } else if (size === 5 && parseInt(value.split(".")[1]) < 13) {
        evt.target.value += ".";
      }

      this.updateCalendarFromInput();
    }
  }
  updateDateRangeInputAndSelection(startDate, endDate) {
    // Set input values
    this.container.querySelector("#startDate").value =
      this.formatDateToInputString(startDate);
    this.container.querySelector("#endDate").value =
      this.formatDateToInputString(endDate);

    // Update selections
    this.selectedDates = [
      this.formatDateToInputString(startDate),
      this.formatDateToInputString(endDate),
    ];

    this.generateCalendar(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth()
    );
  }
  formatDateToInputString(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
  handleDateInputChange(event) {
    console.log(event);
    const startDateInput = this.container.querySelector("#startDate");
    const endDateInput = this.container.querySelector("#endDate");

    // Convert string input to Date objects for comparison
    const startDateObj = new Date(
      startDateInput.value.split(".").reverse().join("-")
    );
    const endDateObj = new Date(
      endDateInput.value.split(".").reverse().join("-")
    );

    if (startDateObj && endDateObj) {
      if (endDateObj < startDateObj) {
        alert("End date cannot be before the start date.");

        // Check which input triggered the event and revert only that
        if (event.target.id === "startDate") {
          startDateInput.value = this.prevStartDate;
        } else if (event.target.id === "endDate") {
          endDateInput.value = this.prevEndDate;
        }
        return;
      } else {
        this.prevStartDate = startDateInput.value;
        this.prevEndDate = endDateInput.value;
        this.selectedDates = [
          this.formatDateToInputString(startDateObj),
          this.formatDateToInputString(endDateObj),
        ];
        this.currentDate = startDateObj;
        this.generateCalendar(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth()
        );
      }
    } else {
      if (startDateInput.value) {
        this.prevStartDate = startDateInput.value;
      }
      if (endDateInput.value) {
        this.prevEndDate = endDateInput.value;
      }
    }
  }
  formatDate(evt, dateField) {
    if (
      (evt.keyCode >= 48 && evt.keyCode <= 57) ||
      (evt.keyCode >= 96 && evt.keyCode <= 105)
    ) {
      var size = this.container.querySelector(`#${dateField}`).value.length;

      if (
        (size == 2 &&
          this.container.querySelector(`#${dateField}`).value < 32) ||
        (size == 5 &&
          Number(
            this.container.querySelector(`#${dateField}`).value.split(".")[1]
          ) < 13)
      ) {
        this.container.querySelector(`#${dateField}`).value += ".";
      }
    }
  }
  updateCalendarFromInput() {
    const startDateVal = this.startDateElem.value;
    const endDateVal = this.endDateElem.value;
    console.log(endDateVal);

    this.selectedDates = [];
    if (startDateVal) this.selectedDates.push(startDateVal);
    if (endDateVal) this.selectedDates.push(endDateVal);

    this.generateCalendar(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth()
    );
  }
  updateCalendarHighlighting() {
    this.container.querySelectorAll(".calendar-date").forEach((cell) => {
      if (this.selectedDates.includes(cell.id)) {
        cell.classList.add("date-selected");
      } else {
        cell.classList.remove("date-selected");
      }
    });
  }
  handleDateClick(event) {
    const cell = event.target;

    if (this.selectedDates.length === 2) {
      this.selectedDates = [];
      this.enablePreviousDates();
    }

    if (!this.selectedDates.includes(cell.id)) {
      this.selectedDates.push(cell.id);
    }

    if (this.selectedDates.length === 1) {
      this.startDateElem.value = this.selectedDates[0];
      this.endDateElem.value = "";
      this.disablePreviousDates();
      this.container.querySelector("#endDate").style.color = "#FF4400";
      this.container.querySelector("#startDate").style.color = "#000";
    } else if (this.selectedDates.length === 2) {
      this.endDateElem.value = this.selectedDates[1];
      this.enablePreviousDates();
      this.container.querySelector("#endDate").style.color = "#FF4400";
      this.container.querySelector("#startDate").style.color = "#000";
      this.dropdown.style.maxHeight = "0";
      this.dropdown.style.display = "none";
      this.toggleButton.innerHTML =
        '<img src="arrow-down.svg" alt="Down Arrow">';
      this.startDateElem.style.color = "#000";
      this.endDateElem.style.color = "#000";
    }
    this.updateCalendarHighlighting();
  }
  disablePreviousDates() {
    const cells = this.container.querySelectorAll(".calendar-date");
    cells.forEach((cell) => {
      const cellDate = new Date(cell.id.split(".").reverse().join("-"));
      if (
        new Date(this.selectedDates[0].split(".").reverse().join("-")) >
        cellDate
      ) {
        cell.classList.add("calendar-date-disabled");
      }
    });
  }

  enablePreviousDates() {
    const cells = this.container.querySelectorAll(".calendar-date");
    cells.forEach((cell) => {
      cell.classList.remove("calendar-date-disabled");
    });
  }
}
// Instantiation
const calendars = document.querySelectorAll(".input-container");
calendars.forEach((cal) => new DatePicker(cal));
