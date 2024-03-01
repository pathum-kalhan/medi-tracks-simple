export async function uploadTestResults(
  patientId: string,
  testResults: string
) {
  const response = await fetch("/dashboard/lab/upload-test-results", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ patientId, testResults }),
  });
  return response.json();
}
