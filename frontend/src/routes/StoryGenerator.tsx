import { useState } from "react";
import axios from "axios";

const STATUSES = ["processing", "completed", "failed"] as const;
type STATUS = (typeof STATUSES)[number];

export default function StoryGenerator() {
  const [theme, setTheme] = useState("");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState<STATUS>("processing");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //   const generateStory = async (theme) => {
  //     try {
  //     } catch (err) {}
  //   };

  return (
    <div>
      <div>StoryGenerator Page</div>
    </div>
  );
}
