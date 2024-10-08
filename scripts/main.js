import { initAudio, playLost,playOne,playPaper,playRock,playScissors,playThree,playTie,playTwo,playWin, playPopSound, playSnapSound, toggleSound, updateSpeakerIcon } from './audio.js';

const videoElement = document.getElementById('webcam');
const resultDiv = document.getElementById('result');
const helpButton = document.getElementById('help-button');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');

let gestureRecognizer;
import { FilesetResolver, GestureRecognizer } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0';

let runningMode = "IMAGE";
let webcamRunning = false;
let gameState = "WAITING";
let countDown = 5;
let userScore = 0;
let computerScore = 0;

initAudio();

const gestures = {
    "Thumb_Up": "👍",
    "Closed_Fist": "👊",
    "Victory": "✌️",
    "Open_Palm": "🖐️",
    "No_Gesture":"🚫"
};

const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
        },
        runningMode: runningMode
    });
};

const startWebcam = async () => {
    const constraints = {
        video: true
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    videoElement.addEventListener("loadeddata", predictWebcam);

    resultDiv.innerHTML = "Make a thumbs up 👍 to start playing !";
};

const predictWebcam = async () => {
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }
    let nowInMs = Date.now();
    const results = gestureRecognizer.recognizeForVideo(videoElement, nowInMs);

    if (results.gestures.length > 0) {
        const gestureCategory = results.gestures[0][0].categoryName;
        handleGesture(gestureCategory);
    }

    window.requestAnimationFrame(predictWebcam);
};


const handleGesture = (gesture) => {

    switch (gameState) {
        case "WAITING":
            if (gesture === "Thumb_Up") {
                startGame();
            }
            break;
        case "IDLE":
            // Ignore gestures during the countdown
            break;
        case "PLAYING":
            if (["Closed_Fist", "Victory", "Open_Palm"].includes(gesture)) {
                endGame(gesture);
            }
            break;
    }
};

let playOnce = null; 

const startGame = () => {
    gameState = "IDLE";
    console.log("started");
    let countDown = 7;

    playSnapSound();
    
    const countInterval = setInterval(() => {
        countDown--;
        if (countDown === 6) {
            resultDiv.innerHTML = `Rock`;
            if(playOnce!="Rock")
            {
                playOnce="Rock";
                playRock();
            }
        } else if (countDown === 5) {
            resultDiv.innerHTML = `Scissors`;
            if(playOnce!="Scissors")
            {
                playOnce="Scissors";
                playScissors();
            }
        } else if (countDown === 4) {
            resultDiv.innerHTML = `Paper`;
            if(playOnce!="Paper")
            {
                playOnce="Paper";
                playPaper();
            }
        } else if (countDown === 3) {
            resultDiv.innerHTML = `One`;
            if(playOnce!="one")
            {
                playOnce="one";
                playOne();
            }
            
        } else if (countDown === 2) {
            resultDiv.innerHTML = `Two`;
            if(playOnce!="two")
            {
                playOnce="two";
                playTwo();
            }
        } else if (countDown === 1) {
            resultDiv.innerHTML = `Three`;
            if(playOnce!="Three")
            {
                playOnce="one";
                playThree();
            }
        } else if (countDown < 1) {

            clearInterval(countInterval);

            if(playOnce!="timeOut")
            {
                playOnce="timeOut";
                playPopSound();
            }
      
            setTimeout(() => {
                gameState = "PLAYING";
                console.log("listening");
                resultDiv.innerHTML = "Make your move now!";
                
                // Set a timeout to end the game if no move is made
                setTimeout(() => {
                    if (gameState === "PLAYING") {
                        endGame("No_Gesture");
                    }
                }, 3000); 
            }, 100);
        }
    }, 800);
};

const endGame = (userGesture) => {
    gameState = "IDLE";
    console.log("endgame mode");
    const computerGesture = ["Closed_Fist", "Victory", "Open_Palm"][Math.floor(Math.random() * 3)];
    let result;
    if (userGesture === "No_Gesture") {
        result = "You didn't make a move in time. I win!";
        computerScore++;
    } else {
        result = determineWinner(userGesture, computerGesture);
    }
    displayResult(userGesture, computerGesture, result);

    setTimeout(() => {
        gameState = "WAITING";
        console.log("Game state changed to WAITING");
    }, 1000);
};



const determineWinner = (user, computer) => {
    if (user === computer) return "Tie";
    if (
        (user === "Closed_Fist" && computer === "Victory") ||
        (user === "Victory" && computer === "Open_Palm") ||
        (user === "Open_Palm" && computer === "Closed_Fist")
    ) {
        userScore++;
        return "You win";
    }
    computerScore++;
    return "I win";
};

const displayResult = (userGesture, computerGesture, result) => {
    
    resultDiv.innerHTML = `
        You: ${gestures[userGesture]} vs Me: ${gestures[computerGesture]}<br><br>
        ${result} ${result !== "Tie" ? "🏆" : ""}<br><br>
        Score: You ${userScore} - ${computerScore} Me<br><br>
        Thumbs up 👍 to play again!
    `;

    setTimeout(() => {
        if(result==="You win")
        {
            playWin();
        }
        else if(result==="Tie")
        {
            playTie();
        }
        else
        {
            playLost();
        }
        
    }, 500);
};

helpButton.onclick = () => {
    modal.style.display = "block";
};

closeModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

const startApplication = async () => {
    await createGestureRecognizer();
    await startWebcam();
};


startApplication();

resultDiv.innerHTML = "please allow webcam";

export {toggleSound, updateSpeakerIcon};