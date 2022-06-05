export function fetchingData(url, settings) {
  fetch(url, settings).then(response.text());
}
