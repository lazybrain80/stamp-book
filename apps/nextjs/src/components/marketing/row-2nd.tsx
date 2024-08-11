"use client";

import React from "react";

import { WobbleCard } from "@saasfly/ui/wobble-card";

export function Marketing2ndShow() {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3">
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-pink-800 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="absolute bottom-20 right-10 rounded-2xl object-contain max-w-sm">
          <h2 className="max-w-sm text-balance  text-right text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
          디지털 워터마크
          </h2>
          <p className="mt-4 max-w-[26rem] text-right  text-base/6 text-neutral-200">
          보이지 않는 워터마크로 사용자에게 쾌적한 환경은 물론, 외부에서 카메라로 촬영해도 콘텐츠 워터마크는 지속됩니다.
          </p>
        </div>
        <img
          src="https://ui.aceternity.com/_next/image?url=%2Flinear.webp&w=1080&q=75"
          width={500}
          height={500}
          alt="linear demo"
          className="max-w-sm"
        />
      </WobbleCard>
    </div>
  );
}
