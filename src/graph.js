export async function callMsGraph(accessToken, endpoint, method, body) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  const options = {
    method: method,
    headers: headers,
  };

  if(method !== "GET"){
    options.body = body
  }

  return fetch(`${endpoint}?whatif`, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function callAPI(accessToken, response) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(
    `https://workloads-api.azurewebsites.net/workloads/${response.TargetWorkloadId}`,
    options
  )
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function submitFeedback(accessToken, feedback) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      Title: feedback.title,
      Description: feedback.description,
    }),
  };

  return fetch("https://workloads-api.azurewebsites.net/feedback/", options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
