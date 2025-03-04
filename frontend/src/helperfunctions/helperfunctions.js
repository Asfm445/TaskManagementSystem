const today = new Date();

export function parseDuration(durationStr) {
  const durationArr = durationStr.split(" ");
  let days = 0;
  let timeStr = durationArr[0];
  if (durationArr.length == 2) {
    days = parseInt(durationArr[0], 10);
    timeStr = durationArr[1];
  }
  const [hoursStr, minutesStr, secondsStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);
  const totalMilliseconds =
    days * 24 * 60 * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000;

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    totalMilliseconds: totalMilliseconds,
  };
}

export function updateTaskName(e) {
  const t = new Date(e.startingDate);
  let parsed = parseDuration(e.timeinterval);
  e.endDate = new Date(parsed.totalMilliseconds + t.getTime()).toISOString();
  let daystr = parsed.days > 0 ? ` ${parsed.days} days ` : "";
  let hourstr = parsed.hours > 0 ? ` ${parsed.hours} hours ` : "";
  let minstr = parsed.minutes > 0 ? ` ${parsed.minutes} minutes ` : "";
  return ` every  ${daystr}${hourstr}${minstr}`;
}

// Function to calculate remaining time
export function calculateRemainingTime(e) {
  const now = new Date();
  const endDate = new Date(e.endDate);
  const timeDiff = endDate - now;

  if (timeDiff <= 0) {
    return "Time's up!";
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days} days ${hours} hours ${minutes} minutes left`;
}

export function parseDurationInput(durationStr) {
  // Define a mapping of time units to milliseconds
  const timeUnits = {
    year: 365 * 24 * 60 * 60,
    years: 365 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60, // Approximation
    months: 30 * 24 * 60 * 60, // Approximation
    day: 24 * 60 * 60,
    days: 24 * 60 * 60,
    hour: 60 * 60,
    hours: 60 * 60,
    minute: 60,
    minutes: 60,
    second: 1,
    seconds: 1,
  };

  // Initialize total milliseconds
  let totalMilliseconds = 0;

  // Use regex to find all matches
  const matches = [];
  let durationArr = durationStr.split(" ");
  let i = 0;
  while (i < durationArr.length) {
    if (!isNaN(Number(durationArr[i]))) {
      if (durationArr[i + 1] in timeUnits) {
        matches.push([durationArr[i], durationArr[i + 1]]);
        i += 2;
      } else {
        return "invalid";
      }
    } else {
      i += 1;
    }
  }

  if (matches) {
    matches.forEach((match) => {
      const value = parseInt(match[0], 10);
      const unit = match[1];

      if (timeUnits[unit]) {
        totalMilliseconds += value * timeUnits[unit];
      }
    });
  }

  return totalMilliseconds; // Return total duration in milliseconds
}
