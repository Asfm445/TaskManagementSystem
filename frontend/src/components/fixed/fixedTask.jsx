import React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Box, Button, Typography } from "@mui/material";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import FormatDate from "../date";
import { calculateRemainingTime } from "../../helperfunctions/helperfunctions";
function RenderFixedTask(props) {
  const navigate = useNavigate();
  let e = props.e;
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(e));
  const [finish, setFinish] = useState(
    e.completed || remainingTime == "Time Passed"
  );
  useEffect(() => {
    // Update remaining time every minute
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime(e));
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [e.endDate]);
  return (
    <Box
      className="task"
      key={e.id}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: 2,
        margin: 2,
      }}
    >
      <div className="name">{e.task}</div>
      <FormatDate
        startingDate={e.startingDate}
        endDate={e.endDate}
      ></FormatDate>
      <Typography variant="body2" color="textSecondary">
        {remainingTime}
      </Typography>
      {finish ? (
        <Button disabled variant="contained" color="success">
          finished
        </Button>
      ) : (
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            try {
              api
                .patch("fixed/", {
                  id: e.id,
                  completed: true,
                })
                .then((res) => {
                  if (res.status == 201) {
                    setFinish(true);
                  }
                });
            } catch (err) {
              alert(err);
            }
          }}
        >
          finish
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
              .delete(`fixed/?id=${e.id}`)
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

export default RenderFixedTask;
