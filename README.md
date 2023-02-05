# MS-Graph-API-Transfer-Note

Repository for the MS Graph API Transfer Note project.

**Frontend:**

-Visual Studio 2022 project using ASP.NET Core. It's a webapp where a user can insert the relative URL of a MS Graph API endpoint to return a transfer note with the endpoint used, SAP, Support Team, and Workload ID.

-Based on the following sample: https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-1-Call-MSGraph

-Follow the instructions on the sample above to configure the App Registration and the project's appsettings.json file.

Todo:

-There's an issue that happens when a user is already logged while the app runs again, where the consentHandler.HandleException(ex) from the Result() method runs twice in the first submit. That makes the of the "endpoint" string get lost. This only happens once per execution when the user is already logged in, afterwards this issue stops happening.

-Make the project prettier.

-Right now, the note message returned is a placeholder, where everything but the endpoint and the workloadid are hardcoded. Once the backend is developed, the frontend will get the message from there instead.

**Backend:**

-Todo

