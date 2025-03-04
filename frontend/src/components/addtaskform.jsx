import React, { Fragment, useEffect, useRef, useState } from "react";
import "../styles/addtaskform.css";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  validateStartingDate,
  validateTimeInterval,
  validateTask,
} from "../helperfunctions/validations";
import { send } from "../helperfunctions/sendHttp";

function TaskForm(props) {
  let initialInputState = props.isContinuous
    ? {
        task: "",
        startingDate: "",
        timeinterval: "",
        startingTime: "",
      }
    : {
        task: "",
        startingDate: "",
        endDate: "",
        endTime: "",
        startingTime: "",
      };
  let initialValidityState = props.isContinuous
    ? {
        task: false,
        startingDate: false,
        timeinterval: false,
      }
    : {
        task: false,
        startingDate: false,
        endDate: false,
      };
  const [inputs, setInputs] = useState(initialInputState);
  const inputRefs = useRef([]);
  const [valid, setValid] = useState(initialValidityState);
  useEffect(() => {
    setInputs(initialInputState);
    setValid(initialValidityState);
  }, [props.fetch]);
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    validateStartingDate({
      startingDate: inputs.startingDate,
      startingTime: inputs.startingTime,
      setValid: setValid,
      inputRefs: inputRefs,
    });
    validateTask({
      task: e.target.value,
      setValid: setValid,
      inputRefs: inputRefs,
    });
    if (!props.isContinuous) {
      if (!valid.endDate && !valid.startingDate && !valid.task) {
        send({
          inputs: inputs,
          setFetch: props.setFetch,
          fetch: props.fetch,
          route: "fixed/",
          navigate: navigate,
        });
      }
    } else {
      let timeinterval = validateTimeInterval({
        setValid: setValid,
        inputRefs: inputRefs,
        timeinterval: inputs.timeinterval,
      });
      if (!valid.timeinterval && timeinterval != "invalid") {
        let startingDate = new Date(
          `${inputs.startingDate}T${inputs.startingTime}:00`
        );
        let ob = {
          ["task"]: inputs.task,
          ["startingDate"]: startingDate.toISOString(),
          ["timeinterval"]: timeinterval,
          ["progressDates"]: [],
        };

        send({
          inputs: ob,
          setFetch: props.setFetch,
          fetch: props.fetch,
          route: "progress/",
          navigate: navigate,
        });
      }
    }
  }
  function handleChange(e) {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  return (
    <div className="form-task">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            onChange={handleChange}
            value={inputs.task}
            ref={(el) => (inputRefs.current[0] = el)}
            type="text"
            name="task"
            placeholder="Name of task"
            required
            className="input-field"
            style={{
              borderColor: valid.task ? "red" : "#00796b",
              backgroundColor: valid.task ? "rgba(200,100,100,0.5)" : "inherit",
            }}
          />
        </div>
        <div className="form-group">
          <Typography variant="h6">starting Date and Time</Typography>
          <label htmlFor="startingdate">Date</label>
          <input
            value={inputs.startingDate}
            onChange={handleChange}
            ref={(el) => (inputRefs.current[1] = el)}
            type="date"
            name="startingDate"
            required
            className="input-field"
            style={{
              borderColor: valid.startingDate ? "red" : "#00796b",
              backgroundColor: valid.startingDate
                ? "rgba(200,100,100,0.5)"
                : "inherit",
            }}
          />
          <label htmlFor="startingTime">time</label>
          <input
            type="time"
            name="startingTime"
            value={inputs.startingTime}
            className="input-field"
            onChange={(e) => {
              setInputs((prev) => ({
                ...prev,
                ["startingTime"]: e.target.value,
              }));
            }}
          />
        </div>
        <div className="form-group">
          {!props.isContinuous ? (
            <Fragment>
              <Typography variant="h6">End Date and Time</Typography>
              <label htmlFor="endDate">date</label>
              <input
                onChange={handleChange}
                value={inputs.endDate}
                ref={(el) => (inputRefs.current[2] = el)}
                type="date"
                name="endDate"
                required
                className="input-field"
                style={{
                  borderColor: valid.endDate ? "red" : "#00796b",
                  backgroundColor: valid.endDate
                    ? "rgba(200,100,100,0.5)"
                    : "inherit",
                }}
              />
              <label htmlFor="endTime">time</label>
              <input
                type="time"
                name="endTime"
                className="input-field"
                onChange={(e) => {
                  setInputs((prev) => ({
                    ...prev,
                    ["endTime"]: e.target.value,
                  }));
                }}
              />
            </Fragment>
          ) : (
            <input
              value={inputs.timeinterval}
              onChange={handleChange}
              ref={(el) => (inputRefs.current[2] = el)}
              type="text"
              name="timeinterval"
              placeholder="Time Interval (e.g., 1 hour)"
              required
              className="input-field"
              style={{ borderColor: valid.timeinterval ? "red" : "#00796b" }}
            />
          )}
        </div>
        <Button type="submit" variant="contained" className="submit-button">
          Add +
        </Button>
      </form>
    </div>
  );
}

export default TaskForm;
