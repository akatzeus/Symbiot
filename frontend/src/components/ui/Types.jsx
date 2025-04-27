"use client";

import React from "react";
import { cn } from "../../lib/utils";

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName
}) => {
  const containerRef = React.useRef(null);
  const lastCharRef = React.useRef(null);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const [visibleChars, setVisibleChars] = React.useState(0);

  const fullText = words.map((word) => word.text).join("");

  // Typing effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleChars < fullText.length) {
        setVisibleChars((prev) => prev + 1);
      }
    }, 30); // Typing speed

    return () => clearTimeout(timer);
  }, [visibleChars, fullText]);

  // Calculate height (to prevent layout shift)
  React.useEffect(() => {
    if (containerRef.current) {
      const clone = containerRef.current.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.width = `${containerRef.current.clientWidth}px`;

      const spans = clone.querySelectorAll("span");
      spans.forEach((span) => {
        span.style.opacity = "1";
        span.style.display = "inline";
      });

      document.body.appendChild(clone);
      setContainerHeight(clone.clientHeight);
      document.body.removeChild(clone);
    }
  }, [words]);

  // Update cursor position
  React.useEffect(() => {
    if (lastCharRef.current && containerRef.current) {
      const charRect = lastCharRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setCursorPos({
        x: charRect.right - containerRect.left,
        y: charRect.top - containerRect.top
      });
    }
  }, [visibleChars]);

  return (
    <div
      className={cn("relative", className)}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div ref={containerRef} className="whitespace-pre-wrap break-words text-sm relative">
        {words.map((word, wordIdx) => (
          <span key={`word-${wordIdx}`} className={cn(word.className)}>
            {word.text.split("").map((char, charIdx) => {
              const absoluteCharIdx = words
                .slice(0, wordIdx)
                .reduce((total, w) => total + w.text.length, 0) + charIdx;

              return (
                <span
                  key={`char-${wordIdx}-${charIdx}`}
                  ref={
                    absoluteCharIdx === visibleChars - 1
                      ? lastCharRef
                      : null
                  }
                  style={{
                    opacity: absoluteCharIdx < visibleChars ? 1 : 0,
                    display: "inline"
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
        {/* Animated blinking cursor */}
        {visibleChars < fullText.length && (
          <span
            style={{
              position: "absolute",
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              height: "1em"
            }}
            className={cn(
              "inline-block w-[2px] bg-blue-500 animate-blink",
              cursorClassName
            )}
          ></span>
        )}
      </div>
    </div>
  );
};
