"use client";
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function LottiePlayer({ json }: { json: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: json
    });
    return () => {
      anim.destroy();
    };
  }, [json]);
  return <div ref={containerRef} style={{ width: "100%", aspectRatio: "1 / 1" }} />;
}

