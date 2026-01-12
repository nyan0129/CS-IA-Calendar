class CalendarEvent {
  constructor(date, title, time, description) {
    this.date = date;
    this.title = title;
    this.time = time;
    this.description = description;
  }
}

class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.events = JSON.parse(localStorage.getItem("events")) || [];
  }

  saveEvents() {
    localStorage.setItem("events", JSON.stringify(this.events));
  }

  addEvent(event) {
    this.events.push(event);
    this.saveEvents();
  }

  getEventsForDate(date) {
    return this.events.filter(e => e.date === date);
  }
}

const calendar = new Calendar();
const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");

let selectedDate = null;

function renderCalendar() {
  calendarEl.innerHTML = "";
  const year = calendar.currentDate.getFullYear();
  const month = calendar.currentDate.getMonth();

  monthYearEl.textContent =
    calendar.currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendarEl.innerHTML += `<div></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month + 1}-${day}`;
    const events = calendar.getEventsForDate(dateStr);

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

  if (title) {
    const event = new CalendarEvent(selectedDate, title, time, desc);
    calendar.addEvent(event);
    renderCalendar();
  }

  document.getElementById("eventModal").style.display = "none";
};

document.getElementById("prevMonth").onclick = () => {
  calendar.currentDate.setMonth(calendar.currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  calendar.currentDate.setMonth(calendar.currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
