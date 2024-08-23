"use client"

import { cn } from "@saasfly/ui"
import * as Icons from "@saasfly/ui/icons"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"

type DragAndDropBoxProps = React.HTMLAttributes<HTMLDivElement> & {
  handleFileChange?: (file: File) => void
}

export function DragAndDropBox({
  className,
  children,
  handleFileChange,
  ...props
}: DragAndDropBoxProps) {
  const dropContainer = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [image, setImage] = useState<null | File | undefined>(null)

  useEffect(() => {
    function handleDragOver(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      setDragging(true)
    }
    function handleDragLeave(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      setDragging(false)
    }
    if (dropContainer.current) {
      dropContainer.current.addEventListener("dragover", handleDragOver)
      dropContainer.current.addEventListener("drop", handleDrop)
      dropContainer.current.addEventListener("dragleave", handleDragLeave)
    }
  
    return () => {
      if (dropContainer.current) {
        dropContainer.current.removeEventListener("dragover", handleDragOver)
        dropContainer.current.removeEventListener("drop", handleDrop)
        dropContainer.current.removeEventListener("dragleave", handleDragLeave)
      }
    }
  }, [])

  const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const files = e.dataTransfer?.files ? [...e.dataTransfer.files] : []
      if (files && files[0] && handleFileChange) {
        const file = files[0]
        setImage(file)
        handleFileChange(file)
      }
      setDragging(false)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && handleFileChange) {
      const file = e.target.files[0]
      setImage(file)
      handleFileChange(file)
    }
  }

  return (
    <div
      className={cn(
        `${
          dragging
            ? "border border-[#2B92EC] bg-[#EDF2FF]"
            : "border-dashed border-[#e0e0e0]"
        } flex bg-gray-600 w-11/12 min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50 hover:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md`,
        className,
      )}
      ref={dropContainer}
      {...props}
    >
      <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center space-y-2">
        {image?
          <Image
            className="preview-image"
              src={URL.createObjectURL(image)}
              alt="Uploaded Preview"
              layout="responsive"
              width={256}
              height={128} />
          :<div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            {children}
          </div>
      }
      </label>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        multiple
        accept="image/png, image/jpeg, image/jpg"
        onChange={onFileChange}
        />
    </div>
  )
}

interface DragAndDropBoxIconProps
  extends Partial<React.SVGProps<SVGSVGElement>> {
  name: keyof typeof Icons
}

export function DragAndDropBoxIcon({
  name,
  className, // ...props
}: DragAndDropBoxIconProps) {
  const Icon = Icons[name]

  if (!Icon) {
    return null
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
      <Icon className={cn("h-10 w-10", className)} />
    </div>
  )
}

type DragAndDropBoxTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export function DragAndDropBoxTitle({
  className,
  ...props
}: DragAndDropBoxTitleProps) {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h2 className={cn("mt-6 text-xl font-semibold", className)} {...props} />
  )
}

type DragAndDropBoxDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>

export function DragAndDropBoxDescription({
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
  )
}
