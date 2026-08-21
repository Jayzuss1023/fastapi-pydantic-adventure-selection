import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingStatus from "../components/LoadingStatus";
import StoryGame from "../components/StoryGame";

export type Story = {
  id: number;
  title: string;
  session_id: string | null;
  created_at: string;
  root_node: CompleteStoryNodeResponse;
  all_nodes: [CompleteStoryNodeResponse];
};

export type StorySchemaOptions = {
  text: string;
  node_id: number;
};

export type CompleteStoryNodeResponse = {
  id: number;
  content: string;
  is_ending: string;
  is_winning_ending: string;
  options: [StorySchemaOptions];
};
export const API_BASE_URL: string = "/api";

export default function StoryLoader() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    setError("Story not found");
    return;
  }

  useEffect(() => {
    loadStory(id);
  }, [id]);

  const loadStory = async (storyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const story = await axios.get(
        `${API_BASE_URL}/stories/${storyId}/complete`,
      );

      const storyData = story.data;
      setLoading(false);
      setStory(storyData);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status == 404) {
        setError("Story not found.");
      } else {
        setError("Failed to load story");
      }
    } finally {
      setLoading(false);
    }
  };

  const createNewStory = () => {
    navigate("/");
  };

  if (loading && story?.title) {
    return <LoadingStatus theme={story.title} />;
  }

  if (error) {
    return (
      <div className="story-loader">
        <div className="error-message">
          <h2>Story Not Found</h2>
          <p>{error}</p>
          <button onClick={createNewStory}>Go to Story Generator</button>
        </div>
      </div>
    );
  }

  if (story) {
    return (
      <div className="story-loader">
        <StoryGame story={story} onNewStory={createNewStory} />
      </div>
    );
  }
}
