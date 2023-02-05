
    using Azure;
    using Azure.Identity;
    using Azure.Security.KeyVault.Secrets;
    using Microsoft.AspNetCore.Authentication.OpenIdConnect;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc.Authorization;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Identity.Web;
    using Microsoft.Identity.Web.UI;
    using System;

namespace MSGraphAPITransferNote
{
    public class Startup
        {
            public Startup(IConfiguration configuration)
            {
                Configuration = configuration;
            }

            public IConfiguration Configuration { get; }

            public void ConfigureServices(IServiceCollection services)
            {
                string[] initialScopes = Configuration.GetValue<string>("DownstreamApi:Scopes")?.Split(' ');

            services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
                    .AddMicrosoftIdentityWebApp(Configuration, "AzureAd")
                      .EnableTokenAcquisitionToCallDownstreamApi(new string[] { "user.read" })
                         .AddDownstreamWebApi("MyApi", Configuration.GetSection("DownstreamApi"))
                      .AddInMemoryTokenCaches();

            services.AddControllersWithViews(options =>
                {
                    var policy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                    options.Filters.Add(new AuthorizeFilter(policy));
                });

                services.AddRazorPages()
                      .AddMicrosoftIdentityUI();


                services.AddServerSideBlazor()
                   .AddMicrosoftIdentityConsentHandler();
            }

            public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
            {
                if (env.IsDevelopment())
                {
                    app.UseDeveloperExceptionPage();
                }
                else
                {
                    app.UseExceptionHandler("/Home/Error");

                    app.UseHsts();
                }
                app.UseHttpsRedirection();
                app.UseStaticFiles();

                app.UseRouting();

                app.UseAuthentication();
                app.UseAuthorization();

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllerRoute(
                        name: "default",
                        pattern: "{controller=Home}/{action=Index}/{id?}");
                    endpoints.MapRazorPages();
                });
            }

        }
}
