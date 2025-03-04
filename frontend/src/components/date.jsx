import React from "react";
import { format } from "date-fns";
function FormatDate(props) {
  return (
    <div className="task-dates">
      <div className="date-item starting-date">
        <i className="fas fa-calendar-alt"></i>
        <span>
          Start:{" "}
          <strong>
            {format(new Date(props.startingDate), "MMMM d, yyyy h:mm a")}
          </strong>
        </span>
      </div>
      <div className="date-item end-date">
        <i className="fas fa-clock"></i>
        <span>
          End:{" "}
          <strong>
            {format(new Date(props.endDate), "MMMM d, yyyy h:mm a")}
          </strong>
        </span>
      </div>
    </div>
  );
}

export default FormatDate;
