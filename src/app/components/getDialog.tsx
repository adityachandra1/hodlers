import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import React from "react";
import { Message } from "./chatBox";

interface TransactionDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  txnDetails?: {
    hasRequiredFields: boolean;
    amount: number;
    sourceChain: string;
    destinationChain: string;
    destinationWalletAddress: string;
    comments: string;
  };
  handleConfirm: () => void;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  txnDetails,
  handleConfirm,
}) => {
  return (
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
      <DialogTitle sx={{ fontWeight: "semibold", color: "rgb(211, 211, 211)" }}>
        Are you sure you want to proceed with the transaction?
      </DialogTitle>
      <DialogContent sx={{ color: "rgb(197, 197, 197)", padding: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
          <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>From:</span>
          {txnDetails?.sourceChain}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
          <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>To:</span>
          {txnDetails?.destinationChain}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
          <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>Sender:</span>
          {txnDetails?.destinationWalletAddress}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
          <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>Amount:</span>
          {txnDetails?.amount} 
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
          <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>Comments:</span>
          {txnDetails?.comments} 
        </Typography>
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
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
  );
};

export default TransactionDialog;
