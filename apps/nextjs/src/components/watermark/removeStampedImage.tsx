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
import { toast } from "@saasfly/ui/use-toast"

interface RemoveStampedImageProps {
    imageType: string
    imageId: string
    reload: (removed_id: string) => void
}

export default function RemoveStampedImage({
    imageType,
    imageId,
    reload,
}: RemoveStampedImageProps) {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }
    const closeDialog = () => {
        setIsOpen(false)
    }

    const requestRemoveImage = async () => {
        try {
            const account = session?.user.account
            await wmAPI.delete("/filigrana",
            {
                params: {
                    image_type: imageType,
                    image_id: imageId,
                },
                headers: {
                    'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
                }
            })
            toast({
                title: "info",
                description: `Image(${imageId}) removed successfully.`,
            })
            await reload(imageId)
            closeDialog()

        } catch (error) {
            toast({
                title: "error",
                description: `${error}`,
            })
        }
        
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <div className="relative inline-block cursor-pointer">
                    <Button
                        onClick={openDialog}
                    >
                        <Icons.TrashCan />
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent
                className="w-full max-w-4xl max-h-screen p-4"
            >
                <DialogHeader>
                    <DialogClose />
                </DialogHeader>
                <DialogTitle>
                    Really want to remove this image?
                </DialogTitle>
                <DialogFooter
                    className="w-full"
                >
                    <Button
                        className="w-full bg-red-600"
                        onClick={() => requestRemoveImage()}
                    >
                        <Icons.ImageMinus
                            className="mr-2 text-white"
                        />
                        <span className="text-white">
                            Yes, I want to remove this image.
                        </span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}