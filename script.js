let currentUser = null;
let viewMode = "shared";

class CalendarEvent {
  constructor(date, title, time, desc, owner, isPrivate) {
    this.date = date;
    this.title = title;
    this.time = time;
    this.desc = desc;
    this.owner = owner;
    this.isPrivate = isPrivate;
  }
}

function login() {
  const username = document.getElementById("usernameInput").value;
  if (!username) return;

  currentUser = username;
  localStorage.setItem("currentUser", username);

  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  renderCalendar();
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

currentUser = localStorage.getItem("currentUser");
if (currentUser) {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");
const calendarDate = new Date();

function getAllEvents() {
  return JSON.parse(localStorage.getItem("events")) || [];
}

function saveEvents(events) {
  localStorage.setItem("events", JSON.stringify(events));
}

function setView(mode) {
  viewMode = mode;
  renderCalendar();
}

function renderCalendar() {
  calendarEl.innerHTML = "";
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  monthYearEl.textContent = calendarDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) calendarEl.innerHTML += "<div></div>";

  const events = getAllEvents();

  for (let d = 1; d <= days; d++) {
    const dateStr = `${year}-${month + 1}-${d}`;

    const dayEvents = events.filter(e =>
      e.date === dateStr &&
      (!e.isPrivate || e.owner === currentUser) &&
      (viewMode === "shared" ? !e.isPrivate : e.owner === currentUser)
    );

    calendarEl.innerHTML += `
      <div class="day" onclick="openModal('${dateStr}')">
        <strong>${d}</strong>
        ${dayEvents.map(e => `<div>${e.title}</div>`).join("")}
      </div>
    `;
  }
}

function openModal(date) {
  window.selectedDate = date;
  document.getElementById("eventModal").style.display = "block";
}

function closeModal() {
  document.getElementById("eventModal").style.display = "none";
}

document.getElementById("saveEvent").onclick = () => {
  const title = eventTitle.value;
  if (!title) return;

  const events = getAllEvents();
  events.push(
    new CalendarEvent(
      selectedDate,
      title,
      eventTime.value,
      eventDesc.value,
      currentUser,
      privateEvent.checked
    )
  );

  saveEvents(events);
  closeModal();
  renderCalendar();
};

prevMonth.onclick = () => {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar();
};

nextMonth.onclick = () => {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar();
};

function syncWithGoogleCalendar() {
  alert("Google Calendar sync simulated for IA.");
}

renderCalendar();
