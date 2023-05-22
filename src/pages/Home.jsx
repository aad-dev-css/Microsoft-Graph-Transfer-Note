import React, { useState } from 'react';
import '../styles/App.css';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequestGraph } from '../authConfig';
import { loginRequestAPI } from '../authConfig';
import { callMsGraph } from '../graph';
import { callAPI } from '../graph';
import { Note } from '../components/Note';

const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [apiOutput, setApiOutput] = useState(null);
    const [endpoint, setEndpoint] = useState('');
    const [endpointOutput, setEndpointOutput] = useState('');
    const [message, setMessage] = useState('');


    const handleChange = (event) => {
        setEndpoint(event.target.value);
    };

    const onButtonClick = () => {
        RequestWhatIf(endpoint)
    };


    function RequestWhatIf(endpoint) {
        setEndpointOutput(endpoint);
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequestGraph,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken, endpoint).then((response) => {

                    if(response.TargetWorkloadId !== undefined){
                        RequestAPI(response)    
                    }else{
                        const invalidObj = {
                            TargetWorkloadId : "Null", Team : "Null", Routing : "Null"
                        }
                        setResult(invalidObj)
                    }
   
                });
            });
    }

    function setResult(payload){
        var newMessage = ""
        if(payload.TargetWorkloadId === "Null"){
            newMessage = "Invalid MS Graph API endpoint. Please confirm if the endpoint inserted is correct and well-formated e.g. me/manager"
        }else if(payload.TargetWorkloadId !== "Null" && payload.Team === "Null"){
            newMessage = "Team/Routing currently not found in this webapp's API."
        }else{
            newMessage = `The https://graph.microsoft.com/v1.0/${endpoint} endpoint has the ${payload.TargetWorkloadId} TargetWorkloadId, which is within the support boundaries of the ${payload.Team} Support Team, in the ${payload.Routing} SAP.`
        }

        setMessage(newMessage)
        setApiOutput(payload)
    }


    function RequestAPI(payload) {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequestAPI,
                account: accounts[0],
            })
            .then((response) => {
                callAPI(response.accessToken, payload).then((response) => {

                    if(response.TargetWorkloadId !== undefined){
                        setResult(response)  
                        console.log("valid")  
                    }else{
                        const invalidObj = {
                            TargetWorkloadId : payload.TargetWorkloadId, Team : "Null", Routing : "Null"
                        }
                        console.log("invalid")
                        setResult(invalidObj)
                    }
   
                });
            });
    }

    return (

        <>
            {apiOutput ? (
                <Note apiOutput={apiOutput} endpoint={endpointOutput} message={message}  />
            ) : (
                <p>
                    Insert an endpoint (e.g. "me/manager"):
                </p>
            )}
            <div>
                <input
                    type="text"
                    id="endpoint"
                    name="endpoint"
                    onChange={handleChange}
                    value={endpoint}
                />

                <button onClick={onButtonClick}>Generate Note</button>
            </div>

        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
// const MainContent = () => {
//     return (
//         <div className="App">
//             <AuthenticatedTemplate>
//                 <ProfileContent />
//             </AuthenticatedTemplate>

//             <UnauthenticatedTemplate>
//                 <h5 className="card-title">Please sign-in to see your profile information.</h5>
//             </UnauthenticatedTemplate>
//         </div>
//     );
// };

const Home = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
}

export default Home