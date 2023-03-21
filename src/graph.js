export async function callMsGraph(accessToken, endpoint) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(`https://graph.microsoft.com/v1.0/${endpoint}?whatif`, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function callAPI(accessToken, response) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(`https://workloads-api.azurewebsites.net/workloads/${response.TargetWorkloadId}`, options) 
        .then(response => response.json())
        .catch(error => console.log(error));
}