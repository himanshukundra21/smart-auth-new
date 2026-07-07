// 🔥 LOAD MODELS (FIXED PATH)
async function loadModels(){

  await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('./models');

  console.log("Models Loaded ✅");
}


// 🔥 SAVE FACE
function saveFace(descriptor){
  localStorage.setItem("ownerFace", JSON.stringify(Array.from(descriptor)));
}


// 🔥 GET FACE
function getFace(){
  let data = localStorage.getItem("ownerFace");
  return data ? new Float32Array(JSON.parse(data)) : null;
}


// 🔥 MATCH FACE (REAL AI MATCH)
function matchFace(stored, current){

  if(!stored || !current) return false;

  let distance = faceapi.euclideanDistance(stored, current);

  console.log("Distance:", distance);

  return distance < 0.45; // 🔥 थोड़ा strict किया (better security)
}