/* eslint-disable */
const express = require("express");
require("dotenv").config({ path: "../.env.local" });
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const url = require("url");
const https = require("https");
const redis = require("redis");

const port = 3000;
const redis_port = 6379;

const app = express();
const redis_client = redis.createClient({
  url: "redis://sample-oauth_redis-server_1:6379",
});

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
  res.redirect(301, authorizationUrl);
});

app.get("/oauth2callback", async (req, res) => {
  try {
    let q = url.parse(req.url, true).query;
    let { tokens } = await oauth2Client.getToken(q.code);
    const info = await oauth2Client.getTokenInfo(tokens.access_token);
    const uuid = info.sub;
    res.redirect(
      url.format({
        pathname: "http://localhost:8081/",
        query: {
          ...tokens,
          uuid,
        },
      })
    );
  } catch (e) {
    console.error("Error:: ", e);
  }
  res.end();
});

const checkGroupCache = async (req, res, next) => {
  const { access_token } = req.body;
  const value = await redis_client.get(access_token);
  if (value === null) {
    next();
    return;
  }
  const result = JSON.parse(value);
  res.json(result);
};

app.post("/groups", checkGroupCache, async (req, res) => {
  const { access_token } = req.body;
  oauth2Client.setCredentials({ access_token });
  const script = google.script({ version: "v1", auth: oauth2Client });
  try {
    const { data } = await script.scripts.run({
      scriptId:
        "AKfycbyJe_mttGc5gCIWYS4a2SWVeZhqYtubz1tcjxW-2wNrYzihq-pztZxHxG1d5NYuGwoI",
      requestBody: {
        function: "listMyGroupEmails",
        parameters: [],
        devMode: false,
      },
    });
    await redis_client.set(access_token, JSON.stringify(data), { EX: 10 });
    res.json(data);
  } catch (e) {
    console.error("Error:: ", e);
  }
});

app.post("/refreshToken", async (req, res) => {
  try {
    const token = req.body;
    oauth2Client.setCredentials(token);
    const { credentials } = await oauth2Client.refreshAccessToken();
    res.json({ access_token: credentials.access_token });
  } catch (e) {
    console.error("Error:: ", e);
  }
});

app.get("/revoke", async (req, res) => {
  const token = url.parse(req.url, true).query.token;
  const postData = "token=" + token;
  const postOptions = {
    host: "oauth2.googleapis.com",
    port: "443",
    path: "/revoke",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };
  const postReq = https.request(postOptions, function (resolve) {
    resolve.setEncoding("utf8");
    let responseBody = "";
    resolve.on("data", (d) => {
      responseBody += d;
    });
    resolve.on("end", () => {
      res.json(JSON.parse(responseBody));
    });
  });
  postReq.on("error", (e) => {
    console.error("Error:: ", e);
  });

  postReq.write(postData);
  postReq.end();
});

//Sign In With Google에서 사용
app.get("/verifyIdToken", async (req, res) => {
  try {
    const token = url.parse(req.url, true).query.token;
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const tiket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = tiket.getPayload();
    res.json(payload);
  } catch (e) {
    console.error("Error:: ", e);
  }
});

(async () => {
  try {
    await redis_client.connect();
    app.listen(port, () => {
      console.log(`server start. ${port} port`);
    });
  } catch (e) {
    console.error("Error:: ", e);
  }
})();
