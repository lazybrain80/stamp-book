"use client";

import React from "react";

import { WobbleCard } from "@saasfly/ui/wobble-card";

export default function MarketingShow({ title, description }
  :{
    title: string,
    description: string
}) {
  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="absolute max-w-lg z-10">
          <h2 className="max-w-lg text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-left text-lg text-base/6 text-neutral-200"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <img
          src="/images/marketing/cat_invisible_wm.png"
          width={600}
          alt="linear demo"
          className="absolute bottom-0 right-10 z-0 transform scale-100 z-0 sm:scale-90 md:scale-75 lg:scale-100"
        />
      </WobbleCard>
    </div>
  );
}
