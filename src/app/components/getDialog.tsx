import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import React from "react";

interface WalletAddresses {
  sender: string;
  receiver: string;
}

interface Amount {
  value: number;
  currency: string;
}

interface Payload {
  fromChain: string;
  toChain: string;
  walletAddresses?: WalletAddresses;
  amount?: Amount;
}

interface TransactionDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  payload: Payload;
  handleConfirm: () => void;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  payload,
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
          {payload?.fromChain}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
          <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>To:</span>
          {payload?.toChain}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
          <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>Sender:</span>
          {payload?.walletAddresses?.sender}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
          <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>Receiver:</span>
          {payload?.walletAddresses?.receiver}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, display: "flex", gap: 3 }}>
          <span style={{ fontSize: "1.1rem", color: "rgb(195, 116, 255)" }}>Amount:</span>
          {payload?.amount?.value} {payload?.amount?.currency}
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
