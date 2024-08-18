import * as React from "react";

import { cn } from "@saasfly/ui";
import * as Icons from "@saasfly/ui/icons";

type DragAndDropBoxProps = React.HTMLAttributes<HTMLDivElement>;

export function DragAndDropBox({
  className,
  children,
  ...props
}: DragAndDropBoxProps) {
  return (
    <div
      className={cn(
        "flex bg-gray-600 w-11/12 min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50 hover:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md",
        className,
      )}
      {...props}
    >
      <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center space-y-2">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          {children}
        </div>
      </label>
      <input type="file" id="fileInput" className="hidden" multiple />
    </div>
  );
}

interface DragAndDropBoxIconProps
  extends Partial<React.SVGProps<SVGSVGElement>> {
  name: keyof typeof Icons;
}

DragAndDropBox.Icon = function DragAndDropBoxIcon({
  name,
  className, // ...props
}: DragAndDropBoxIconProps) {
  const Icon = Icons[name];

  if (!Icon) {
    return null;
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
      <Icon className={cn("h-10 w-10", className)} />
    </div>
  );
};

type DragAndDropBoxTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

DragAndDropBox.Title = function DragAndDropBoxTitle({
  className,
  ...props
}: DragAndDropBoxTitleProps) {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h2 className={cn("mt-6 text-xl font-semibold", className)} {...props} />
  );
};

type DragAndDropBoxDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

DragAndDropBox.Description = function DragAndDropBoxDescription({
  className,
  ...props
}: DragAndDropBoxDescriptionProps) {
  return (
    <p
      className={cn(
        "mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};
