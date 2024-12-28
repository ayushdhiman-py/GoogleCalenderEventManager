import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./App.css"; 

const App = () => {
  const login = useGoogleLogin({
    onSuccess: (response) => {
      const { code } = response;
      axios
        .post("http://localhost:4000/api/create-tokens", { code })
        .then((response) => {
          setSignedIn(true);
          fetchEvents();
          setInterval(fetchEvents, 5000);
        })
        // .catch((error) => console.log(error.message));
    },
    onError: () => console.log("Login Failed"),
    flow: "auth-code",
    scope: "openid email profile https://www.googleapis.com/auth/calendar",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/api/create-event", {
        summary,
        desc,
        startDateTime,
        endDateTime,
      })
      .then((response) => {
        // console.log(response.data);
      })
      // .catch((error) => console.log(error.message));
  };

  const [summary, setSummary] = useState("");
  const [desc, setDesc] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [events, setEvents] = useState([]);

  const fetchEvents = () => {
    axios
      .get("http://localhost:4000/api/all-events")
      .then((response) => setEvents(response.data))
      // .catch((error) => console.log(error.message));
  };

  return (
    <div>
      <h1>Google Calendar Event Manager</h1>
      {!signedIn ? (
        <div className="button-container">
          <button onClick={() => login()}>Sign in with Google</button>
        </div>
      ) : (
        <div className="mainDiv">
          <div className="container">
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <label htmlFor="summary">Title</label>
                <input
                  type="text"
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                />
                <label htmlFor="desc">Description</label>
                <input
                  type="text"
                  id="desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                />
                <label htmlFor="startDateTime">Start Date Time</label>
                <input
                  type="datetime-local"
                  id="startDateTime"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  required
                  />
                <label htmlFor="endDateTime">End Date Time</label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  required
                />
                <button type="submit">Create Event</button>
              </form>
            </div>

            <div className="events-container">
              <h2>Upcoming Events</h2>
              <div className="headingoftable">
                <h3>Title</h3>
                <h3>Description</h3>
                <h3>Start</h3>
                <h3>End</h3>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event, index) => (
                      <tr key={index}>
                        <td>{event.summary}</td>
                        <td>{event.description}</td>
                        <td>
                          {new Date(event.start.dateTime).toLocaleDateString()}
                          <br />
                          {new Date(event.start.dateTime).toLocaleTimeString()}
                        </td>
                        <td>
                          {new Date(event.end.dateTime).toLocaleDateString()}
                          <br />
                          {new Date(event.end.dateTime).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
