import { useEffect, useState } from "react";
import type {
  Story,
  CompleteStoryNodeResponse,
  StorySchemaOptions,
} from "../routes/StoryLoader";

export default function StoryGame({
  story,
  onNewStory,
}: {
  story: Story;
  onNewStory: () => void;
}) {
  const [currentNodeId, setCurrentNodeId] = useState<number | null>(null);
  const [currentNode, setCurrentNode] =
    useState<CompleteStoryNodeResponse | null>(null);
  const [options, setOptions] = useState<[StorySchemaOptions] | []>([]);
  const [isEnding, setIsEnding] = useState<boolean>(false);
  const [isWinningEnding, setIsWinningEnding] = useState<boolean>(false);

  // Update if a different story is passed
  useEffect(() => {
    if (story && story.root_node) {
      setCurrentNodeId(story.root_node.id);
    }
  }, [story]);

  // Update other variables if story changes
  useEffect(() => {
    if (currentNodeId && story && story.all_nodes) {
      const node = story.all_nodes[currentNodeId];
      setCurrentNode(node);
      setIsEnding(node.is_ending === "false" ? false : true);
      setIsWinningEnding(node.is_winning_ending === "false" ? false : true);

      if (!node.is_ending && node.options && node.options.length > 0) {
        setOptions(node.options);
      } else {
        setOptions([]);
      }
    }
  }, [currentNodeId, story]);

  return (
    <div>
      <div>Story</div>
    </div>
  );
}
