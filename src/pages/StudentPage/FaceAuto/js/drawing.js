import * as faceapi from 'face-api.js'

export function resizeCanvasAndResults (dimensions, canvas, results) {
  // eslint-disable-next-line no-undef
  const { width, height } = dimensions instanceof HTMLVideoElement
    ? faceapi.getMediaDimensions(dimensions)
    : dimensions
  canvas.width = width
  canvas.height = height

  // resize detections (and landmarks) in case displayed image is smaller than
  // original size
  return faceapi.resizeResults(results, { width, height })
}

export function drawDetections (dimensions, canvas, detections) {
  const resizedDetections = resizeCanvasAndResults(dimensions, canvas, detections)
  faceapi.drawDetection(canvas, resizedDetections)
}

export function drawLandmarks (dimensions, canvas, results, withBoxes = true) {
  const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)

  if (withBoxes) {
    faceapi.drawDetection(canvas, resizedResults.map(det => det.detection))
  }

  const faceLandmarks = resizedResults.map(det => det.landmarks)
  const drawLandmarksOptions = {
    lineWidth: 2,
    drawLines: true,
    color: 'green'
  }
  faceapi.drawLandmarks(canvas, faceLandmarks, drawLandmarksOptions)
}

export function drawExpressions (dimensions, canvas, results, thresh, withBoxes = true) {
  const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)

  if (withBoxes) {
    faceapi.drawDetection(canvas, resizedResults.map(det => det.detection), { withScore: false })
  }

  faceapi.drawFaceExpressions(canvas, resizedResults.map(({ detection, expressions }) => ({ position: detection.box, expressions })))
}
