//TODO: 1. Add a delay of 2 seconds before the recording starts

import { useState, useEffect } from "react";
import * as speechCommands from "@tensorflow-models/speech-commands";
import * as tf from "@tensorflow/tfjs";
import { Typography, Container, Paper, Grid, Button, Box } from "@mui/material";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import wordList from "../wordlist/wordList";

const urlArray = [
  { id: "Act", url: "mQUQszXiJ" },
  { id: "Bed", url: "GYA9zGy-A" },
  { id: "Clap", url: "-KInt5r2h" },
  { id: "Dart", url: "1U7m4emn5" },
  { id: "Ear", url: "iH5ftUX3r" },
  { id: "For", url: "uVvhJFnqo" },
  { id: "Get", url: "-zu0j9CGb" },
  { id: "Here", url: "GtNK-de-o" },
  { id: "If", url: "kzCuqsdKp" },
  { id: "Job", url: "JmyOr5j1e" },
  { id: "Kid", url: "DPtCe6hoQ" },
  { id: "Late", url: "ddgiq1Xfl" },
  { id: "Make", url: "X0guIVv3w" },
  { id: "Name", url: "U1cNr_Daz" },
  { id: "Odd", url: "FuLOA6DzX" },
  { id: "Pea", url: "0ufLwZjos" },
  { id: "Quick", url: "YHv-tlXRt" },
  { id: "Read", url: "YHnlmERO7" },
  { id: "Soak", url: "Ci0thU6By" },
  { id: "Tall", url: "nrB3nEky6" },
  { id: "Up", url: "87KCUejno" },
  { id: "Vase", url: "I3jyAPKiv" },
  { id: "Wait", url: "HvK2LFwLC" },
  { id: "Mix", url: "hmX6IKhSh" },
  { id: "Yes", url: "pbF0zDIH3" },
  { id: "Zen", url: "j0H04-o9O" },
  { id: "Apple", url: "IwrgHgsA_" },
  { id: "Body", url: "vSPbbWyuB" },
  { id: "Chicken", url: "_7TX_eQ92" },
  { id: "Dino", url: "00tSadFVW" },
  { id: "Easy", url: "lm-lm70hY" },
  { id: "Fire", url: "YjidhmTBL" },
  { id: "Going", url: "MswHSHtPd" },
  { id: "Happy", url: "fKjaO_emb" },
  { id: "Into", url: "odw1WCkI1" },
  { id: "July", url: "KIQoTDEuC" },
  { id: "Kilo", url: "1RVn8tx7s" },
  { id: "Later", url: "-Zyop3KH_" },
  { id: "Menu", url: "I6iA46SgZ" },
  { id: "Ninety", url: "B94YSByrl" },
  { id: "Oval", url: "-BGujMo06" },
  { id: "Pizza", url: "odFvjwKWA" },
  { id: "Quicker", url: "D4KRHQ6rC" },
  { id: "River", url: "SN7tXXWYT" },
  { id: "Sorry", url: "HjYcPHU4h" },
  { id: "Thirty", url: "WckSy6efA" },
  { id: "Unit", url: "-lzR6Pdir" },
  { id: "Very", url: "-fNrEBIN6" },
  { id: "Water", url: "br1bxvUxi" },
  { id: "Xmas", url: "egoIM9YR9" },
  { id: "Yellow", url: "hWqfHwyyc" },
  { id: "Zebra", url: "_m-4tPb5B" },
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
    loadModel(wordUrl.url, wordUrl.id);
  };

  const loadModel = async (url, id) => {
    //Online recognizing
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
    setLabels(
      recognizer.wordLabels().filter((word) => word !== "Background Noise")
    );

    return recognizer;
  };

  function argMax(arr) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const recognizeWords = async () => {
    console.log("Recognizing words");
    setAction(null);
    setButton(true);

    setStartCountdown(true);
    setKey((prevKey) => prevKey + 1);

    model.listen(
      (result) => {
        // setAction(labels[argMax(Object.values(result.scores))]);
        // setConfidence(result.scores[argMax(Object.values(result.scores))]);

        const scores = Object.values(result.scores);
        const labelsCopy = [...labels];

        const filteredScores = scores.filter((score) => score >= 0.6);

        if (filteredScores.length > 0) {
          const maxScoreIndex = argMax(filteredScores);
          const maxScoreLabel =
            labelsCopy[scores.indexOf(filteredScores[maxScoreIndex])];
          const maxScore = filteredScores[maxScoreIndex];

          setAction(maxScoreLabel);
          setConfidence(maxScore);

          if (maxScore >= 0.75 && maxScoreLabel !== "Background Noise") {
            //Immediately stop the listening
            model.stopListening();
            setButton(false);
          }
        }
      },
      {
        includeSpectrogram: true,
        probabilityThreshold: 0.6,
        invokeCallbackOnNoiseAndUnknown: false,
        overlapFactor: 0.5,
      }
    );
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
          <Typography variant="h3">Native English ASR</Typography>
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
                Test your pronunciation if it is understandable by the machine
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ py: 2 }}>
              <div className="timer-wrapper">
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    onClick={recognizeWords}
                    disabled={button}
                  >
                    Start
                  </Button>
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
              <Typography variant="h6" sx={{ py: 2 }}>
                Hypothesis Word:
                <Typography
                  variant="h6"
                  sx={{
                    color: "#004777",
                    fontSize: 24,
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                >
                  {action}
                </Typography>
              </Typography>
            </Grid>

            <Box
              sx={{
                justifyContent: "center",
              }}
            >
              {wordList.map((title) => (
                <>
                  <Typography variant="h5" sx={{ pt: 2 }}>
                    {title.title}
                  </Typography>
                  <Grid container spacing={1} sx={{ p: 2 }}>
                    {title.words.map((word) => (
                      <Grid item xs={3} md={2} xl={2}>
                        <Box
                          word={word.word}
                          sx={{
                            px: 2,
                            border: 1,
                            backgroundColor: "#004777",
                            borderRadius: 1,
                          }}
                        >
                          <Button
                            variant="body2"
                            onClick={() => selectWord(word.id)}
                            fullWidth
                            sx={{
                              color: "white",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                color: "white",
                                fontSize: 16,
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}
                            >
                              {word.word}
                            </Typography>
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ))}
            </Box>
          </Grid>
        </Paper>
      </Grid>
    </Container>
  );
};

export default Testing;
