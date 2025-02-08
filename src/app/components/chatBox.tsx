import { Paper, Box, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import TransactionDialog from "./getDialog";
import axios from "axios";
import { useOkto } from "@okto_web3/react-sdk";
import { handleCCTPTransfer } from "@/utils/token-transfer";
import { ChainType } from "@/utils/token-transfer";
export interface Message {
  role: "assistant" | "user";
  content: string;
  txn_details?: {
    hasRequiredFields?: boolean;
    amount?: number;
    sourceChain?: string;
    destinationChain?: string;
    destinationWalletAddress?: string;
    comments?: string;
  };
}

interface ChatBoxProps {
  loading: boolean;
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ loading, messages }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedTxn, setSelectedTxn] = useState<Message["txn_details"] | null>(
    null
  );
  const oktoClient = useOkto();

  const handleConfirm = async () => {
    setIsDialogOpen(false);
    try {
      const res = await handleCCTPTransfer(
        selectedTxn.amount.toString(),
        selectedTxn.destinationWalletAddress,
        selectedTxn.sourceChain as ChainType,
        selectedTxn.destinationChain as ChainType,
        oktoClient,
        (id: string) => {
          console.log("IntentId", id);
        }
      );
      console.log(res);
    } catch (error) {
      console.error("Error:", error);
      alert("Transaction failed");
    }
  };

  const openDialog = (txn: Message["txn_details"]) => {
    setSelectedTxn(txn);
    setIsDialogOpen(true);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: "800px",
        minHeight: "300px",
        maxHeight: "500px",
        overflowY: "auto",
        borderRadius: "12px",
        position: "relative",
        background: "rgba(0, 0, 0, 0.61)",
        color: "rgb(196, 180, 255)",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
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
          <Typography variant="body1" sx={{ color: "#B968C7" }}>
            Loading...
          </Typography>
        </Box>
      )}
      {messages?.map((msg, index) => (
        <Box
          key={index}
          sx={{
            maxWidth: "70%",
            alignSelf: msg?.role === "user" ? "flex-end" : "flex-start",
            background:
              msg?.role === "user" ? "rgb(71, 65, 137)" : "rgb(38, 5, 75)",
            color: msg?.role === "user" ? "#fff" : "rgb(231, 210, 255)",
            p: 2,
            borderRadius: "12px",
            wordBreak: "break-word",
          }}
        >
          <Typography variant="body1">{msg?.content}</Typography>
          {msg?.txn_details?.hasRequiredFields && (
            <Button
              sx={{
                backgroundColor: "rgb(71, 65, 137)",
                color: "white",
                marginTop: "8px",
              }}
              onClick={() => openDialog(msg.txn_details)}
            >
              Confirm Transaction?
            </Button>
          )}
        </Box>
      ))}

      <TransactionDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        txnDetails={selectedTxn ?? undefined}
        handleConfirm={handleConfirm}
      />
    </Paper>
  );
};

export default ChatBox;
