let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

let isListening = false; // Track if the assistant is active

function speak(text) {
    if (!text) return;

    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "hi-IN";

    function selectVoice() {
        let voices = window.speechSynthesis.getVoices();
        let maleVoice = voices.find(voice => voice.lang.includes("hi-IN") && (voice.name.includes("Male") || voice.name.includes("Deep")));
        text_speak.voice = maleVoice || voices[0];
        window.speechSynthesis.speak(text_speak);
    }

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = selectVoice;
    } else {
        selectVoice();
    }
}

function wishme() {
    let day = new Date();
    let hours = day.getHours();

    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir"); 
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir"); 
    } else {
        speak("Good Evening Sir"); 
    }
}

window.addEventListener("load", () => {
    setTimeout(wishme, 1000);
});

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;

recognition.onstart = () => {
    isListening = true;
    btn.style.display = "none";  // Hide button when mic is on
    voice.style.display = "block"; // Show GIF when mic is on
};

recognition.onend = () => {
    isListening = false;
    voice.style.display = "none"; // Hide GIF when mic is off
    btn.style.display = "block"; // Show button when mic is off
};

function checkWakeWord(transcript) {
    return transcript.includes("hello kaal");
}

recognition.onresult = (event) => {
    let transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
    content.innerText = transcript;
    
    if (!isListening && checkWakeWord(transcript)) {
        isListening = true;
        speak("Yes, I'm listening!");
        recognition.start();
    } else if (isListening) {
        takeCommand(transcript);
    }
};

btn.addEventListener("click", () => {
    recognition.start();
});

function takeCommand(message) {
    if (message.includes("go offline")) {
        speak("Going offline...");
        recognition.stop();
        return;
    }
    
    if (message.includes("hello") || message.includes("hey") || message.includes("hii")) {
        speak("Hello Sir, how can I help you?");
    } else if (message.includes("who are you") || message.includes("hu r u")) {
        speak("I am Kaal, a virtual assistant, created by Sarthak Patel.");
    } else if (message.includes("play") && message.includes("on youtube")) {
        let songName = message.split("play")[1].split("on youtube")[0].trim();
        if (songName) {
            speak(`Playing ${songName} on YouTube...`);
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(songName)}`, "_blank");
        } else {
            speak("Please specify the song name.");
        }
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com/", "_blank");
    } else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("https://whatsapp.com/", "_blank");
    } else if (message.includes("open telegram")) {
        speak("Opening Telegram...");
        window.open("https://telegram.org/", "_blank");
    } else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://facebook.com/", "_blank");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com/", "_blank");
    } else if (message.includes("open calculator")) {
        speak("Opening calculator...");
        window.open("calculator://");
    } else if (message.includes("time")) {
        let time = new Date().toLocaleString("hi-IN", { hour: "numeric", minute: "numeric" });
        speak(time);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleString("hi-IN", { day: "numeric", month: "short" });
        speak(date);
    } else {
        let finaltext = "This is what I found on the internet regarding " + message.replace("Kaal", "");
        speak(finaltext);
        window.open(`https://www.google.com/search?q=${message}`);
    }
}
