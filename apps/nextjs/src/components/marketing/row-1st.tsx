"use client";

import React from "react";

import { WobbleCard } from "@saasfly/ui/wobble-card";

export default function MarketingShow() {
  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-lg">
          <h2 className="max-w-lg text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
            보이지 않는 워터마크란 무엇인가요?
          </h2>
          <p className="mt-4 max-w-3xl text-left text-lg text-base/6 text-neutral-200">
            이미지나 비디오 등의 콘텐츠에 삽입되어, 눈에 보이지 않지만 특정 정보를 숨겨주는 기법입니다. 일반적으로 정보 삽입, 저작권 보호, 추적 기능과같은 기능을 수행합니다.
          </p>
        </div>
        <img
          src="/images/marketing/cat_invisible_wm.png"
          width={600}
          alt="linear demo"
          className="absolute bottom-0 right-10 rounded-2xl object-contain"
        />
      </WobbleCard>
    </div>
  );
}
