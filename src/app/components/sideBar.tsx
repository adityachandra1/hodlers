import { Box, Typography } from "@mui/material";
import React from "react";

const SideBar = ({ orders }: any) => {
  return (
    <Box
      sx={{
        width: "100%",
        overflowY: "auto",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.61)",
        color: "rgb(232, 225, 255)",
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography sx={{ fontSize: "1.2rem" }}>ORDER HISTORY</Typography>
      {orders?.map((order: {}, index: number) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
            borderBottom: "1px solid rgb(232, 225, 255)",
            pb: 1,
          }}
        >
          <Typography sx={{ fontSize: "1rem" }}>Order ID:</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SideBar;
