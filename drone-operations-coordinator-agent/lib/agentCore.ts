export function handleQuery(text, data) {

  if (text.includes("assign")) {
    return "Calling assignment engine...";
  }

  if (text.includes("available")) {
    return "Fetching pilots...";
  }
}
