//@ts-check

export class Util {
  // Use fetch to POST some JSON and retrieve some JSON
  static postJson(url, bodyJson) {
    return fetch (
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyJson == null ? undefined : JSON.stringify(bodyJson),
      })
      .then (response => response.json());
  }

  // Use fetch to GET some JSON
  static getJson(url) {
    return fetch (url)
      .then (response => response.json());
  }
}