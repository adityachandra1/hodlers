import { Paper, Box, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: {
    reply: string;
    flag : boolean | undefined
  };
}

interface ChatBoxProps {
  loading: boolean;
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ loading, messages }) => {

  console.log(messages)

  return (
    <Paper
      sx={{
        width: '100%',
        maxWidth: '800px',
        minHeight: '300px',
        maxHeight: '500px',
        overflowY: 'auto',
        borderRadius: '12px',
        position: 'relative',
        background: 'rgba(0, 0, 0, 0.61)',
        color: 'rgb(196, 180, 255)',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Typography variant="body1" sx={{ color: '#B968C7' }}>
            Loading...
          </Typography>
        </Box>
      )}

      {messages?.map((msg, index) => (
        <Box
          key={index}
          sx={{
            maxWidth: '70%',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ?'rgb(71, 65, 137)' : 'rgb(38, 5, 75)',
            color: msg.role === 'user' ? '#fff' : 'rgb(231, 210, 255)',
            p: 2,
            borderRadius: '12px',
            wordBreak: 'break-word',
          }}
        >
          <Typography variant="body1">{msg?.content?.reply}</Typography>
          {msg.content?.flag && (
            <Button>Confirm Transaction?</Button>
          )}
        </Box>
      ))}
    </Paper>
  );
};

export default ChatBox;
