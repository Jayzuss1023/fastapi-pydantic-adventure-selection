import { useState } from "react";

export default function ThemeInput({
  onSubmit,
}: {
  onSubmit: (theme: string) => void;
}) {
  const [theme, setTheme] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!theme.trim()) {
      setError("Please enter a theme name");
      return;
    }
    onSubmit(theme);
  };
  return (
    <div className="theme-input-container">
      <h2>Generate Your Adventure</h2>
      <p>Enter a theme for your interactive story</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Enter a theme (e.g. prirates, space, medieval...)"
            className={error ? "error" : ""}
          />
          {error && <p className="error-text">{error}</p>}
        </div>
        <button type="submit" className="generate-btn">
          Generate Story
        </button>
      </form>
    </div>
  );
}
