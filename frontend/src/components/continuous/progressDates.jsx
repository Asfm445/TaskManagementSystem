

import {
  Card,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from "@mui/material";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import { useEffect, useState } from "react";
import api from "../../api";
import { format } from "date-fns";
import "../../styles/RenderProgress.css"; // Import the CSS file

function RenderProgress() {
  let id = Number(localStorage.getItem("id"));
  const [task, setTask] = useState([]);

  useEffect(() => {
    api
      .get(`progress/?id=${id}`)
      .then((res) => res.data)
      .then((data) => setTask(data))
      .catch((error) => alert(error));
  }, []);

  const calculateCompletionPercentage = (progressDates) => {
    if (progressDates.length === 0) return 0;
    const completedCount = progressDates.filter(
      (progress) => progress.isDone
    ).length;
    return (completedCount / progressDates.length) * 100;
  };

  return (
    <>
      {task.length > 0 ? (
        task.map((taskItem) => {
          const completionPercentage = calculateCompletionPercentage(
            taskItem.progressDates
          );
          return (
            <Card
              key={taskItem.task}
              className="card"
              sx={{ padding: 3, marginBottom: 2 }}
            >
              <CardHeader
                title={`${taskItem.task} Progress History`}
                className="card-header"
                action={
                  <Typography variant="body2" sx={{ color: "white" }}>
                    {completionPercentage.toFixed(0)}%
                  </Typography>
                }
              />
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                className="progress-bar"
                sx={{ marginBottom: 2 }}
              />
              {taskItem.progressDates.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow className="table-header">
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {taskItem.progressDates.map((progress) => (
                        <TableRow key={progress.id}>
                          <TableCell className="table-cell">
                            {format(
                              new Date(progress.startDate),
                              "MMMM d, yyyy h:mm a"
                            )}
                          </TableCell>
                          <TableCell className="table-cell">
                            {format(
                              new Date(progress.endDate),
                              "MMMM d, yyyy h:mm a"
                            )}
                          </TableCell>
                          <TableCell className="table-cell">
                            {progress.isDone ? (
                              <AssignmentTurnedInRoundedIcon
                                sx={{ color: "green" }}
                              />
                            ) : (
                              <AssignmentLateRoundedIcon
                                sx={{ color: "orangered" }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" className="no-progress">
                  You have no progress history.
                </Typography>
              )}
            </Card>
          );
        })
      ) : (
        <Typography variant="h6" className="no-tasks">
          No tasks available.
        </Typography>
      )}
    </>
  );
}

export default RenderProgress;
