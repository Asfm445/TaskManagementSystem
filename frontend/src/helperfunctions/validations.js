// const today = new Date();
import { parseDurationInput } from "./helperfunctions";

export function validateStartingDate({
  startingDate,
  inputRefs,
  setValid,
  startingTime,
}) {
  const today = new Date();
  if (new Date(startingDate) + startingTime < today) {
    inputRefs.current[1].focus();
    setValid((prev) => ({
      ...prev,
      ["startingDate"]: true,
    }));
  } else {
    setValid((prev) => ({
      ...prev,
      ["startingDate"]: false,
    }));
  }
}

export function validateTimeInterval({ timeinterval, inputRefs, setValid }) {
  let timeIntervalMilS = parseDurationInput(timeinterval);
  if (timeIntervalMilS == "invalid" && timeIntervalMilS < 60) {
    inputRefs.current[2].focus();
    setValid((prev) => ({
      ...prev,
      ["timeinterval"]: true,
    }));
    return "invalid";
  } else {
    setValid((prev) => ({
      ...prev,
      ["timeinterval"]: false,
    }));
    return timeIntervalMilS;
  }
}
export function validateTask({ task, setValid, inputRefs }) {
  if (!task) {
    inputRefs.current[0].focus();
    setValid((prev) => ({
      ...prev,
      ["task"]: true,
    }));
  } else {
    setValid((prev) => ({
      ...prev,
      ["task"]: false,
    }));
  }
}
