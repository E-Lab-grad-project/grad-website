"use client";

import React, { useEffect } from "react";
import styled from "styled-components";

type ArrowControlsProps = {
  arm: "arm1" | "arm2";
  onPredictions: (predictions: string[]) => void;
};

const ArrowControls = ({ arm, onPredictions }: ArrowControlsProps) => {
  const sendCommand = async (command: string) => {
    try {
      // 🔹 MANUAL control endpoint (NO NLP)
      const res = await fetch("http://localhost:8000/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: [command],
          arm, // optional, future-proofing
        }),
      });

      if (res.ok) {
        // 🔹 Still update NLP Prediction box visually
        onPredictions([command.toUpperCase()]);
      }
    } catch (err) {
      console.error("Failed to send manual command", err);
    }
  };

  // ✅ Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, string> = {
        ArrowUp: "move_up",
        ArrowDown: "move_down",
        ArrowLeft: "move_left",
        ArrowRight: "move_right",
      };

      if (map[e.key]) {
        e.preventDefault();
        sendCommand(map[e.key]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [arm]);

  return (
    <StyledWrapper>
      <div className="arrow-grid">
        <div />
        <ArrowButton label="▲" onClick={() => sendCommand("move_up")} />
        <div />

        <ArrowButton label="❮" onClick={() => sendCommand("move_left")} />
        <ArrowButton label="▼" onClick={() => sendCommand("move_down")} />
        <ArrowButton label="❯" onClick={() => sendCommand("move_right")} />
      </div>
    </StyledWrapper>
  );
};

const ArrowButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button className="button-3d" onClick={onClick}>
    <div className="button-top">
      <span className="arrow">{label}</span>
    </div>
    <div className="button-bottom" />
    <div className="button-base" />
  </button>
);

const StyledWrapper = styled.div`
  .arrow-grid {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: repeat(2, auto);
    gap: 10px;
    justify-content: center;
    align-items: center;
  }

  .button-3d {
    appearance: none;
    position: relative;
    border: 0;
    padding: 0 8px;
    min-width: 4em;
    min-height: 4em;
    background: transparent;
    cursor: pointer;
    border-radius: 20px;
  }

  .button-top {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    padding: 8px 16px;
    background-image: linear-gradient(145deg, #6a11cb, #2575fc);
    color: white;
    border-radius: 20px;
    transition: transform 0.2s;
  }

  .button-3d:active .button-top {
    transform: translateY(2px);
  }

  .button-bottom {
    position: absolute;
    bottom: 4px;
    left: 4px;
    width: calc(100% - 8px);
    height: calc(100% - 10px);
    background-image: linear-gradient(145deg, #2575fc, #6a11cb);
    border-radius: 20px;
    z-index: 1;
  }

  .button-base {
    position: absolute;
    top: 4px;
    left: 0;
    width: 100%;
    height: calc(100% - 4px);
    background: rgba(0, 0, 0, 0.15);
    border-radius: 20px;
    z-index: 0;
  }

  .arrow {
    font-size: 1.5rem;
    user-select: none;
  }
`;

export default ArrowControls;
