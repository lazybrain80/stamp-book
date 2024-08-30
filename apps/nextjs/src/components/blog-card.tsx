import { FollowerPointerCard } from "@saasfly/ui/following-pointer";

export function XBlogArticle() {
  return (
    <div className="w-full">
      <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
        <div className="aspect-w-16 aspect-h-10 xl:aspect-w-16 xl:aspect-h-10 relative w-full overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-100">
          <img
            src="/images/marketing/landing_blog_image.png"
            alt="thumbnail"
            className={`transform object-cover transition duration-200 group-hover:scale-95 group-hover:rounded-2xl `}
          />
        </div>
      </div>
    </div>
  );
}
