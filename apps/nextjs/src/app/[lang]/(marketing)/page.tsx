import Link from "next/link";
import { XBlogArticle } from "~/components/blog-card";
import { DocumentGuide } from "~/components/document-guide";
import ShimmerButton from "~/components/shimmer-button";
import { TypewriterEffectSmooths } from "~/components/typewriterEffectSmooth";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";
import { 
  Marketing1stShow, 
  Marketing2ndShow,
  Marketing3thShow,
  Marketing4thShow
} from "~/components/marketing";


export default async function IndexPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <>
      <section className="w-full px-8 sm:px-48 md:px-48 xl:px-48">
        <div className="grid grid-cols-1 gap-10 pb-20 xl:grid-cols-2">
          <div className="flex flex-col items-start">
            <div className="flex flex-col pt-4 md:pt-28 lg:pt-28 xl:pt-28">
              <div className="mt-6">
                <h1 className="relative mb-6 max-w-4xl text-left text-4xl font-bold dark:text-zinc-100 sm:text-7xl md:text-7xl xl:text-7xl">
                  {dict.marketing.title ||
                    "Saasfly: A new SaaS player? Make things easier."}
                </h1>
              </div>

              <div>
                <span className="text-zinc-500 sm:text-xl">
                  {dict.marketing.sub_title ||
                    "Your complete All-in-One solution for building SaaS services."}
                </span>
                <TypewriterEffectSmooths />
              </div>

              <div className="mb-4 mt-6 flex w-full flex-col justify-center space-y-4 sm:flex-row sm:justify-start sm:space-x-8 sm:space-y-0">
                <Link href={`${lang}/login`}>
                  <ShimmerButton className="mx-auto flex justify-center">
                    <span className="z-10 w-48 whitespace-pre bg-gradient-to-b from-black from-30% to-gray-300/80 bg-clip-text text-center text-sm font-semibold leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 dark:text-transparent">
                      {dict.marketing.get_started}
                    </span>
                  </ShimmerButton>
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden h-full w-full xl:block">
            <div className="flex flex-col pt-28">
              <div className="mt-4 flex w-full justify-between">
                <XBlogArticle />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-8 sm:px-48 md:px-48 xl:px-48">
        <div className="flex h-full w-full justify-between">
          <div className="flex w-[100%] flex-col pb-20">
            <Marketing1stShow />
          </div>
        </div>
      </section>

      <section className="w-full px-8 sm:px-48 md:px-48 xl:px-48">
        <div className="flex h-full w-full justify-between">
          <div className="flex w-[100%] flex-col pb-20">
            <Marketing2ndShow />
          </div>
        </div>
      </section>

      <section className="w-full px-8 sm:px-48 md:px-48 xl:px-48">
        <div className="flex h-full w-full justify-between">
          <div className="flex w-[100%] flex-col pb-20">
            <Marketing3thShow />
          </div>
        </div>
      </section>

      <section className="w-full px-8 sm:px-48 md:px-48 xl:px-48">
        <div className="flex h-full w-full justify-between">
          <div className="flex w-[100%] flex-col pb-20">
            <Marketing4thShow />
          </div>
        </div>
      </section>
    </>
  );
}
