"use client";
import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OcrComponent = () => {
  const [image, setImage] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [mainStatements, setMainStatements] = useState<string[]>([]);
  const [childStatements, setChildStatements] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleOcr = () => {
    if (!image) return;

    setLoading(true);
    Tesseract.recognize(image, "eng", {
    })
      .then(({ data: { text } }) => {
        setExtractedText(text);
        processMainStatements(text);
        processChildStatements(text);
        processQuestions(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const processChildStatements = (text: string) => {
    const hashMatches = text.match(/#([^#]*)#/g);
    setChildStatements(hashMatches ? hashMatches.map(match => match.replace(/#/g, "").trim()) : []);
  };

  const processMainStatements = (text: string) => {
    const atMatches = text.match(/@([^@]*)@/g);
    setMainStatements(atMatches ? atMatches.map(match => match.replace(/@/g, "").trim()) : []);
  };

  const processQuestions = (text: string) => {
    const asteriskMatches = text.match(/\*([^*]*)\*/g);
    setQuestions(asteriskMatches ? asteriskMatches.map(match => match.replace(/\*/g, "").trim()) : []);
  };

  return (
    <div>

      <h1>OCR with Tesseract.js</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleOcr} disabled={!image || loading}>
        {loading ? "Processing..." : "Extract Text"}
      </button>

      {extractedText && (
        <div>
          <h2>Full Extracted Text From the Image:</h2>
          <p>{extractedText}</p>
        </div>
      )}

      {mainStatements.length > 0 && (
        <div>
          <h2>Main Statements (Text Between @ and @):</h2>
          {mainStatements.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      )}

      {childStatements.length > 0 && (
        <div>
          <h2>Child Statements (Text Between # and #):</h2>
          {childStatements.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <div>
          <h2>Questions (Text Between * and *):</h2>
          {questions.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      )}
    </div>
  );
};
export default OcrComponent;