import * as faceapi from 'face-api.js'

export const SSD_MOBILENETV1 = 'ssd_mobilenetv1'
export const TINY_FACE_DETECTOR = 'tiny_face_detector'
export const MTCNN = 'mtcnn'

let selectedFaceDetector = SSD_MOBILENETV1

// ssd_mobilenetv1 options
let minConfidence = 0.5

// tiny_face_detector options
let inputSize = 512
let scoreThreshold = 0.5

// mtcnn options
let minFaceSize = 20

export function getFaceDetectorOptions () {
  return selectedFaceDetector === SSD_MOBILENETV1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : (
      selectedFaceDetector === TINY_FACE_DETECTOR
        ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
        : new faceapi.MtcnnOptions({ minFaceSize })
    )
}

export function getCurrentFaceDetectionNet () {
  if (selectedFaceDetector === SSD_MOBILENETV1) {
    return faceapi.nets.ssdMobilenetv1
  }
  if (selectedFaceDetector === TINY_FACE_DETECTOR) {
    return faceapi.nets.tinyFaceDetector
  }
  if (selectedFaceDetector === MTCNN) {
    return faceapi.nets.mtcnn
  }
}

export function isFaceDetectionModelLoaded () {
  return !!getCurrentFaceDetectionNet().params
}

export async function changeFaceDetector (detector) {
  selectedFaceDetector = detector

  if (!isFaceDetectionModelLoaded()) {
    await getCurrentFaceDetectionNet().load(process.env.PUBLIC_URL + '/weights/')
  }
}
