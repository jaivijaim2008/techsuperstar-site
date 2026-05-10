"use client";
import { useEffect, useRef } from "react";

interface Props {
  adKey?: string;
  width?: number;
  height?: number;
  nativeSrc?: string;
  nativeId?: string;
}

export default function AdsterraAd({ adKey, width, height, nativeSrc, nativeId }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (!ref.current || injected.current) return;
    injected.current = true;
    const container = ref.current;

    if (nativeSrc && nativeId) {
      const s = document.createElement("script");
      s.async = true;
      s.setAttribute("data-cfasync", "false");
      s.src = nativeSrc;
      document.head.appendChild(s);
      const d = document.createElement("div");
      d.id = nativeId;
      container.appendChild(d);
    } else if (adKey && width && height) {
      const s1 = document.createElement("script");
      s1.innerHTML = `var atOptions={'key':'${adKey}','format':'iframe','height':${height},'width':${width},'params':{}};`;
      container.appendChild(s1);
      const s2 = document.createElement("script");
      s2.async = true;
      s2.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
      container.appendChild(s2);
    }
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", display: "flex", justifyContent: "center", margin: "16px 0" }} />
  );
}