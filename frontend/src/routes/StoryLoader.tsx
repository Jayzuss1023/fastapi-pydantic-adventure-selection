import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Story = {
  id: number;
  title: string;
  session_id: string | null;
  created_at: string;
  root_node: CompleteStoryNodeResponse;
  all_nodes: [Record<string, CompleteStoryNodeResponse>];
};

type StorySchemaOptions = {
  options: [{ text: string; node_id: number | null }];
};

type CompleteStoryNodeResponse = {
  id: number;
  content: string;
  is_ending: string;
  is_winning_ending: string;
  options: StorySchemaOptions;
};

export default function StoryLoader() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL: string = "/api";
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        console.log("loading story");
        loadStory(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }, [id]);

  const loadStory = async (storyId: string) => {
    const story = await axios.get(
      `${API_BASE_URL}/stories/${storyId}/complete`,
    );
    console.log(story);
  };
  return (
    <div>
      <div>This is the story loader</div>
    </div>
  );
}
