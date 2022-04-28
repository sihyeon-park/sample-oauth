/* eslint-disable */
const express = require("express");
require("dotenv").config({ path: "../.env.local" });
const { google } = require("googleapis");
const cors = require("cors");
const url = require("url");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
app.get("/auth", (req, res) => {
  res.writeHead(301, { Location: authorizationUrl });
  res.end();
});

app.get("/oauth2callback", async (req, res) => {
  try {
    let q = url.parse(req.url, true).query;
    let { tokens } = await oauth2Client.getToken(q.code);
    const info = await oauth2Client.getTokenInfo(tokens.access_token);
    const uuid = info.sub;
    res.redirect(
      url.format({
        pathname: "http://localhost:8080/",
        query: {
          ...tokens,
          uuid,
        },
      })
    );
  } catch (error) {
    console.error(error);
  }
  res.end();
});

app.post("/groups", async (req, res) => {
  const tokens = req.body;
  oauth2Client.setCredentials(tokens);
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
  res.json(data);
});

app.listen(port, () => {
  console.log("server start");
});
