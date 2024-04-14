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

  if(endpoint.includes("?")){
    endpoint = endpoint + "&whatif"
  }else{
    endpoint = endpoint + "?whatif"
  }

  return fetch(endpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function callAPI(accessToken, workloadId) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(
    `https://workloads-api.azurewebsites.net/workloads/${workloadId}`,
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

export async function submitHelpful(accessToken, wasHelpful) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      DidItHelp: wasHelpful
    }),
  };

  return fetch("https://workloads-api.azurewebsites.net/helpful", options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}