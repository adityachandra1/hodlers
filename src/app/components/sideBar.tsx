import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { getOrdersHistory } from "@okto_web3/react-sdk";
import { useOkto } from "@okto_web3/react-sdk";

const SideBar = () => {
  const oktoClient = useOkto();
  const [orders, setOrders] = useState<any[]>([]);

  async function fetchOrders() {
    try {
      const result = await getOrdersHistory(oktoClient);
      setOrders(result);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

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
      {orders?.map((order, index) => (
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
          <Typography sx={{ fontSize: "1rem" }}>
            Order ID: {order?.id || "N/A"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SideBar;
