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
      "6230 Rupley Cir",
      "6230 Rupley Cir Houston TX 77087",
      "77087",
      "Trip Six",
      "Trip Six HTX"
    ],
    theEnd: [
      "7126 Lawndale St",
      "7126 Lawndale St Houston TX 77023",
      "77023",
      "The Compound",
      "The Compound HTX",
      "The Compound Houston",
      "The End",
      "The End HTX"
    ],
    eighteen: [
      "1810 Ojeman",
      "1810 Ojeman HTX",
      "1810 Ojeman Rd",
      "1810 Ojeman Rd Houston TX 77080",
      "77080",
      "Eighteen Ten Ojeman",
      "Eighteen Ten Ojeman HTX"
    ],
    mohawk: [
      "78701",
      "912 Red River St",
      "912 Red River St Austin TX 78701",
      "Austin",
      "Mohawk Austin",
      "Mohawk ATX"
    ]
  };
  
  const [selectedTags, setSelectedTags] = useState([...defaultSelectedTags]);
  const [generatedHashtags, setGeneratedHashtags] = useState("");
  const [generatedSemicolon, setGeneratedSemicolon] = useState("");
  const [generatedComma, setGeneratedComma] = useState("");
  const [bandName, setBandName] = useState("");

  const tags = [
    "Anarcho-Punk",
    "Chain punk",
    "Crust Punk",
    "Crustgrind",
    "Crossover Thrash",
    "Crossover",
    "D-beat",
    "Egg punk",
    "Emo",
    "Folk Punk",
    "Garage Punk",
    "Gothic Punk",
    "Grindcore",
    "Hardcore",
    "Hardcore Punk",
    "Horror Punk",
    "Melodic Hardcore",
    "Noise Punk",
    "Oi!",
    "Pop Punk",
    "Post-Hardcore",
    "Post-Punk",
    "Powerviolence",
    "Psychobilly",
    "Raw Punk",
    "Screamo",
    "Skate Punk",
    "Street Punk",
    "Straight Edge",
    "Thrash",
    "Thrashcore",
    "Youth Crew"
  ];

  const containerRef = useRef(null);
  const outputRef = useRef(null);
  const clickTimeoutRef = useRef(null);
  const draggingRef = useRef(false);

  const handleBandNameChange = (event) => {
    setBandName(event.target.value);
  };

  const handleBandNameKeyDown = (event) => {
    if (event.key === "Enter") {
      const bandNameStartCase = startCaseWords(bandName);
      const updatedTags = [
        ...selectedTags.filter(
          (tag) => !tag.toLowerCase().includes(bandName.toLowerCase())
        ),
        bandNameStartCase
      ].sort();
      setSelectedTags(updatedTags);
      setBandName("");
    }
  };

  const startCaseWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
    setSelectedTags((prevTags) => {
      // Filter out previously selected tags associated with any venue (excluding default selected tags)
      const filteredPrevTags = prevTags.filter(
        (tag) => !Object.values(venues).flat().includes(tag)
      );
  
      // Merge default selected tags, filtered previously selected tags, and venue tags
      const updatedTags = [
        ...defaultSelectedTags,  // Include the default selected tags
        ...filteredPrevTags,     // Include the filtered previously selected tags
        ...venueTags             // Include the tags associated with the clicked venue
      ];
  
      // Remove any duplicate tags using Set object and convert back to array
      return [...new Set(updatedTags)];
    });
  };
  

  const clearSelectedTags = () => {
    setSelectedTags([...defaultSelectedTags]);
    setBandName("");
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
    <div style={{ height: "95vh", overflow: "auto" }}>
      <h1>Hashtag Generator</h1>

      <div>
        <b>Venue: </b>
        <button onClick={() => handleVenueClick(venues.tripSix)}>
          Trip Six
        </button>
        <button onClick={() => handleVenueClick(venues.theEnd)}>
          The End / The Compound
        </button>
        <button onClick={() => handleVenueClick(venues.eighteen)}>
          1810 Ojeman
        </button>
        <button onClick={() => handleVenueClick(venues.mohawk)}>
          Mohawk Austin
        </button>
      </div>
      <br />
      <input
        type="text"
        value={bandName}
        onChange={handleBandNameChange}
        onKeyDown={handleBandNameKeyDown}
        placeholder="Enter band name"
        style={{
          minHeight: "24px"
        }}
      />
      <div ref={containerRef} onMouseUp={handleMouseUp}>
        <h3>Words</h3>
        <ul style={{ listStyle: "none", paddingLeft: 16, columnCount: 5 }}>
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
        <h3>
          Selected Words:{" "}
          <button onClick={clearSelectedTags}>Clear Selected Words</button>
        </h3>
        <div>
          {selectedTags.length > defaultSelectedTags.length &&
            selectedTags.sort().join(", ")}
        </div>
        <br />
      </div>
      <hr />
      {selectedTags.length > defaultSelectedTags.length && (
        <>
          {generatedHashtags && (
            <div>
              <OutputSection
                title="Generated Hashtags (for Instagram)"
                content={generatedHashtags}
                onClick={() => copyToClipboard(generatedHashtags)}
              />
            </div>
          )}
          {generatedSemicolon && (
            <div>
              <OutputSection
                title="Generated Semicolon (for Archive.org)"
                content={generatedSemicolon}
                onClick={() => copyToClipboard(generatedSemicolon)}
              />
            </div>
          )}
          {generatedComma && (
            <div>
              <OutputSection
                title="Generated Comma (for YouTube)"
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
