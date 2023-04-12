import { useState, useEffect } from "react";
import * as speechCommands from "@tensorflow-models/speech-commands";
import * as tf from "@tensorflow/tfjs";
// import Sidebar from "./components/dashboard-sidebar";
import { Typography, Container, Paper, Grid, Button } from "@mui/material";
import { Chart } from "react-chartjs-2";

const url = "https://teachablemachine.withgoogle.com/models/TZJQBBpTm/";
const modelURL = url + "model.json";
const metadataURL = url + "metadata.json";

// async function createModel() {
//   const model = speechCommands.create(
//     "BROWSER_FFT",
//     undefined,
//     modelURL,
//     metadataURL
//   );

//   await model.ensureModelLoaded();

//   console.log(model.wordLabels());

//   return model;
// }

const NativePage = () => {
  const [audioData, setAudioData] = useState(null);
  const [action, setAction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState(null);

  const loadModel = async () => {
    const recognizer = speechCommands.create(
      "BROWSER_FFT",
      undefined,
      modelURL,
      metadataURL
    );

    await recognizer.ensureModelLoaded();

    setModel(recognizer);
    setLabels(recognizer.wordLabels());
  };

  useEffect(() => {
    loadModel();
  }, []);

  const recognizeWords = async () => {
    console.log("Listening for words");

    model.listen(
      (result) => {
        console.log(result.spectogram);
      },
      { includeSpectogram: true, probabilityThreshold: 0.9 }
    );

    //Stop recognition after 3 seconds
    setTimeout(() => model.stopListening(), 3000);
  };

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

  const classifyAudio = async (audioBlob) => {
  };

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
          <Typography variant="h3">Native English Speakers</Typography>
        </Grid>
        <Paper sx={{ my: 2, p: 2 }}>
          <Typography variant="body1">
            Compare your English to a native English Speaker
          </Typography>
          <div>
            <Button variant="contained" onClick={recognizeWords}>
              Record Audio
            </Button>
            {audioData && <audio src={audioData} controls />}
            {action && (
              <div>
                Predicted Action: {action} ({confidence}% confidence)
              </div>
            )}
            <canvas id="chart" width="400" height="400" />
          </div>
        </Paper>
      </Grid>
    </Container>
  );
};

//Give me a teachable machine code that accepts audio and checks its' confidence in react
export default NativePage;
