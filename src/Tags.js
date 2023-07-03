import React, { useState, useRef, useEffect } from "react";

const App = () => {
  const defaultSelectedTags = [
    "Houston",
    "Houston Texas",
    "Texas",
    "HTX",
    "TX",
    "Houston TX",
    "Harris County",
    "Music",
    "Punk",
    "Punk Rock",
    "Punk Music"
  ];

  const venues = {
    tripSix: [
      "Trip Six",
      "Trip Six HTX",
      "6230 Rupley Cir Houston TX 77087",
      "6230 Rupley Cir",
      "77087",
      "DIY",
      "All Ages"
    ],
    theEnd: [
      "The End",
      "The Compound",
      "The End Houston",
      "The Compound Houston",
      "The End HTX",
      "The Compound HTX",
      "7126 Lawndale St Houston TX 77023",
      "7126 Lawndale St",
      "77023",
      "DIY",
      "All Ages"
    ]
  };

  const [selectedTags, setSelectedTags] = useState([...defaultSelectedTags]);
  const [generatedHashtags, setGeneratedHashtags] = useState("");
  const [generatedSemicolon, setGeneratedSemicolon] = useState("");
  const [generatedComma, setGeneratedComma] = useState("");

  const tags = ["test1", "test2"];

  const containerRef = useRef(null);
  const outputRef = useRef(null);
  const clickTimeoutRef = useRef(null);
  const draggingRef = useRef(false);

  const handleTagClick = (tag) => {
    if (defaultSelectedTags.includes(tag)) {
      return;
    }

    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      const updatedTags = [
        ...selectedTags,
        tag.charAt(0).toUpperCase() + tag.slice(1)
      ].sort();
      setSelectedTags([...new Set(updatedTags)]);
    }
  };

  const handleVenueClick = (venueTags) => {
    const filteredTags = venueTags.filter(
      (tag) => !defaultSelectedTags.includes(tag)
    );
    setSelectedTags((prevTags) => [
      ...defaultSelectedTags,
      ...filteredTags.filter((tag) => !prevTags.includes(tag))
    ]);
  };

  const clearSelectedTags = () => {
    setSelectedTags([...defaultSelectedTags]);
  };

  const generateHashtags = () => {
    const hashtags = selectedTags.map((tag) => {
      const formattedTag = tag.replace(/\s/g, "");
      return `#${formattedTag}`;
    });
    const formattedHashtags = hashtags.join(" ");
    setGeneratedHashtags(formattedHashtags);
  };

  const generateSemicolon = () => {
    const formattedSemicolon = selectedTags.join(";");
    setGeneratedSemicolon(formattedSemicolon);
  };

  const generateComma = () => {
    const formattedComma = selectedTags.join(",");
    setGeneratedComma(formattedComma);
  };

  useEffect(() => {
    generateHashtags();
    generateSemicolon();
    generateComma();
  }, [selectedTags]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleMouseDown = (tag) => {
    clickTimeoutRef.current = setTimeout(() => {
      if (defaultSelectedTags.includes(tag)) {
        return;
      }
      setSelectedTags([...selectedTags, tag]);
      draggingRef.current = true;
    }, 200);
  };

  const handleMouseUp = () => {
    clearTimeout(clickTimeoutRef.current);
    if (draggingRef.current) {
      draggingRef.current = false;
    }
  };

  const handleTagMouseEnter = (tag) => {
    if (draggingRef.current) {
      if (defaultSelectedTags.includes(tag)) {
        return;
      }
      if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
      } else {
        const updatedTags = [...selectedTags, tag].sort();
        setSelectedTags(updatedTags);
      }
    }
  };

  const handleGlobalMouseUp = () => {
    if (draggingRef.current) {
      clearTimeout(clickTimeoutRef.current);
      draggingRef.current = false;
    }
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  useEffect(() => {
    const outputRefCurrent = outputRef.current;

    const handleCopyToClipboard = (event) => {
      const outputText = outputRefCurrent.innerText;
      if (event.clipboardData) {
        event.clipboardData.setData("text/plain", outputText);
      } else if (window.clipboardData) {
        window.clipboardData.setData("Text", outputText);
      }
      event.preventDefault();
    };

    outputRefCurrent.addEventListener("copy", handleCopyToClipboard);

    return () => {
      outputRefCurrent.removeEventListener("copy", handleCopyToClipboard);
    };
  }, [generatedHashtags, generatedSemicolon, generatedComma, outputRef]);

  return (
    <div>
      <h1>Hashtag Generator</h1>
      <div>
        <h3>Venue:</h3>
        <button onClick={() => handleVenueClick(venues.tripSix)}>
          Trip Six
        </button>
        <button onClick={() => handleVenueClick(venues.theEnd)}>
          The End / The Compound
        </button>
      </div>
      <div
        ref={containerRef}
        onMouseUp={handleMouseUp}
        style={{ userSelect: "none" }}
      >
        <h3>Words</h3>
        <ul>
          {tags.map((tag) => (
            <li
              key={tag}
              onClick={() => handleTagClick(tag)}
              onMouseDown={() => handleMouseDown(tag)}
              onMouseEnter={() => handleTagMouseEnter(tag)}
              style={{
                fontWeight: selectedTags.includes(tag) ? "bold" : "normal"
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Selected Words:</h3>
        <div>
          {selectedTags.length > defaultSelectedTags.length &&
            selectedTags.join(", ")}
        </div>
        <br />
        <button onClick={clearSelectedTags}>Clear Selected Tags</button>
      </div>

      {selectedTags.length > defaultSelectedTags.length && (
        <>
          {generatedHashtags && (
            <div>
              <OutputSection
                title="Generated Hashtags"
                content={generatedHashtags}
                onClick={() => copyToClipboard(generatedHashtags)}
              />
            </div>
          )}
          {generatedSemicolon && (
            <div>
              <OutputSection
                title="Generated Semicolon"
                content={generatedSemicolon}
                onClick={() => copyToClipboard(generatedSemicolon)}
              />
            </div>
          )}
          {generatedComma && (
            <div>
              <OutputSection
                title="Generated Comma"
                content={generatedComma}
                onClick={() => copyToClipboard(generatedComma)}
              />
            </div>
          )}
        </>
      )}

      <div ref={outputRef}></div>
    </div>
  );
};

const OutputSection = ({ title, content, onClick }) => (
  <div>
    <h3>{title}:</h3>
    <div>{content}</div>
    <br />
    <button onClick={onClick}>Copy to Clipboard</button>
  </div>
);

export default App;
