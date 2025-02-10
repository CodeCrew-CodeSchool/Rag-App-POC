import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { Box, Container, Typography } from "@mui/material";

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  const sendQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const userMessage = { actor: "User", content: query };
    setMessages([...messages, userMessage]);

    const requestBody = {
      query,
      sources: [{ type: "database", link: "" }],
    };

    try {

      // Make a request to the endpoint that your Backend is running on 

      const response = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      const aiMessage = { actor: "AI", content: data.content };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error("Error fetching response:", error);
    }
    
    setQuery("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, p: 3, bgcolor: "white", boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>Chatbot</Typography>
      <Box sx={{ maxHeight: 400, overflowY: "auto", border: 1, p: 2, borderRadius: 2, bgcolor: "grey.100", mb: 2 }}>
        {messages.map((msg, index) => (
          <Card key={index} sx={{ mb: 1, bgcolor: msg.actor === "User" ? "primary.light" : "grey.300" }}>
            <CardContent>
              <Typography variant="body1"><strong>{msg.actor}:</strong> {msg.content}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <form onSubmit={sendQuery}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
          />
          <Button variant="contained" color="primary" type="submit">Send</Button>
        </Box>
      </form>
    </Container>
  );
};

export default Chatbot;
