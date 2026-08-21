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
  const [isEnding, setIsEnding] = useState(false);
  const [isWinningEnding, setIsWinningEnding] = useState(false);

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
      setIsEnding(node.is_ending === "true");
      setIsWinningEnding(node.is_winning_ending === "true");

      if (!node.is_ending && node.options && node.options.length > 0) {
        setOptions(node.options);
      } else {
        setOptions([]);
      }
    }
  }, [currentNodeId, story]);

  // Change in current node id will populate the UI with the next node
  const chooseOption = (optionId: number) => {
    setCurrentNodeId(optionId);
  };

  const restartStory = () => {
    if (story && story.root_node.id) {
      setCurrentNodeId(story.root_node.id);
    }
  };

  return (
    <div className="story-game">
      <header className="story-header">
        <h2>{story.title}</h2>
      </header>

      <div className="story-content">
        {currentNode && (
          <div className="story-node">
            <p>{currentNode.content}</p>

            {isEnding ? (
              <div className="story-ending">
                <h3>{isWinningEnding ? "Congratulations" : "The End"}</h3>
                {isWinningEnding
                  ? "You reached a winning ending"
                  : "Your adventure has ended."}
              </div>
            ) : (
              <div className="story-options">
                <h3>What will you do?</h3>
                <div className="options-list">
                  {options.map((option, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => chooseOption(option.node_id)}
                        className="option-btn"
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="story-controls">
          <button onClick={restartStory} className="reset-btn">
            Restart Story
          </button>
        </div>

        {onNewStory && (
          <button onClick={onNewStory} className="new-story-btn">
            New Story
          </button>
        )}
      </div>
    </div>
  );
}
