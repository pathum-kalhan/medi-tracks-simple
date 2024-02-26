export async function createPatientRecord(patientId: string, record: string) {
  const response = await fetch("/dashboard/doctor/create-patient-record", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ patientId, record }),
  });
  return response.json();
}

export async function createPrescription(
  patientId: string,
  prescription: string
) {
  const response = await fetch("/dashboard/doctor/create-prescription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ patientId, prescription }),
  });
  return response.json();
}

export async function createSurgery(patientId: string, surgery: string) {
  const response = await fetch("/dashboard/doctor/create-surgery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ patientId, surgery }),
  });
  return response.json();
}
