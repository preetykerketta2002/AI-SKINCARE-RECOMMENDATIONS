import { useState, useRef, useEffect } from "react";
import "./App.css";

export default function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [preview, setPreview] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const galRef = useRef();
  const dzRef = useRef();
  const reportRef = useRef(null);

  useEffect(() => {
    if (report && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [report]);

  const loadImage = (file) => {
    if (!file) return;
    setImageFile(file);
    setReport(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setImageBase64(ev.target.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    loadImage(e.dataTransfer.files[0]);
  };

  const runAnalysis = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const apiBaseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const resp = await fetch(`${apiBaseUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        throw new Error(`Server error: ${resp.status}`);
      }

      const data = await resp.json();
      setReport(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Analysis failed. Please try again or use a clearer skin image.");
    }

    setLoading(false);
  };

  const severityClass = (s = "") => {
    const l = s.toLowerCase();
    if (l === "severe") return "sev-severe";
    if (l === "moderate") return "sev-moderate";
    return "sev-mild";
  };

  return (
    <>
      <div className="skn-root">
        {/* NAV */}
        <nav className="skn-nav">
          <div className="skn-logo">
            SKN<span>.</span>AI
          </div>
          <div className="nav-links">
            <span className="nav-link">How it works</span>
            <span className="nav-link">Research</span>
            <span className="nav-link">FAQ</span>
            <button className="nav-cta" onClick={runAnalysis}>
              Get Analysis
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          {/* LEFT */}
          <div className="hero-left">
            <h1>
              Know your skin.
              <br />
              <em>Truly.</em>
            </h1>
            <p className="hero-desc">
              Upload a photo and receive an instant AI-driven dermatological
              analysis — condition detection, severity grading, confidence score,
              and a personalised skincare routine crafted just for you.
            </p>
            <div className="badges">
              {[
                "🔒 Private & Secure",
                "⚡ Instant Results",
                "✅ No Signup Needed",
                "💰 Always Free",
              ].map((b) => (
                <span className="badge" key={b}>
                  {b}
                </span>
              ))}
            </div>
            {/* <div className="stats-row">
              <div>
                <div className="stat-num">
                  98<span>%</span>
                </div>
                <div className="stat-label">Accuracy rate</div>
              </div>
              <div>
                <div className="stat-num">
                  2<span>s</span>
                </div>
                <div className="stat-label">Avg. analysis time</div>
              </div>
              <div>
                <div className="stat-num">
                  12<span>+</span>
                </div>
                <div className="stat-label">Conditions detected</div>
              </div>
            </div> */}
          </div>

          {/* CARD */}
          <div className="card">
            <p className="card-title">Your Free Skin Analysis</p>

            {/* UPLOAD OPTIONS */}
            <div className="upload-options">
              {/* <div className="upload-btn-wrap" onClick={() => camRef.current.click()}>
                <input
                  ref={camRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => loadImage(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <div className="ub-icon">📷</div>
                <div className="ub-label">Take Photo</div>
                <div className="ub-sub">Use camera</div>
              </div> */}
              <div className="upload-btn-wrap" onClick={() => galRef.current.click()}>
                <input
                  ref={galRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => loadImage(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <div className="ub-icon">🖼️</div>
                <div className="ub-label">From Gallery</div>
                <div className="ub-sub">Browse photos</div>
              </div>
            </div>

            {/* DRAG & DROP */}
            <div
              className={`dz${dragOver ? " active" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => dzRef.current.click()}
            >
              <input
                ref={dzRef}
                type="file"
                accept="image/*"
                onChange={(e) => loadImage(e.target.files[0])}
                style={{ display: "none" }}
              />
              <span className="dz-arrow">↑</span> or{" "}
              <strong>drag & drop</strong> an image here
            </div>

            {/* PREVIEW */}
            {preview && (
              <div className="preview-wrap">
                <img src={preview} alt="preview" />
                <span className="preview-badge">✓ Ready to analyse</span>
              </div>
            )}

            {/* BUTTON */}
            <button
              className="analyze-btn"
              onClick={runAnalysis}
              disabled={loading || !imageBase64}
            >
              {loading ? "⏳ Analysing…" : "🔬 Analyse My Skin"}
            </button>

            {/* LOADING */}
            {loading && (
              <>
                <div className="loading-bar">
                  <div className="loading-fill" />
                </div>
                <p className="loading-txt">Running AI dermatological analysis…</p>
              </>
            )}

            {/* ERROR */}
            {error && <p className="error-txt">{error}</p>}

            {/* REPORT */}
            {report && (
              <div className="report" ref={reportRef}>
                <div className="report-header">
                  <span className="report-ttl">Analysis Result</span>
                  <span className={`severity-chip ${severityClass(report.severity)}`}>
                    {report.severity}
                  </span>
                </div>

                <p className="section-lbl">Detected Conditions</p>
                {report.detected_conditions?.map((c, i) => (
                  <div className="cond-row" key={i}>
                    <span className="cond-name">{c.condition}</span>
                    <span className="cond-pct">
                      {Math.round(c.confidence * 100)}%
                    </span>
                  </div>
                ))}

                <div className="conf-section">
                  <div className="conf-header">
                    <span>Overall Confidence</span>
                    <span className="conf-value">
                      {Math.round((report.confidence || 0) * 100)}%
                    </span>
                  </div>
                  <div className="conf-track">
                    <div
                      className="conf-fill"
                      style={{ width: `${Math.round((report.confidence || 0) * 100)}%` }}
                    />
                  </div>
                </div>

                {report.summary && (
                  <div className="treat-box">{report.summary}</div>
                )}

                {report.products && report.products.length > 0 && (
                  <>
                    <p className="section-lbl">Recommended Products</p>
                    {/* <div className="products-grid">
                      {report.products.map((product, i) => (
                        <span className="product-tag" key={i}>{product}</span>
                      ))}
                    </div> */}
                  </>
                )}

                <div className="routine-grid">
                  <div className="routine-card">
                    <h4>🌞 Morning</h4>
                    <ul>
                      {report.routine?.morning?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="routine-card">
                    <h4>🌙 Night</h4>
                    <ul>
                      {report.routine?.night?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="disclaimer">
                  For informational purposes only. Consult a licensed
                  dermatologist for medical advice.
                </p>
              </div>
            )}

            {/* FEATURE STRIP */}
            <div className="features">
              <div className="feat">
                <div className="feat-icon">🛡️</div>
                <div className="feat-txt">GDPR Safe</div>
              </div>
              <div className="feat">
                <div className="feat-icon">🧬</div>
                <div className="feat-txt">Dermatology-grade</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


