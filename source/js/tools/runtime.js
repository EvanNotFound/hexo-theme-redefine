let runtimeActive = false;

const footerRuntime = () => {
  if (!runtimeActive) {
    return;
  }

  const startTime = theme.footerStart;
  if (!startTime) {
    runtimeActive = false;
    return;
  }

  window.setTimeout(footerRuntime, 1000);

  const startDate = new Date(startTime);
  const nowDate = new Date();
  const diff = nowDate.getTime() - startDate.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const daysFloat = diff / dayMs;
  const days = Math.floor(daysFloat);
  const hoursFloat = (daysFloat - days) * 24;
  const hours = Math.floor(hoursFloat);
  const minutesFloat = (hoursFloat - hours) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.floor((minutesFloat - minutes) * 60);

  const runtimeDays = document.getElementById("runtime_days");
  const runtimeHours = document.getElementById("runtime_hours");
  const runtimeMinutes = document.getElementById("runtime_minutes");
  const runtimeSeconds = document.getElementById("runtime_seconds");

  if (runtimeDays) runtimeDays.innerHTML = days;
  if (runtimeHours) runtimeHours.innerHTML = hours;
  if (runtimeMinutes) runtimeMinutes.innerHTML = minutes;
  if (runtimeSeconds) runtimeSeconds.innerHTML = seconds;
};

export default function initFooterRuntime() {
  if (runtimeActive) {
    return;
  }

  runtimeActive = true;
  footerRuntime();
}
