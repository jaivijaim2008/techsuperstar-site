"use client";
import { useEffect, useRef } from "react";

interface Props {
  adKey: string;
  width: number;
  height: number;
}

export default function AdsterraAd({ adKey, width, height }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.childNodes.length > 0) return;
    const s1 = document.createElement("script");
    s1.text = `atOptions={'key':'${adKey}','format':'iframe','height':${height},'width':${width},'params':{}};`;
    const s2 = document.createElement("script");
    s2.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    ref.current.appendChild(s1);
    ref.current.appendChild(s2);
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", display: "flex", justifyContent: "center", margin: "20px 0" }} />
  );
}