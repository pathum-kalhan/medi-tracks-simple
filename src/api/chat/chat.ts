export async function getAllMessages() {
  const response = await fetch("/chat/get-all-messages", {
    method: "GET",
  });
  return response.json();
}

export async function sendMessage(message: string) {
  const response = await fetch("/chat/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  return response.json();
}
