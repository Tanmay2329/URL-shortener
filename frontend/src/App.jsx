import { useState } from "react";
import axios from "axios";

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "https://url-shortener-production-fb16.up.railway.app";
  const API_KEY = "YOUR_API_KEY"; // 🔥 replace this

  const handleShorten = async () => {
    if (!url) {
        setError("Please Enter a URL");
        return;
    }
    try{
      setLoading(true);
      setError("");
      setShortUrl("");

      const res = await axios.post(
        `${API}/shorten`,
        { url },
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );

      setShortUrl(res.data.shortUrl);
      
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔗 URL Shortener</h2>

        <input
          type="text"
          placeholder="Enter long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleShorten} style={styles.button}>
          {loading ? "Processing..." : "Shorten"}
        </button>

        {shortUrl && (
          <div style={styles.success}>
            <p>Short URL:</p>
            <a href={shortUrl} target="_blank">
              {shortUrl}
            </a>
            <br />
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              style={styles.copy}
            >
              Copy
            </button>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  success: {
    marginTop: "15px",
    background: "#e0ffe0",
    padding: "10px",
  },
  error: {
    marginTop: "15px",
    color: "red",
  },
  copy: {
    marginTop: "5px",
  },
};