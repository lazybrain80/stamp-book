"use client";

import { TextGenerateEffect } from "@saasfly/ui/typewriter-effect";

export function TypewriterEffectSmooths({ lang } : {
  lang: string;
}) {
  let words = [];
  if (lang === "ko") {
    words = [
      {
        text: "SecureStamp",
        className: "text-blue-500",
      },
      {
        text: " 와",
      },
      {
        text: " 함께",
      },
      {
        text: " 아주",
      },
      {
        text: " 쉽게",
      },
      {
        text: " 워터마크를",
      },
      {
        text: " 관리해보세요.",
      },
    ];
  } else {
    words = [
      {
        text: "SecureStamp",
        className: "text-blue-500",
      },
      {
        text: " makes",
      },
      {
        text: " watermark",
      },
      {
        text: " management",
      },
      {
        text: " a",
      },
      {
        text: " breeze.",
      },
    ];
  }
  
  return (
    <span className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
      <TextGenerateEffect words={words} />
    </span>
  );
}
