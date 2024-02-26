export async function updateProfile(name: string, email: string) {
  const response = await fetch("/account/profile/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });
  return response.json();
}

export async function updateProfilePicture(picture: string) {
  const response = await fetch("/account/profile/update-picture", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ picture }),
  });
  return response.json();
}
