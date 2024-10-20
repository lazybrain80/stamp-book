"use client"

import {
    Dialog,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@saasfly/ui/dialog"
import { Button } from "@saasfly/ui/button"
import * as Icons from "@saasfly/ui/icons"
import { ImageDownload } from "./common";

interface ImageDisplayProps {
    imageUrl: string
    previewUrl: string
}

export default function ImageDisplay({
    imageUrl,
    previewUrl
}: ImageDisplayProps) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative inline-block cursor-pointer">
                    <Button>
                        <Icons.Image />
                    </Button>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="absolute top-0 left-0 w-16 h-10 object-cover rounded-full border-2 border-white shadow-lg"
                    />
                </div>
            </DialogTrigger>
            <DialogContent
                className="w-full max-w-4xl max-h-screen p-4"
            >
                <DialogHeader>
                    <DialogClose />
                </DialogHeader>
                <DialogTitle>
                    Image Preview
                </DialogTitle>
                <DialogDescription>
                    Image preview of the selected image
                </DialogDescription>
                <img src={imageUrl} className="max-w-md mx-auto"/>
                <DialogFooter
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => ImageDownload(imageUrl)}
                    >
                        <Icons.DownloadCloud
                            className="mr-2"
                        />
                        Download watermark image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}