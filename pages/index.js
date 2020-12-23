import Head from "next/head";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [audioLink, setAudioLink] = useState(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3"
  );
  const [audioFile, setAudioFile] = useState(null);
  const [audioContextState, setAudioContextState] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [borderHeight, setBorderHeight] = useState(150);
  const [borderWidth, setBorderWidth] = useState(500);
  const [padding, setPadding] = useState(40);
  const [previousX, setPreviousX] = useState(0)

  useEffect(() => {
    if (audioContextState) {
      // filter the data
      const size = 100;
      const rawData = audioContextState.getChannelData(0);

      const samples = Math.floor(rawData.length / size);
      const filteredData = [];
      for (let i = 0; i < size; i++) {
        let start = i * samples;
        let sum = 0;
        for (let j = 0; j < samples; j++) {
          sum = sum + Math.abs(rawData[start + j]);
        }
        filteredData.push(sum / samples);
      }

      // equailize the data
      let multiplier = 1 / Math.max(...filteredData);
      let equalizedData = filteredData.map((a) => a * multiplier);

      // get visuals done
      const canvas = document.getElementById("line-canvas");
      canvas.width = borderWidth + padding;
      canvas.height = borderHeight + padding;
      const ctx = canvas.getContext("2d");
      ctx.translate(0, borderHeight + padding - 10);

      //draw the bottom line
      const drawBottomLine = () => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();
      };
      drawBottomLine();

      //prepare the lines
      const stroke = borderWidth / size - 2;

      const drawRect = (sample, stroke, xStart) => {
        // ctx.lineWidth = stroke;
        // ctx.beginPath();
        // ctx.moveTo(xStart, 0);
        // ctx.lineTo(xStart, -(borderHeight * sample));
        // ctx.stroke();
        ctx.beginPath();
        ctx.rect(xStart, 0, stroke, -(sample * borderHeight));
        ctx.fill();
      };

      //draw
      for (let i = 0; i < equalizedData.length; i++) {
        const xStart = (borderWidth / size) * i + padding / 2;
        drawRect(equalizedData[i], stroke, xStart);
      }
    }
  }, [audioContextState]);

  const audioCallback = useCallback((e) => {});

  useEffect(() => {
    if (audioFile) {
      // get audio and canvas
      const audio = document.querySelector("audio");

      // listen every x ms for the current playing time
      setInterval(() => {
        setCurrentTime(audio.currentTime);
      }, 100);

      //set up the overlay canvas
      const overlay = document.getElementById("overlay-canvas");
      overlay.style.marginTop = -borderHeight - padding + "px";
      overlay.width = borderWidth + padding;
      overlay.height = borderHeight + padding;
    }
  }, [audioFile]);

  // function for drawing the
  const drawTimeRect = (ctx, previousX, currentX, overlay) => {
    if (previousX > currentX) {
      ctx.clearRect(0,0, overlay.width, overlay.height)
      return
    }
    ctx.beginPath();
    ctx.clearRect(0,0, overlay.width, overlay.height)
    console.log(currentX)
    ctx.fillStyle = "blue";
    ctx.rect(padding/2, 0, currentX, borderHeight + padding - 10);
    ctx.fill();

    
  };

  // useEffect reacting to changing the time

  useEffect(() => {
    console.log("timechanged")
    if (window.document && audioContextState) {
      const overlay = document.getElementById("overlay-canvas");
      const ctx = overlay.getContext("2d");
      ctx.globalAlpha = 0.5;
      const timePlayed = currentTime / audioContextState.duration;
      const currentX = padding / 2 + (timePlayed * borderWidth);
      drawTimeRect(ctx, 0, currentX, overlay);
      setPreviousX(currentX)
    }
  }, [currentTime]);

  const fetchAudio = async () => {
    setAudioContextState(null);
    if (window) {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      setAudioLoading(true);
      const response = await fetch(audioLink);
      const buffer = await response.arrayBuffer();
      const decoded = await audioContext.decodeAudioData(buffer);
      setAudioContextState(decoded);
      setAudioFile(response);
      setAudioLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Audio Visualiser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <h1>Audio Visualiser</h1>
        </div>
        <div>
          <label htmlFor="link">
            Please enter an audio link:
            <input
              type="link"
              id="link"
              value={audioLink}
              onChange={(e) => {
                setAudioLink(e.target.value);
              }}
            ></input>
          </label>
          <button onClick={fetchAudio}>Submit</button>
        </div>
        {audioLoading && <div>...loading</div>}
        <canvas id="line-canvas"></canvas>
        <canvas id="overlay-canvas"></canvas>
        <canvas id=""></canvas>
        {audioFile && (
          <div>
            <audio src={audioLink} controls></audio>
            <div></div>
          </div>
        )}
      </main>

      <footer></footer>
    </div>
  );
}
