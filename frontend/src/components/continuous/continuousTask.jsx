import { Button, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../../api";
const today = new Date();
import {
  calculateRemainingTime,
  updateTaskName,
} from "../../helperfunctions/helperfunctions";
import FormatDate from "../date";
function TaskRender(props) {
  const [e, sete] = useState(props.e);
  const [finish, setFinish] = useState(e.completed);
  const [stop, setStop] = useState(e.stop);
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(e));
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    // Update remaining time every minute
    const interval = setInterval(() => {
      if (new Date(e.endDate) <= new Date()) {
        console.log(update);
        setUpdate(!update);
      }
      setRemainingTime(calculateRemainingTime(e));
    }, 1000); // 60000 ms = 1 minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [e.endDate]);
  useEffect(() => {
    console.log("updating");
    api
      .get(`progress/?id=${e.id}`)
      .then((res) => {
        if (res.status == 401) {
          navigate("login");
        }
        return res.data;
      })
      .then((data) => {
        let ne = data[0];
        ne.task += updateTaskName(ne);
        sete(ne);
      })
      .catch((error) => alert(error));
  }, [update]);
  useEffect(() => {
    setFinish(e.completed);
    setStop(e.stop);
    setRemainingTime(calculateRemainingTime(e));
  }, [e]);
  // console.log(new Date(e.startingDate) - today);
  return (
    <Box
      className="task"
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: 2,
        margin: 2,
      }}
    >
      <Typography variant="h6" className="name">
        {e.task}
      </Typography>
      <FormatDate
        endDate={e.endDate}
        startingDate={e.startingDate}
      ></FormatDate>

      <Typography variant="body2" color="textSecondary">
        {remainingTime}
      </Typography>
      <Button
        variant="outlined"
        onClick={() => {
          localStorage.setItem("id", JSON.stringify(e.id));
          props.setRender("Progress");
        }}
        sx={{ marginTop: 1 }}
      >
        Get Progress
      </Button>
      {finish ? (
        <Button
          disabled
          variant="contained"
          color="success"
          sx={{ marginLeft: 1 }}
        >
          Finished
        </Button>
      ) : (
        <Button
          variant="contained"
          color="info"
          disabled={new Date(e.startingDate) - new Date() > 60000 || e.stop}
          onClick={() => {
            api
              .patch("progress/", { id: e.id, completed: true })
              .then(() => {
                setFinish(true);
              })
              .catch((err) => alert(err));
          }}
          sx={{ marginLeft: 1 }}
        >
          Finish
        </Button>
      )}
      {stop ? (
        <Button
          variant="outlined"
          color="info"
          onClick={() => {
            api
              .post("progress/stop/", { task_id: e.id, stop: false })
              .then(() => {
                setStop(false);
                sete((prev) => ({
                  ...prev,
                  stop: false,
                }));
              })
              .catch((err) => alert(err));
          }}
          sx={{ marginLeft: 1 }}
        >
          Start
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="warning"
          onClick={() => {
            api
              .post("progress/stop/", { task_id: e.id, stop: true })
              .then(() => {
                setStop(true);
                sete((prev) => ({
                  ...prev,
                  stop: true,
                }));
              })
              .catch((err) => alert(err));
          }}
          sx={{ marginLeft: 1 }}
        >
          Stop
        </Button>
      )}
      <Button
        variant="contained"
        color="warning"
        sx={{ marginLeft: 1 }}
        onClick={() => {
          try {
            console.log(e.id);
            api
              .delete(`progress/?id=${e.id}`)
              .then((res) => {
                if (res.status == 200) {
                  props.setFetch(!props.fetch);
                }
              })
              .catch((res) => {
                if (res.status == 401) {
                  navigate("/login");
                }
              });
          } catch (err) {
            alert(err);
          }
        }}
      >
        delete
      </Button>
    </Box>
  );
}

export default TaskRender;
