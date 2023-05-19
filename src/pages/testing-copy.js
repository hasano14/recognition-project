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
// const url = "https://teachablemachine.withgoogle.com/models/HXW3FkUYI/";
const wordUrlArray = [
  { id: "Act", url: "QCCgmtRNw" },
  { id: "Bed", url: "4Nx8SytsJ" },
  { id: "Clap", url: "b0NWJ3mdp" },
];

const Testing = () => {
  const [action, setAction] = useState(null);
  const [confidence, setConfidence] = useState("0");
  const [labels, setLabels] = useState(null);
  const [startCountdown, setStartCountdown] = useState(false);
  const [key, setKey] = useState(0);
  const [checkTrue, setCheckTrue] = useState(true);
  const [model, setModel] = useState(null);
  const [disableButton, setDisableButton] = useState(true);
  const [url, setUrl] = useState("setup");
  const [modelURL, setModelURL] = useState(null);
  const [metadataURL, setMetadataURL] = useState(null);
  const [currentURL, setCurrentURL] = useState(null);
  const [allowLoad, setAllowLoad] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [currentWordURL, setCurrentWordURL] = useState(null);

  // //Select the word to test
  // const selectWord = (id) => {
  //   console.log("Current ID = " + id);
  //   const Word = wordUrlArray.find((word) => word.id === id);
  //   if (Word !== currentWord) {
  //     setUrl(null);
  //     setAllUrl(Word.url);

  //     if (url !== null) {
  //       setCurrentWord(Word);
  //       setAllowLoad(true);
  //       loadModel();
  //     }
  //   }
  // };

  //Selecting the words
  const selectWord = (id) => {
    const wordUrl = wordUrlArray.find((word) => word.id === id);

    if (url !== null || url === "setup") {
      setUrl("setup");
    }

    if (url !== null || url === "setup") {
      setUrl(
        "https://teachablemachine.withgoogle.com/models/" + wordUrl.url + "/"
      );
      //Check the current ID
      console.log("Current Word = " + id);

      setModelURL(url + "model.json");
      setMetadataURL(url + "metadata.json");
      setDisableButton(true);

      console.log("URL: " + url);
    }
  };

  const loadModel = async () => {
    //Only enable loading when url is not null and not equal to "setup"
    if (url !== null && url !== "setup") {
      const recognizer = new speechCommands.create(
        "BROWSER_FFT",
        undefined, //speech commands options not needed for this example
        modelURL,
        metadataURL
      );

      console.log("Loaded URL: " + url);

      //If model is loaded, set the `disableButton` state to `false`, which enables the "Start" button for speech recognition.
      if ((await recognizer.ensureModelLoaded()) === true) {
        setDisableButton(false);
        console.log("Model loaded");
      }

      setModel(recognizer);

      console.log(recognizer.wordLabels());

      setLabels(recognizer.wordLabels());

      setAllowLoad(false);
      return recognizer;
    }
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
                        onClick={() => selectWord(word.id)}
                      >
                        <Button>{word.word}</Button>
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

export default Testing;
