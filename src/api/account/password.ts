export async function changePassword(oldPassword: string, newPassword: string) {
  const response = await fetch("/account/password/change", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  return response.json();
}
