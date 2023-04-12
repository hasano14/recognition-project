import React, { useState } from "react";
import { Grid, Container, Typography, Paper, Button } from "@mui/material";

const NonNativePage = (props) => {
  const [audioData, setAudioData] = useState(null);
  const [action, setAction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);
      setAudioData(audioUrl);
      classifyAudio(blob);
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
    }, 3000);
  };

  const classifyAudio = async (audioBlob) => {};

  return (
    <Container sx={{ p: 3 }}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} alignItems="center">
          <Typography variant="h3">Non-Native English Speakers</Typography>
        </Grid>
        <Paper sx={{ my: 2, p: 2 }}>
          <Typography variant="body1">
            Compare your english to a non-native English speaker
          </Typography>
          <div>
            <Button variant="contained" onClick={startRecording}>
              Record Audio
            </Button>
            {audioData && <audio src={audioData} controls />}
            <canvas id="chart" width="400" height="400" />
          </div>
        </Paper>
      </Grid>
    </Container>
  );
};

export default NonNativePage;
