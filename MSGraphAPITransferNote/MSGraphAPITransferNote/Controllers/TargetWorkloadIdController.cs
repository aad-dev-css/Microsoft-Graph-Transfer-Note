using Azure;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using MSGraphAPITransferNote.Models;
using System.Text;

namespace MSGraphAPITransferNote.Controllers
{
    [Authorize]
    public class TargetWorkloadIdController : Controller
    {
        private readonly ILogger<TargetWorkloadIdController> _logger;

        private const string ServiceName = "MyApi";

        private IDownstreamWebApi _downstreamWebApi;
        private readonly MicrosoftIdentityConsentAndConditionalAccessHandler _consentHandler;

        private Boolean backendlessMode;

        private string backendlessModeMessage;

        private string baseUrl;

        public TargetWorkloadIdController(ILogger<TargetWorkloadIdController> logger,
                            IConfiguration configuration,
                            IDownstreamWebApi graphServiceClient,
                            MicrosoftIdentityConsentAndConditionalAccessHandler consentHandler)
        {
            _logger = logger;
            _downstreamWebApi = graphServiceClient;
            this._consentHandler = consentHandler;
            backendlessMode = configuration.GetValue<Boolean>("BackendlessMode");
            backendlessModeMessage = configuration.GetValue<string>("BackendlessModeMessage");
            baseUrl = configuration.GetValue<string>("DownstreamApi:BaseUrl");
            this._consentHandler = consentHandler;


        }

        [AuthorizeForScopes(ScopeKeySection = "DownstreamApi:Scopes")]
        public async Task<IActionResult> Result(string endpoint)
        {
            String message = "Invalid endpoint.";
            WhatIfModel whatIf;
            try
            {
                whatIf = await _downstreamWebApi.CallWebApiForUserAsync<Object, WhatIfModel>(
                ServiceName,
                null,
                options =>
                {
                options.RelativePath = endpoint + "?whatif";
                });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("IDW10502"))
                {
                    //TODO: Solve issue where endpoint var gets lost the first time in a session when this exception happens
                    _consentHandler.HandleException(ex);
                    throw;
                }
                else
                {
                    ViewData["message"] = message;
                    return View();
                }
            }


            if (backendlessMode)
            {
                message = backendlessModeMessage;
                message = message.Replace("$ENDPOINT", baseUrl + endpoint).Replace("$TARGETWORKLOADID", whatIf.TargetWorkloadId).Replace("$TEAMNAME", "Test Team").Replace("$SAPPATH", "Azure/Test/SAP");
                ViewData["message"] = message;
                return View();
            }
            //TODO: backend implementation
            var client = new HttpClient();
            var payload = new StringContent("{\"targetLoadId\":\"" + whatIf.TargetWorkloadId + "\"}", Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://192.168.0.200/createNote", payload);
            message = response.Content.ToString() == null ? message = "Error occurred with the backend communication." : response.Content.ToString();
            //END TODO
            ViewData["message"] = message;
            return View();
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}