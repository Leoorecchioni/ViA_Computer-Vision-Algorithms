import React, { useRef, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const ObjectDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModelAndDetect = async () => {
      const model = await cocoSsd.load();
      const video = videoRef.current;

      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            detectFrame(video, model);
          };
        });
    };

    const detectFrame = (video, model) => {
      model.detect(video).then(predictions => {
        drawPredictions(predictions);
        requestAnimationFrame(() => detectFrame(video, model));
      });
    };

    const drawPredictions = (predictions) => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.fillStyle = 'red';
        ctx.font = '24px Arial';
        ctx.fillText(prediction.class, x, y > 10 ? y - 5 : y + 15);
      });
    };

    loadModelAndDetect();
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" style={{ display: 'block' }} />
      <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
};

export default ObjectDetection;
