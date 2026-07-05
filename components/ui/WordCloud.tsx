"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import cloud, { type CloudWord } from "d3-cloud";
import type { WordCloudWord } from "@/lib/types";

const WORD_COLORS = ["#06712f", "#2f793c", "#74b94c", "#f4b21b", "#9b6a00"];

interface LayoutWord extends CloudWord {
  text: string;
  value: number;
  size: number;
  color: string;
}

interface WordCloudProps {
  words?: WordCloudWord[];
}

export default function WordCloud({ words = [] }: WordCloudProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [layoutWords, setLayoutWords] = useState<LayoutWord[]>([]);
  const [size, setSize] = useState({ width: 320, height: 260 });

  const normalizedWords = useMemo<LayoutWord[]>(() => {
    const values = words.map((word) => word.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return words.map((word, index) => {
      const ratio = max === min ? 1 : (word.value - min) / (max - min);

      return {
        text: word.text,
        value: word.value,
        size: 14 + ratio * 30,
        color: WORD_COLORS[index % WORD_COLORS.length],
      };
    });
  }, [words]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width);
      const height = Math.floor(entry.contentRect.height);

      if (width > 0 && height > 0) {
        setSize({ width, height });
      }
    });

    resizeObserver.observe(wrapperRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!normalizedWords.length) return;

    cloud<LayoutWord>()
      .size([size.width, size.height])
      .words(normalizedWords)
      .padding(5)
      .rotate(() => 0)
      .font("Inter, system-ui, sans-serif")
      .fontWeight(() => 900)
      .fontSize((word) => word.size)
      .spiral("archimedean")
      .on("end", (computedWords) => {
        setLayoutWords(computedWords);
      })
      .start();
  }, [normalizedWords, size]);

  return (
    <div ref={wrapperRef} className="h-[260px] w-full overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size.width} ${size.height}`}
      >
        <g transform={`translate(${size.width / 2}, ${size.height / 2})`}>
          {layoutWords.map((word) => (
            <text
              key={`${word.text}-${word.x}-${word.y}`}
              textAnchor="middle"
              transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
              style={{
                fill: word.color,
                fontSize: word.size,
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 900,
                cursor: "default",
              }}
            >
              {word.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
