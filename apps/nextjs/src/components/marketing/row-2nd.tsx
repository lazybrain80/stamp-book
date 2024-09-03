"use client";

import React from "react";

import { WobbleCard } from "@saasfly/ui/wobble-card";

export default function MarketingShow() {
  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-pink-800 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="absolute bottom-40 right-10 rounded-2xl object-contain max-w-lg">
          <h2 className="max-w-lg text-balance  text-right text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
          디지털 워터마크를 사용해야 하는 이유
          </h2>
          <p className="mt-4 max-w-3xl text-right  text-base/6 text-neutral-200">
            워터마크는 저작권 보호와 자료의 무단 사용 방지를 위해 중요하며, <br />작품을 공개해도 도용 위험을 줄여줍니다.
          </p>
        </div>
        <img
          src="https://ui.aceternity.com/_next/image?url=%2Flinear.webp&w=1080&q=75"
          width={1280}
          height={500}
          alt="linear demo"
          className="max-w-sm scale-150"
        />
      </WobbleCard>
    </div>
  );
}
