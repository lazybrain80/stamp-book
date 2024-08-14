"use client";

import React from "react";

import { WobbleCard } from "@saasfly/ui/wobble-card";

export default function MarketingShow() {
  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-cyan-500 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm text-balance  text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
          맞춤형 워터마크 만들기
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          브랜드를 인식하게 만드세요. 사진, 아트워크, 프로모션 자료에 사용할 맞춤형 워터마크를 만들어 사람들로 하여금 지금 보고 있는 브랜드가 무엇인지 알게 하세요. 로고, 이름, 마스코트, 서명 등 브랜드를 확인할 수 있는 표식을 사용해 보세요. Canva(캔바)의 광범위한 글꼴 라이브러리에서 선택하여 글꼴을 맞춤화하세요. 그런 다음, 워터마크를 다운로드하여 모든 사진에 사용하세요.
          </p>
        </div>
        <img
          src="https://ui.aceternity.com/_next/image?url=%2Flinear.webp&w=1080&q=75"
          width={500}
          height={500}
          alt="linear demo"
          className="absolute -bottom-10 -right-10 rounded-2xl object-contain md:-right-[40%] lg:-right-[20%]"
        />
      </WobbleCard>
    </div>
  );
}
