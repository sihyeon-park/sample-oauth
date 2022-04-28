/* eslint-disable */
const { defineConfig } = require("@vue/cli-service");
const { google } = require("googleapis");
const url = require("url");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // client와 같은 domain을 사용하도록 하는 방식.
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }
      const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "http://localhost:3000/oauth2callback"
      );
      const scopes = ["https://www.googleapis.com/auth/groups", "openid"];
      const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        include_granted_scopes: true,
      });

      devServer.app.get("/auth", (req, res) => {
        res.writeHead(301, { Location: authorizationUrl });
        res.end();
      });
      devServer.app.get("/oauth2callback", async (req, res) => {
        try {
          let q = url.parse(req.url, true).query;
          console.log(q.code);
          let { tokens } = await oauth2Client.getToken(q.code);
          console.log(tokens);
          oauth2Client.setCredentials(tokens);
          const info = await oauth2Client.getTokenInfo(tokens.access_token);
          console.log(info);
          const script = google.script({ version: "v1", auth: oauth2Client });
          const { data } = await script.scripts.run({
            scriptId:
              "AKfycbyJe_mttGc5gCIWYS4a2SWVeZhqYtubz1tcjxW-2wNrYzihq-pztZxHxG1d5NYuGwoI",
            requestBody: {
              function: "listMyGroupEmails",
              parameters: [],
              devMode: false,
            },
          });
          console.log("result", data);
          res.writeHead(301, { Location: "http://localhost:8080" });
          res.write(JSON.stringify(data));
        } catch (error) {
          console.error(error);
        }
        res.end();
      });

      return middlewares;
    },
  },
});
