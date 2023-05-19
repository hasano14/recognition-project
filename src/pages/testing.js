import { useState, useEffect } from "react";
import * as speechCommands from "@tensorflow-models/speech-commands";
import * as tf from "@tensorflow/tfjs";
import { Typography, Container, Paper, Grid, Button, Box } from "@mui/material";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import wordList from "../wordlist/wordList";

const urlArray = [
  { id: "Act", url: "QCCgmtRNw" },
  { id: "Bed", url: "4Nx8SytsJ" },
  { id: "Clap", url: "b0NWJ3mdp" },
];

const Testing = () => {
  const [button, setButton] = useState(true);
  const [startCountdown, setStartCountdown] = useState(false);
  const [key, setKey] = useState(0);
  const [action, setAction] = useState(null);
  const [confidence, setConfidence] = useState("0");
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState(null);
  const [chosenWord, setChosenWord] = useState(null);

  const selectWord = (id) => {
    const wordUrl = urlArray.find((word) => word.id === id);
    setButton(true);
    setChosenWord(wordUrl.id);
    console.log("Chosen Word = " + wordUrl.id);
    console.log("Chosen URL = " + wordUrl.url);
    loadModel(wordUrl.url);
  };

  const loadModel = async (url) => {
    const modelURL =
      "https://teachablemachine.withgoogle.com/models/" + url + "/model.json";
    const metadataURL =
      "https://teachablemachine.withgoogle.com/models/" +
      url +
      "/metadata.json";

    const recognizer = speechCommands.create(
      "BROWSER_FFT",
      undefined, //speech commands options not needed for this example
      modelURL,
      metadataURL
    );

    //Check if the model is loaded
    await recognizer.ensureModelLoaded();
    console.log("Loaded URL = " + url);
    console.log(recognizer.wordLabels());
    setButton(false);

    setModel(recognizer);
    setLabels(recognizer.wordLabels());

    return recognizer;
  };

  function argMax(arr) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const recognizeWords = async () => {
    console.log("Recognizing words");

    setStartCountdown(true);
    setKey((prevKey) => prevKey + 1);

    model.listen(
      (result) => {
        setAction(labels[argMax(Object.values(result.scores))]);
        setConfidence(result.scores[argMax(Object.values(result.scores))]);
      },
      {
        includeSpectrogram: true,
        probabilityThreshold: 0.9,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.5,
      }
    );

    setTimeout(() => model.stopListening(), 3000);
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <Button variant="contained">Try Again</Button>;
    } else {
      return (
        <>
          {startCountdown ? (
            <Button variant="contained" disabled>
              {remainingTime}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={recognizeWords}
              disabled={button}
            >
              Start
            </Button>
          )}
        </>
      );
    }
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
          <Typography variant="h3">Testing</Typography>
        </Grid>
        <Paper sx={{ my: 2, p: 2 }}>
          <Grid
            container
            splacing={1}
            justifyContent="center"
            direction="column"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ py: 2 }}>
                This page is for testing purposes.
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ py: 2 }}>
              <div className="timer-wrapper">
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CountdownCircleTimer
                    key={key}
                    isPlaying={startCountdown}
                    duration={3}
                    colors={["#004777"]}
                    onComplete={() => ({ shouldRepeat: false })}
                    display="flex"
                  >
                    {renderTime}
                  </CountdownCircleTimer>
                </Box>
              </div>
            </Grid>
            <Grid item xs={12} sx={{ alignItems: "center" }}>
              <Typography variant="h6" sx={{ py: 2 }}>
                Reference Word:
                <Typography
                  variant="h6"
                  sx={{
                    color: "#004777",
                    fontSize: 24,
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                >
                  {chosenWord}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} md={10}>
              <Grid container spacing={1} sx={{ p: 2 }}>
                {wordList.map((word) => (
                  <Grid item xs={3} md={2} xl={2}>
                    <Box
                      word={word.word}
                      sx={{
                        backgroundColor: "#004777",
                        borderRadius: 1,
                        fontSize: 20,
                        py: 1,
                        transition: "all 0.3s linear",
                      }}
                    >
                      <Button
                        variant="body2"
                        sx={{
                          color: "white",
                          textAlign: "center",
                        }}
                        onClick={() => selectWord(word.id)}
                        fullWidth
                      >
                        <Typography
                          sx={{
                            variant: "body2",
                            color: "white",
                            fontSize: 12,
                            textAlign: "center",
                          }}
                        >
                          {word.word}
                        </Typography>
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Container>
  );
};

export default Testing;
