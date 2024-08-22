"use client";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { set } from "zod";
import {
    DragAndDropBox,
    DragAndDropBoxDescription,
    DragAndDropBoxIcon,
    DragAndDropBoxTitle
} from "~/components/drag-n-drop-box";

interface ValidateWatermarkProps {
    title: string;
    desc: string;
}

interface ValidResult {
    result: boolean
    watermark: string
}

export default function ValidateWatermark(
    {
        title,
        desc
    }: ValidateWatermarkProps
) {
    const [wmImg, setWmImg] = useState<null | File>(null);
    const [validWmText, setValidWmText] = useState('');
    const [isValidate, setIsValidate] = useState(false);
    const [oriWatermark, setOriWatermark] = useState('');
    const [reqValid, setReqValid] = useState(false);

    const { data: session } = useSession()

    const hWmImgChange = (file: File) => {
        setWmImg(file);
    };
    const hWmImgSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (wmImg) {
            setReqValid(false)
            setIsValidate(false)
            setOriWatermark("")

            const formData = new FormData();
            formData.append("file", wmImg);
            formData.append("watermark", validWmText);
            const account = session?.user.account;
            try {
                const res = await axios.post('http://127.0.0.1:8000/v1/filigrana/corda', formData, {
                    headers: {
                        'Auth-Provider': account?.provider,
                        'Authorization': `Bearer ${account?.access_token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const validResult: ValidResult = res.data
                setReqValid(true)
                setIsValidate(validResult.result)
                setOriWatermark(validResult.watermark)
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
                handleFileChange={hWmImgChange}
            >
                <DragAndDropBoxIcon name={"Add"}/>
                <DragAndDropBoxTitle>
                    {title}
                </DragAndDropBoxTitle>
                <DragAndDropBoxDescription>
                    {desc}
                </DragAndDropBoxDescription>
            </DragAndDropBox>
            {wmImg
                ?<Button
                    variant="secondary"
                    className="rounded-full w-11/12 mt-4"
                    onClick={hWmImgSubmit}
                >
                    제출
                </Button>
            :<></>}
            {reqValid
                ?(<div className="mt-4">
                    {isValidate
                        ?(<div className="flex items-center space-x-2">
                            <Icons.Sun className="w-6 h-6 text-green-500"/>
                            <span>유효한 워터마크입니다.</span>
                        </div>)
                        :(<div className="flex items-center space-x-2">
                            <Icons.Moon className="w-6 h-6 text-red-500"/>
                            <span>유효하지 않은 워터마크입니다.</span>
                        </div>)
                    }
                    <div className="mt-2">
                        <span>원본 워터마크: {oriWatermark}</span>
                    </div>
                </div>)
                :<></>
            }
        </div>
    )
}