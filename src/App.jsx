import { useState } from "react";
import { API } from "./api/axios";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(3);
  const [shortUrl, setShortUrl] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleShorten = async () => {
    if (!url) return alert("Enter a URL");

    setLoading(true);
    setShortUrl("");
    setTimer(3);

    // ⏳ 3 sec timer animation
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setTimer(count);
      if (count === 0) clearInterval(interval);
    }, 1000);

    // ⏳ wait 3 sec then call API
    setTimeout(async () => {
      try {
        const res = await API.post("/shorten", { url });
        setShortUrl(res.data.shortUrl);

        // ✅ show popup
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      } catch (err) {
        alert("Error shortening URL");
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px] text-center">
        
        <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter long URL..."
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleShorten}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Shorten URL
        </button>

        {/* ⏳ Timer */}
        {loading && (
          <p className="mt-4 text-gray-600">
            Generating in {timer}...
          </p>
        )}

        {/* 🔗 Result */}
        {shortUrl && (
          <div className="mt-6">
            <p className="text-green-600 font-semibold">Short URL:</p>
            <div className="flex gap-2 mt-2">
              <input
                value={shortUrl}
                readOnly
                className="border p-2 flex-1 rounded"
              />
              <button
                onClick={copyToClipboard}
                className="bg-green-500 text-white px-3 rounded"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Popup */}
      {showPopup && (
        <div className="absolute top-5 bg-green-500 text-white px-6 py-2 rounded shadow-lg">
          ✅ Short URL created!
        </div>
      )}
    </div>
  );
}