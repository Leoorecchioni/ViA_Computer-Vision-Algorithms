import React, { useRef, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';

const ObjectDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runDetection = async () => {
      await tf.ready();
      const model = await cocoSsd.load();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      await new Promise((res) => {
        videoRef.current.onloadedmetadata = () => res();
      });
      videoRef.current.play();

      const detect = async () => {
        const predictions = await model.detect(videoRef.current);

        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        predictions.forEach(pred => {
          const [x, y, width, height] = pred.bbox;
          ctx.strokeStyle = '#00FF00';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          ctx.fillStyle = '#00FF00';
          ctx.fillText(pred.class, x, y > 10 ? y - 5 : y + 15);
        });

        requestAnimationFrame(detect);
      };

      detect();
    };

    runDetection();
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <video ref={videoRef} style={{ width: '640px' }} autoPlay muted />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
};

export default ObjectDetection;
