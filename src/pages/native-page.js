import { useState, useEffect } from "react";
import * as speechCommands from "@tensorflow-models/speech-commands";
import * as tf from "@tensorflow/tfjs";
import { Typography, Container, Paper, Grid, Button, Box } from "@mui/material";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Chart } from "react-chartjs-2";
import wordList from "../wordlist/wordList";
import { blue } from "@mui/material/colors";

/* `const url = "https://teachablemachine.withgoogle.com/models/HXW3FkUYI/";` is setting the URL for
the Teachable Machine model that will be used for speech recognition. The model is hosted on the
Teachable Machine website and can be accessed using this URL. */
const url = "https://teachablemachine.withgoogle.com/models/HXW3FkUYI/";

const NativePage = () => {
  const [action, setAction] = useState(null);
  const [confidence, setConfidence] = useState("0");
  const [labels, setLabels] = useState(null);
  const [startCountdown, setStartCountdown] = useState(false);
  const [key, setKey] = useState(0);
  const [checkTrue, setCheckTrue] = useState(true);
  const [model, setModel] = useState(null);
  const [disableButton, setDisableButton] = useState(true);

  const modelURL = url + "model.json";
  const metadataURL = url + "metadata.json";

  //Load the model
  const loadModel = async () => {
    const recognizer = speechCommands.create(
      "BROWSER_FFT",
      undefined, //speech commands options not needed for this example
      modelURL,
      metadataURL
    );

    //Check if the model is loaded
    await recognizer.ensureModelLoaded();

    /* This line of code is checking if the `wordLabels()` method of the `recognizer` object returns a
    non-null value. If it does, it sets the `disableButton` state to `false`, which enables the
    "Start" button for speech recognition. If it returns null, it sets the `disableButton` state to
    `true`, which disables the "Start" button. */
    recognizer.wordLabels() !== null
      ? setDisableButton(false)
      : setDisableButton(true);

    setModel(recognizer);

    //Console log the word labels for the model
    console.log(recognizer.wordLabels());

    //Set the labels
    setLabels(recognizer.wordLabels());

    return recognizer;
  };

  useEffect(() => {
    loadModel();
  }, []);

  function argMax(arr) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const recognizeWords = async () => {
    console.log("Listening for words");

    setStartCountdown(true);
    setKey((prev) => prev + 1);

    model.listen(
      (result) => {
        setAction(labels[argMax(Object.values(result.scores))]);
        setConfidence(result.scores[argMax(Object.values(result.scores))]);
      },
      {
        includeSpectrogram: true,
        probabilityThreshold: 0.9,
        invokeCallbackOnNoiseAndUnkown: true,
        overlapFactor: 0.5,
      }
    );

    //Stop recognition after 3 seconds
    setTimeout(() => model.stopListening(), 3000);
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return (
        <Button variant="contained" onClick={recognizeWords}>
          Try Again
        </Button>
      );
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
              disabled={disableButton}
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
          <Typography variant="h3">Native English Speakers</Typography>
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
                Compare your English to a native English Speaker
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
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ py: 2 }}>
                Confidence: {(confidence * 100).toFixed(2)}%
              </Typography>
            </Grid>
            <Grid item xs={12} md={10}>
              <Grid container spacing={1} sx={{ p: 2 }}>
                {wordList.map((word) => (
                  <Grid item xs={3} md={2} xl={2}>
                    {action === word.id && action != null ? (
                      <Box
                        word={word.word}
                        sx={{
                          backgroundColor: "#004777",
                          borderRadius: 1,
                          fontSize: 20,
                          px: 2,
                          py: 1,
                          transition: "all 0.3s ease-in-out",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "white", fontSize: 20 }}
                        >
                          {word.word}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          opacity: [0.9, 0.8, 0.7],
                          fontSize: 20,
                          px: 2,
                          py: 1,
                          outline: "1px solid #004777",
                          borderRadius: 1,
                          transition: "all 0.3s ease-in-out",
                        }}
                      >
                        {word.word}
                      </Box>
                    )}
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

export default NativePage;
