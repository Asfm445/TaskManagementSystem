import { Box, Button, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TaskForm from "../addtaskform";
import api from "../../api";

import RenderFixedTask from "./fixedTask";
function FixedDataRender() {
  const [data, setData] = useState([]);
  const [fetch, setFetch] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get("fixed/");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [fetch]);
  return (
    <Card sx={{ padding: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Fixed Task List
      </Typography>
      <Box className="tasks">
        <TaskForm
          isContinuous={false}
          fetch={fetch}
          setFetch={setFetch}
        ></TaskForm>
        {data.map((e) => {
          return (
            <RenderFixedTask
              e={e}
              key={e.id}
              setFetch={setFetch}
              fetch={fetch}
            ></RenderFixedTask>
          );
        })}
      </Box>
    </Card>
  );
}

export default FixedDataRender;
