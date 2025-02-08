"use client";
import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import TransactionDialog from "../components/getDialog";
import { Chat } from "openai/resources/index.mjs";
import ChatBox from "../components/chatBox";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState<any>({});
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) {
      alert("Please enter a valid prompt");
      return;
    }
    const userMessage = { role: "user", content: { reply: prompt } };
    setMessages((prev: any) => [...prev, userMessage]);
    setLoading(true);
    try {
      //   const res = await axios.post(`/api/process-user-query`, {
      //     messages: [{ role: "user", content: prompt }],
      //   });
      const res = {
        status: 200,
        data: {
          response: {
            role: "assistant",
            content: {
              reply:
                "To transfer USDC from Avalanche (AVAX) to Binance Smart Chain (BSC), you can use a cross-chain bridge. Ensure you have compatible wallets on both chains and follow the bridge instructions. For transferring USDC to the Base network, you will need to use an appropriate bridge or exchange that supports Base. Make sure to double-check all addresses and transaction details.",
            },
          },
        },
      };
      if (res.status === 200) {
        setMessages((prev: any) => [...prev, res.data.response]);
    }
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing request");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleConfirm = async () => {
    setIsDialogOpen(false);
    setLoading(true);
    try {
      // const res = await axios.post(`${BACKEND_URL}/api/submit`, { prompt });
      const res = {
        status: 200,
        data: {
          response: {
            role: "assistant",
            content: {
              reply:
                "To transfer USDC from Avalanche (AVAX) to Binance Smart Chain (BSC), you can use a cross-chain bridge. Ensure you have compatible wallets on both chains and follow the bridge instructions. For transferring USDC to the Base network, you will need to use an appropriate bridge or exchange that supports Base. Make sure to double-check all addresses and transaction details.",
            },
          },
        },
      };
      setMessages(res.data.response);
    } catch (error) {
      console.error("Error:", error);
      alert("Transaction failed");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "linear-gradient(135deg,rgb(30, 0, 43),rgb(70, 45, 172))",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          mb: 6,
          mt: 2,
        }}
      >
        <img src="./icon.png" width={50} height={45} alt="Crypto Icon" />
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            fontFamily: "'Orbitron', sans-serif",
            color: "white",
          }}
        >
          <span style={{ color: "rgb(179, 138, 255)" }}>Crypto</span> Lingo
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={3}
        width="800px"
        mb={4}
      >
        <Box display="flex" gap={2} alignItems="center" width="100%">
          <TextField
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="I want to transfer $200 SOL to 0xA1B2C3D4E5F6789012345...."
            sx={{
              input: { color: "white", paddingLeft: "24px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "40px",
                animation: "borderGlow 3s infinite linear",
                "& fieldset": { border: "2px solid rgb(255, 255, 255)" },
                "&:hover fieldset": { border: "2px solid rgb(179, 138, 255)" },
                "&.Mui-focused fieldset": {
                  border: "2px solid rgb(179, 138, 255)",
                },
              },
              width: "100%",
              "@keyframes borderGlow": {
                "0%": { boxShadow: "0 0 5px rgb(179, 138, 255)" },
                "50%": { boxShadow: "0 0 15px rgb(179, 138, 255)" },
                "100%": { boxShadow: "0 0 5px rgb(179, 138, 255)" },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={() => {
              handleSubmitPrompt();
            }}
            disabled={loading}
            sx={{
              background:
                "linear-gradient(90deg, #862FC0 0%,rgb(227, 218, 255) 100%)",
              color: "black",
              px: 4,
              py: 2,
              borderRadius: "50px",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #6D1AAB 0%,rgb(245, 227, 255) 100%)",
              },
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 600,
            }}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </Box>
      </Box>

      <ChatBox loading={loading} messages={messages} />

      <TransactionDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        payload={payload}
        handleConfirm={handleConfirm}
      />
    </Box>
  );
}
