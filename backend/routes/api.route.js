const router = require("express").Router();
const { google } = require("googleapis");

const GOOGLE_CLIENT_ID =
  "1029996237380-tfogab38p1a7netlp5b4cit0rtstb31d.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);

router.get("/", async (req, res, next) => {
  res.send({ message: "ok api is working" });
});

let REFRESH_TOKEN = null;

router.post("/create-tokens", async (req, res, next) => {
  try {
    const { code } = req.body;
    const { tokens } = await oauth2client.getToken(code);
    REFRESH_TOKEN = tokens.refresh_token;
    res.send(tokens);
  } catch (error) {
    next(error);
  }
});

router.post("/create-event", async (req, res, next) => {
  try {
    const { summary, desc, startDateTime, endDateTime } = req.body;
    oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const calendar = google.calendar("v3");
    const response = await calendar.events.insert({
      auth: oauth2client,
      calendarId: "primary",
      requestBody: {
        summary: summary,
        description: desc,
        colorId: "2",
        start: { dateTime: new Date(startDateTime) },
        end: { dateTime: new Date(endDateTime) },
      },
    });
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.get("/all-events", async (req, res, next) => {
  try {
    oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const calendar = google.calendar("v3");

    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);

    const response = await calendar.events.list({
      auth: oauth2client,
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: oneMonthFromNow.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    res.send(response.data.items);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
