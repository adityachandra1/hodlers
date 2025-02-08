"use client"
import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
} from "@mui/material";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [responses, setResponses] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState<any>({});
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) {
      alert("Please enter a valid prompt");
      return;
    };
    setLoading(true);
    try {
      // const res = await axios.post(`${BACKEND_URL}/api/submit`, { prompt });
      const res = {
        status: 200,
        data: {
          response: "Transaction completed successfully",
          toChain: "Ethereum",
          fromChain: "Binance Smart Chain",
          walletAddresses: {
            sender: "0x1234567890abcdef1234567890abcdef12345678",
            receiver: "0xabcdef1234567890abcdef1234567890abcdef12",
          },
          amount: {
            value: "10.5",
            currency: "USDT",
          },
          transactionId: "0xabcdef1234567890abcdef1234567890abcdefabcd",
          timestamp: "2025-02-07T18:30:00Z",
          status: "success",
        },
      };
      if (res.status === 200) {
        setPayload(res.data);
        setIsDialogOpen(true);
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
            tx_hash: "dfwee45rtfgvhuijodmfv234er5tWDEFDWEGHGFDS",
            chain: "OKTO",
          },
        },
      };
      setResponses(res.data.response);
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
          mb: 8,
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
            onClick={handleSubmitPrompt}
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

      <Paper
        sx={{
          width: "100%",
          maxWidth: "800px",
          minHeight: "300px",
          overflowY: "auto",
          borderRadius: "12px",
          position: "relative",
          background: "rgba(0, 0, 0, 0.61)",
          color: "rgb(189, 189, 189)",
          p: 2,
        }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <CircularProgress sx={{ color: "#B968C7" }} />
          </Box>
        )}

        {responses && (
          <Typography
            sx={{
              p: 4,
              pb: 1,
              mb: 1,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div>
              <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>
                Tx Hash:{" "}
              </span>
              {responses.tx_hash}
            </div>
            <div>
              {" "}
              <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>
                Chain:
              </span>
              {responses.chain}
            </div>
          </Typography>
        )}
      </Paper>

      {/* Dialog Box */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            background: "linear-gradient(135deg,rgb(26, 4, 61),rgb(16, 7, 29))",
            color: "white",
          },
          padding: 2,
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "semibold", color: "rgb(211, 211, 211)" }}
        >
          Are you sure you want to proceed with the transaction?
        </DialogTitle>
        <DialogContent
          sx={{
            color: "rgb(197, 197, 197)",
            padding: 3,
          }}
        >
          <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
            <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>
              From:
            </span>
            {payload.fromChain}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
            <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>
              To:
            </span>
            {payload.toChain}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
            <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>
              Sender:
            </span>
            {payload.walletAddresses?.sender}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
            <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>
              Receiver:
            </span>
            {payload.walletAddresses?.receiver}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
            <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>
              Amount:
            </span>
            {payload.amount?.value} {payload.amount?.currency}
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            padding: 2,
          }}
        >
          <Button
            onClick={() => setIsDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: "#D885F3",
              color: "#D885F3",
              "&:hover": { backgroundColor: "#2A003E" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              backgroundColor: "#D885F3",
              color: "white",
              "&:hover": { backgroundColor: "#B968C7" },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
