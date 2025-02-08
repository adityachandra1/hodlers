"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import ChatBox from "../components/chatBox";
import SideBar from "../components/sideBar";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) {
      alert("Please enter a valid prompt");
      return;
    }
    const userMessage = { role: "user", content: prompt };
    setMessages((prev: any) => [...prev, userMessage]);
    setLoading(true);
    try {
      const res = await axios.post(`/api/process-user-query`, {
        messages: [ ...messages, userMessage],
      },
      {
        headers: {
          auth_id_token:  "",
        },
      });
      if (res.status === 200) {
        console.log(res.data)
        setMessages((prev: any) => [...prev, res.data.result]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing request");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
        try {
          const response = await axios.get("/api/auth/session");
          const idToken = response.data?.id_token;
          if (idToken) {
            localStorage.setItem("jwt", idToken);
          }
        } catch (error) {
          console.error("Error fetching session:", error);
        }
    };

    fetchSession();
  });

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Box
        sx={{
          minHeight: "100vh",
          minWidth: "80vw",
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
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            mb: 10,
            mt: -3,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Orbitron', sans-serif",
              color: "white",
            }}
          >
            <span>End to End Cross Chain Support Through Natural Language</span>
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
              placeholder="I want to transfer 100USDC from Avalanche to Polygon"
              sx={{
                input: { color: "white", paddingLeft: "24px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "40px",
                  animation: "borderGlow 3s infinite linear",
                  "& fieldset": { border: "2px solid rgb(255, 255, 255)" },
                  "&:hover fieldset": {
                    border: "2px solid rgb(179, 138, 255)",
                  },
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
      </Box>
    </div>
  );
}
