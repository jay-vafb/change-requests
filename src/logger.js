export function logText(text, mode = "default") {
  console.log(text);
}

export function showSuccessMessage(text, $q) {
  $q.notify({
    color: "green-4",
    textColor: "white",
    icon: "cloud_done",
    message: text,
  });
}

export function showErrorMessage(text, $q) {
  $q.notify({
    type: "negative",
    message: text,
  });
}
