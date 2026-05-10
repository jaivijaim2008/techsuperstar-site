"use client";
import { useEffect, useRef } from "react";

interface Props {
  adKey: string;
  width: number;
  height: number;
}

export default function AdsterraAd({ adKey, width, height }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (!ref.current || injected.current) return;
    injected.current = true;

    const container = ref.current;

    const s1 = document.createElement("script");
    s1.type = "text/javascript";
    s1.innerHTML = `
      var atOptions = {
        'key': '${adKey}',
        'format': 'iframe',
        'height': ${height},
        'width': ${width},
        'params': {}
      };
    `;
    container.appendChild(s1);

    const s2 = document.createElement("script");
    s2.type = "text/javascript";
    s2.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    s2.async = true;
    container.appendChild(s2);
  }, [adKey, width, height]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        minHeight: `${height}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px 0",
        overflow: "hidden",
      }}
    />
  );
}