export async function patientRegister(name: string, age: number) {
  const response = await fetch("/auth/patient-register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, age }),
  });
  return response.json();
}

export async function doctorRegister(name: string, specialization: string) {
  const response = await fetch("/auth/doctor-register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, specialization }),
  });
  return response.json();
}

export async function pharmacistRegister(
  pharmacyName: string,
  pharmacyRegNo: string,
  pharmacyLocation: string,
  contactNumber: string,
  email: string,
  password: string
) {
  const response = await fetch("/auth/pharmacist-register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pharmacyName,
      pharmacyRegNo,
      pharmacyLocation,
      contactNumber,
      email,
      password,
    }),
  });
  return response.json();
}

export async function laboratoryRegister(
  labName: string,
  labRegNo: string,
  labLocation: string,
  contactNumber: string,
  email: string,
  password: string
) {
  const response = await fetch("/auth/laboratory-register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      labName,
      labRegNo,
      labLocation,
      contactNumber,
      email,
      password,
    }),
  });
  return response.json();
}
