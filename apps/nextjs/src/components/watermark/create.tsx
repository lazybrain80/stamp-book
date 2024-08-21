"use client";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";
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
            setCreatedWmText("")
            setCreatedWmFile("")

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
    const hWmImgDownload = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const account = session?.user.account;
            const response = await axios.get(`http://127.0.0.1:8000/v1/filigrana/file?filename=${createdWmFile}`, {
                responseType: 'blob', // Important for handling binary data
                headers: {
                    'Auth-Provider': account?.provider,
                    'Authorization': `Bearer ${account?.access_token}`,
                    'Cache-Control': 'no-cache', // Prevent caching
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${createdWmFile}`); // Set the file name
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error response:", error.response.data);
            } else {
                console.error("Error downloading file:", error);
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
            {createdWmText
                ?<div className="flex items-center" >
                    <Button
                        variant="default"
                        className="rounded-full mt-4 mr-4"
                        onClick={hWmImgDownload}
                    >
                        <Icons.Check className="h-6 w-6 mr-2"/>
                        {createdWmFile}
                    </Button>
                    <h2 className="mt-4 text-left">
                        Watermark: {createdWmText}
                    </h2>
                </div>
            :<></>}
        </div>
    )
}