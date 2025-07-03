// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.lang = 'en-US';

let finalTranscript = "";

// Start recognition on mic click
document.querySelector(".mic").addEventListener("click", () => {
    recognition.start();
    console.log("Voice recognition started");
});

// Create display area for transcript
const transcriptBox = document.createElement("div");
transcriptBox.className = "transcript-box";
document.body.prepend(transcriptBox);

// Listen for voice input
recognition.onresult = function(event) {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            finalTranscript += transcript + "\n";
            speakText(transcript); // Speak it back
        } else {
            interimTranscript += transcript;
        }
    }

    // Display spoken text
    const safeText = finalTranscript.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    transcriptBox.innerHTML = ` <p> <b> 🎤You said: </b><br><span style="color:#6fffcf;">${safeText}</span > </p>`;
}

// Speak the text using TTS
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
}

// Create Download Button
const downloadBtn = document.createElement('button');
downloadBtn.textContent = "⬇ Download Transcript";
downloadBtn.className = "download-btn";
document.body.appendChild(downloadBtn);

// Download the transcript as .txt
downloadBtn.addEventListener('click', () => {
    if (!finalTranscript.trim()) {
        alert("No transcript to download.");
        return;
    }

    const blob = new Blob([finalTranscript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transcript.txt";
    link.click();
    URL.revokeObjectURL(url);
});