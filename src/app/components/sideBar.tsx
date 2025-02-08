import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { getOrdersHistory } from "@okto_web3/react-sdk";
import { useOkto } from "@okto_web3/react-sdk";
import { LoginButton } from "./loginButton";
import { useSession } from "next-auth/react";
import GetButton from "@/app/components/getButton";

const SideBar = () => {
  const oktoClient = useOkto();
  const [orders, setOrders] = useState<any[]>([]);
  const { data: session } = useSession();
  const [userInput, setUserInput] = useState("");
  const [intentId, setIntentId] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //@ts-expect-error session type doesn't include id_token
  const idToken = useMemo(() => (session ? session.id_token : null), [session]);

  async function fetchOrders() {
    try {
      const result = await getOrdersHistory(oktoClient);
      console.log("ORDERS", result);
      setOrders(result);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  async function handleAuthenticate(): Promise<string | { result: boolean; error: string }> {
    if (!idToken) {
      return { result: false, error: "No google login" };
    }
    try {
      const user = await oktoClient.loginUsingOAuth({
        idToken: idToken,
        provider: 'google',
      });
      console.log("Authentication Success", user);
      setIsAuthenticated(true);
      return JSON.stringify(user);
    } catch (error) {
      console.error("Authentication failed:", error);
      return { result: false, error: "Authentication failed" };
    }
  }

  useEffect(() => {
    if (idToken) {
      handleAuthenticate();
    }
  }, [idToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

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
      <LoginButton />
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
