# MS-Graph-API-Transfer-Note

Repository for the MS Graph API Transfer Note project.

**Frontend:**

-Visual Studio Code project using React. It's a webapp where a user can insert the relative URL of a MS Graph API endpoint to return a transfer note with the endpoint used, SAP, Support Team, and Workload ID.

-Based on the following sample: https://github.com/Azure-Samples/ms-identity-javascript-react-spa

-To run locally, simply create a .env file with the following variables:
REACT_APP_REDIRECT_URI=http://localhost:3000/
REACT_APP_CLIENT_ID=
REACT_APP_TENANT_ID=

Todo:

-Make the project prettier.
-Refactor it.
-Make it support beta endpoints as well.
-Make it support calls with methods other than GET.

**Backend:**

-See the MS Graph API Transfer Note API repo.
