import { Card, Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import TaskForm from "../addtaskform";
import "../../styles/continuous.css";
import TaskRender from "./continuousTask";
import api from "../../api";
import { updateTaskName } from "../../helperfunctions/helperfunctions";

function ContinuousDataRender(props) {
  console.log("rerendering");
  const [data, setData] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [inputs, setInputs] = useState({
    task: "",
    startingDate: Date(),
    timeinterval: "",
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get("progress/");
        setData(res.data.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [fetch]);

  return (
    <Card sx={{ padding: 3, margin: "16px 0" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Continuous Task List
      </Typography>
      <Box className="tasks">
        <TaskForm
          isContinuous={true}
          setFetch={setFetch}
          fetch={fetch}
          inputs={inputs}
          setInputs={setInputs}
        />
        {data.map((e) => {
          e.task += updateTaskName(e);
          return (
            <TaskRender
              e={e}
              setRender={props.setRender}
              key={e.id}
              fetch={fetch}
              setFetch={setFetch}
            />
          );
        })}
      </Box>
    </Card>
  );
}

export default ContinuousDataRender;
