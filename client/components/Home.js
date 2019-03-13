import React from 'react'

export const Home = () => {
  return (
    <div>
      <div id="info" style="display:none" />
      <div id="loading">Loading the model...</div>
      <div id="main" style="display:none">
        <video
          id="video"
          playsinline
          style=" -moz-transform: scaleX(-1);
        -o-transform: scaleX(-1);
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
        display: none;
        "
        />
        <canvas id="output" />
      </div>
      <div className="footer">
        <div className="footer-text">
          <p>
            PoseNet runs with either a <strong>single-pose</strong> or{' '}
            <strong>multi-pose</strong> detection algorithm. The single person
            pose detector is faster and more accurate but requires only one
            subject present in the image.
            <br />
            <br /> The <strong>output stride</strong> and{' '}
            <strong>image scale factor</strong> have the largest effects on
            accuracy/speed. A <i>higher</i> output stride results in lower
            accuracy but higher speed. A <i>higher</i> image scale factor
            results in higher accuracy but lower speed.
          </p>
        </div>
      </div>

      <script src="../cameara/camera.js" />
    </div>
  )
}

export default Home
