import { Chart } from "react-chartjs-2";
import { useState } from "react";
// import * as tm from "@tensorflow-models/speech-commands";
// import Sidebar from "./components/dashboard-sidebar";
import { Typography, Container, Paper, Grid, Button } from "@mui/material";

const NativePage = () => {
  const [audioData, setAudioData] = useState(null);
  const [action, setAction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  /**
   * The function starts recording audio using the user's device microphone and initializes a
   * MediaRecorder object.
   */
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    /* `mediaRecorder.ondataavailable` is an event handler that is triggered when the MediaRecorder
    object has data available to be processed. In this case, the data is pushed into an array called
    `chunks`. This array will be used later to create a Blob object that can be used to save or
    upload the recorded audio. */
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    /* `mediaRecorder.onstop` is an event handler that is triggered when the recording is stopped. In
    this code block, a new Blob object is created from the recorded audio data stored in the
    `chunks` array. The Blob object is then converted into a URL using `URL.createObjectURL()`, and
    the URL is set as the `audioData` state using `setAudioData()`. Finally, the `classifyAudio()`
    function is called with the Blob object as an argument to classify the recorded audio using a
    machine learning model. */
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);
      setAudioData(audioUrl);
      classifyAudio(blob);
    };

    /* `mediaRecorder.start()` starts recording audio using the device microphone and initializes a
    MediaRecorder object. */
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
          <Typography variant="h1">Native English Speakers</Typography>
        </Grid>
        <Paper sx={{ my: 2, p: 2 }}>
          <Typography variant="body1">
            Compare your English to a native English Speaker
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

//Give me a template for a blog post in react and mui
export default NativePage;
