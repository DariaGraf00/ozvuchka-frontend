
import React, { useState, useEffect } from "react";
import axios from "axios";

const voicesUrl = "https://api.elevenlabs.io/v1/voices";
const backendUrl = "http://127.0.0.1:8000/synthesize";
const API_KEY = "sk_e46be3f28ef39c89677d6132f0f4a0d23d4fb03241d9f802";

const App = () => {
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [voices, setVoices] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);

  const fetchVoices = async () => {
    const res = await axios.get(voicesUrl, {
      headers: { "xi-api-key": API_KEY },
    });
    setVoices(res.data.voices);
    if (res.data.voices.length > 0) {
      setVoiceId(res.data.voices[0].voice_id);
    }
  };

  useEffect(() => {
    fetchVoices();
  }, []);

  const handleSynthesize = async () => {
    const res = await axios.post(
      backendUrl,
      { text, voice_id: voiceId },
      { responseType: "blob" }
    );
    const url = URL.createObjectURL(res.data);
    setAudioUrl(url);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>🎙️ Озвучка текста</h1>

      <label>Выберите голос:</label>
      <select
        value={voiceId}
        onChange={(e) => setVoiceId(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      >
        {voices.map((voice) => (
          <option key={voice.voice_id} value={voice.voice_id}>
            {voice.name}
          </option>
        ))}
      </select>

      <label>Введите текст:</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: 10 }}
      />

      <button onClick={handleSynthesize} style={{ padding: 10, marginTop: 10 }}>
        🔊 Озвучить
      </button>

      {audioUrl && (
        <>
          <h3>Результат:</h3>
          <audio controls src={audioUrl}></audio>
          <a href={audioUrl} download="ozvuchka.mp3">📥 Скачать MP3</a>
        </>
      )}
    </div>
  );
};

export default App;
