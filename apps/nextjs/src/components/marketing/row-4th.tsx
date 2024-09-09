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
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-fuchsia-600 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="absolute right-10 max-w-4xl z-10">
          <h2 className="max-w-4xl text-balance text-right text-base font-semibold tracking-[-0.015em] text-white md:max-w-4xl md:text-xl lg:text-3xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-right text-lg text-base/6 text-neutral-200"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <img
          src="/images/marketing/deginer_back_logo.png"
          alt="linear demo"
          className="absolute max-w-sm top-0 left-0 z-0 transform scale-100 sm:scale-90 md:scale-75 lg:scale-100"
        />
      </WobbleCard>
    </div>
  );
}
