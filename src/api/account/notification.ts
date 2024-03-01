export async function getNotifications() {
  const response = await fetch("/account/notification/get", {
    method: "GET",
  });
  return response.json();
}
export async function markAsRead(id: string) {
  const response = await fetch("/account/notification/mark-as-read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  return response.json();
}
