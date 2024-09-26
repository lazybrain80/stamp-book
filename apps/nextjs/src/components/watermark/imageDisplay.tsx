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

interface ImageDisplayProps {
    imageUrl: string
}

export default function ImageDisplay({
    imageUrl,
}: ImageDisplayProps) {

    const toDataURL = (url: string) => {
        return fetch(url)
        .then((response) => {
            return response.blob()
        })
        .then((blob) => {
            return URL.createObjectURL(blob)
        })
    }

    const hImageDownload = async (imageUrl: string) => {
        const link = document.createElement('a')
        link.href = await toDataURL(imageUrl)
        link.setAttribute('download', "watermarked_image.png")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Icons.Image />
                </Button>
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
                        onClick={() => hImageDownload(imageUrl)}
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