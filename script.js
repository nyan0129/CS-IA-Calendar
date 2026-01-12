class CalendarEvent {
  constructor(date, title, time, description, isPrivate = false) {
    this.date = date;
    this.title = title;
    this.time = time;
    this.description = description;
    this.isPrivate = isPrivate;
  }
}

class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.sharedEvents =
      JSON.parse(localStorage.getItem("sharedEvents")) || [];
    this.privateEvents =
      JSON.parse(localStorage.getItem("privateEvents")) || [];
  }

  save() {
    localStorage.setItem(
      "sharedEvents",
      JSON.stringify(this.sharedEvents)
    );
    localStorage.setItem(
      "privateEvents",
      JSON.stringify(this.privateEvents)
    );
  }

  addEvent(event) {
    if (event.isPrivate) {
      this.privateEvents.push(event);
    } else {
      this.sharedEvents.push(event);
    }
    this.save();
  }

  getEventsForDate(date, viewMode) {
    if (viewMode === "private") {
      return this.privateEvents.filter(e => e.date === date);
    }
    return this.sharedEvents.filter(e => e.date === date);
  }
}

const calendar = new Calendar();
const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");

let selectedDate = null;
let viewMode = "shared";

function setView(mode) {
  viewMode = mode;
  renderCalendar();
}

function renderCalendar() {
  calendarEl.innerHTML = "";

  const year = calendar.currentDate.getFullYear();
  const month = calendar.currentDate.getMonth();

  monthYearEl.textContent =
    calendar.currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric"
    });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendarEl.innerHTML += `<div></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month + 1}-${day}`;
    const events = calendar.getEventsForDate(dateStr, viewMode);

    calendarEl.innerHTML += `
      <div class="day" onclick="openModal('${dateStr}')">
        <strong>${day}</strong>
        ${events.map(e => `<div>${e.title}</div>`).join("")}
      </div>
    `;
  }
}

function openModal(date) {
  selectedDate = date;
  document.getElementById("eventModal").style.display = "block";
}

document.getElementById("closeModal").onclick = () => {
  document.getElementById("eventModal").style.display = "none";
};

document.getElementById("saveEvent").onclick = () => {
  const title = document.getElementById("eventTitle").value;
  const time = document.getElementById("eventTime").value;
  const desc = document.getElementById("eventDesc").value;
  const isPrivate = document.getElementById("privateEvent").checked;

  if (title) {
    const event = new CalendarEvent(
      selectedDate,
      title,
      time,
      desc,
      isPrivate
    );
    calendar.addEvent(event);
    renderCalendar();
  }

  document.getElementById("eventModal").style.display = "none";
};

document.getElementById("prevMonth").onclick = () => {
  calendar.currentDate.setMonth(
    calendar.currentDate.getMonth() - 1
  );
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  calendar.currentDate.setMonth(
    calendar.currentDate.getMonth() + 1
  );
  renderCalendar();
};

function syncWithGoogleCalendar() {
  alert(
    "Google Calendar synchronization enabled.\n" +
    "This feature is simulated for IA demonstration purposes."
  );
}

renderCalendar();
