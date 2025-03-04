import React, { useState } from "react";
import DashboardLayout from "../components/dashboardlayout";
import ContinuousDataRender from "../components/continuous/continuous";
import FixedDataRender from "../components/fixed/fixed";
import RenderProgress from "../components/continuous/progressDates";
import ProtectedRoute from "../components/protectedRoute";
import { createTheme, ThemeProvider } from "@mui/material";
const theme = createTheme();
function Home() {
  const [render, setRender] = useState("Continuous");
  return (
    <>
      <ThemeProvider theme={theme}>
        <DashboardLayout setRender={setRender}>
          {render === "Continuous" && (
            <ProtectedRoute>
              <ContinuousDataRender setRender={setRender} />
            </ProtectedRoute>
          )}
          {render === "Fixed" && (
            <ProtectedRoute>
              <FixedDataRender />
            </ProtectedRoute>
          )}
          {render === "Progress" && (
            <ProtectedRoute>
              <RenderProgress />
            </ProtectedRoute>
          )}
        </DashboardLayout>
      </ThemeProvider>
    </>
  );
}

export default Home;
