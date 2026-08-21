import { useEffect, useState } from "react";
import axios from "axios";
import ThemeInput from "../components/ThemInput";
import { API_BASE_URL } from "./StoryLoader";
import { useNavigate } from "react-router-dom";
import LoadingStatus from "../components/LoadingStatus";

type StoryJob = {
  job_id: string;
  status: STATUS;
  story_id: string;
  error: string | null;
  created_at: string;
  completed_at: string;
};

const STATUSES = ["processing", "complete", "failed"] as const;
type STATUS = (typeof STATUSES)[number];

export default function StoryGenerator() {
  const [theme, setTheme] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<STATUS | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let pollInterval: number;

    if (jobId && status === "processing") {
      pollInterval = setInterval(() => {
        pollJobStatus(jobId);
      }, 5000);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [jobId, status]);

  const generateStory = async (theme: string) => {
    setLoading(true);
    setError(null);
    setTheme(theme);

    try {
      const job = await axios.post(`${API_BASE_URL}/stories/create`, {
        theme,
      });

      const jobData: StoryJob = job.data;
      const jobDataId = jobData.job_id;
      const jobDataStatus = jobData.status;

      setJobId(jobDataId);
      setStatus(jobDataStatus);
      pollJobStatus(jobDataId);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Failed to generate story");
    }
  };

  const pollJobStatus = async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
      const jobData: StoryJob = response.data;
      const { story_id, status, error: jobError } = jobData;
      setStatus(status);
      if (story_id && status === "complete") {
        fetchStory(story_id);
      } else if (status === "failed" || jobError) {
        setError(jobError || "Unable to generate your story");
        setLoading(false);
      }
    } catch (err) {
      if (axios.isAxiosError(error) && error.response?.status) {
        setError(err instanceof Error ? err.message : error);
      }
    }
  };

  const reset = () => {
    setJobId(null);
    setStatus(null);
    setError(null);
    setTheme("");
    setLoading(false);
  };

  const fetchStory = (storyId: string) => {
    try {
      setLoading(false);
      setStatus("complete");
      navigate(`/story/${storyId}`);
    } catch (err) {
      //   if (axios.isAxiosError(error) && error.response?.status !== 404) {
      setError(err instanceof Error ? err.message : error);
      setLoading(false);
      //   }
    }
  };

  return (
    <div className="story-generator">
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}

      {!jobId && !error && !loading && <ThemeInput onSubmit={generateStory} />}

      {loading && <LoadingStatus theme={theme} />}
    </div>
  );
}
