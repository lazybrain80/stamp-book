"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
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
import { wmAPI } from "~/utils/watermark-api"
import { ImageDownload } from "./common"

interface StampImagePopUpProps {
    imageId: string
    previewUrl: string
}

interface DownloadUrlResponse {
    url: string
}

export default function StampImagePopUp({
    imageId,
    previewUrl
}: StampImagePopUpProps) {
    const { data: session } = useSession()
    const [imageDownloadUrl, setImageDownloadUrl] = useState<string>("")

    const createDownloadUrl = async () => {
        const account = session?.user.account
        const res = await wmAPI.get("/v1/filigrana/corda/scaricare_url",
        {
            params: {
                image_id: imageId,
            },
            headers: {
                'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
            }
        })
        const data = (res as { data: DownloadUrlResponse }).data
        setImageDownloadUrl(data.url)
    }

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
                {imageDownloadUrl
                ?(
                    <img src={imageDownloadUrl} className="max-w-md mx-auto"/>
                )
                :(<></>)}
                <DialogFooter
                    className="w-full"
                >
                    {imageDownloadUrl
                    ?(
                        <Button
                        className="w-full"
                        onClick={() => ImageDownload(imageDownloadUrl)}
                        >
                            <Icons.DownloadCloud
                                className="mr-2"
                            />
                            Download watermark image
                        </Button>
                    )
                    :(
                        <Button
                        className="w-full"
                        onClick={() => createDownloadUrl()}
                        >
                            <Icons.DownloadCloud
                                className="mr-2"
                            />
                            Create download link
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}