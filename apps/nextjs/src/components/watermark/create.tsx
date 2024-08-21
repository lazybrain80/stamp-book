"use client";

import { Button } from "@saasfly/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
    DragAndDropBox,
    DragAndDropBoxDescription,
    DragAndDropBoxIcon,
    DragAndDropBoxTitle
} from "~/components/drag-n-drop-box";

interface CreateWatermarkProps {
    title: string;
    desc: string;
}

interface WmResult {
    wm: string
    filename: string
}

export default function CreateWatermark(
    {
        title,
        desc
    }: CreateWatermarkProps
) {
    const [originalImg, setOriginalImg] = useState<null | File>(null);
    const [customWmText, setCustomWmText] = useState('');

    const [createdWmFile, setCreatedWmFile] = useState("");
    const [createdWmText, setCreatedWmText] = useState("");

    const { data: session } = useSession()

    const hOriginalImgChange = (file: File) => {
        setOriginalImg(file);
    };
    const hOriginalImgSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (originalImg) {
            const formData = new FormData();
            formData.append("file", originalImg);
            formData.append("watermark", customWmText);
            const account = session?.user.account;
            try {
                const res = await axios.post('http://127.0.0.1:8000/v1/filigrana', formData, {
                    headers: {
                        'Auth-Provider': account?.provider,
                        'Authorization': `Bearer ${account?.access_token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const wmResult: WmResult = res.data
                setCreatedWmText(wmResult.wm)
                setCreatedWmFile(wmResult.filename)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.error("Error response:", error.response.data);
                } else {
                    console.error("Error uploading file:", error);
                }
            }
        }
    }
    return(
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
            <DragAndDropBox
                handleFileChange={hOriginalImgChange}
            >
                <DragAndDropBoxIcon name={"Add"}/>
                <DragAndDropBoxTitle>
                    {title}
                </DragAndDropBoxTitle>
                <DragAndDropBoxDescription>
                    {desc}
                </DragAndDropBoxDescription>
            </DragAndDropBox>
            {originalImg
                ?<Button
                    variant="secondary"
                    className="rounded-full w-11/12 mt-4"
                    onClick={hOriginalImgSubmit}
                >
                    제출
                </Button>
            :<></>}
        </div>
    )
}