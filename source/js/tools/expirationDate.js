export default function initExpirationDate() {
  const container = document.getElementById("expiration-container");
  const value = document.getElementById("expiration-date");
  if (!container || !value) {
    return;
  }

  const expires = container.dataset.expires;
  const updated = container.dataset.updated;
  if (!expires || !updated) {
    return;
  }

  const expiredDate = new Date(expires);
  const updatedDate = new Date(updated);
  if (Number.isNaN(expiredDate.getTime()) || Number.isNaN(updatedDate.getTime())) {
    return;
  }

  const now = new Date();
  const daysAgo = Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24));

  container.classList.add("hidden");

  if (expiredDate < now) {
    container.classList.remove("hidden");
    value.innerHTML = value.innerHTML.replace("some", daysAgo);
  }
}
