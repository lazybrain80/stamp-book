"use client"

import { Button } from "@saasfly/ui/button"
import { Input } from "@saasfly/ui/input"
import { toast } from "@saasfly/ui/use-toast"
import * as Icons from "@saasfly/ui/icons"
import axios from "axios"
import { useSession, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import {
    DragAndDropBox,
    DragAndDropBoxDescription,
    DragAndDropBoxIcon,
    DragAndDropBoxTitle
} from "~/components/drag-n-drop-box"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@saasfly/ui/tabs"
import { wmAPI } from "~/utils/watermark-api"
import StampSelector from "./stampSelector"
import { WM_IMAGE, WM_TEXT } from "./common"
import ImageDisplay from "./imageDisplay"

interface ValidateWatermarkProps {
    lang: string
    select_stamp: string
    dragndrop_title: string
    dragndrop_desc: string
    dragndrop_warn: string
    submit: string
    correct_wm: string
    incorrect_wm: string
}

interface ValidTextResult {
    extracted_watermark: string
}

export default function ValidateWatermark(
    {
        lang,
        select_stamp,
        dragndrop_title,
        dragndrop_desc,
        dragndrop_warn,
        submit,
        correct_wm,
        incorrect_wm
    }: ValidateWatermarkProps
) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [watermarkType, setWatermarkType] = useState<typeof WM_TEXT | typeof WM_IMAGE>(WM_TEXT)

    const [wmImg, setWmImg] = useState<null | File>(null)
    const [validWmImg, setValidWmImg] = useState<null | string>(null)

    const [isValidate, setIsValidate] = useState(false)
    const [extractedWatermark, setExtractedWatermark] = useState<string>('')
    const [showTextValid, setShowTextValid] = useState(false)
    const [showImageValid, setShowImageValid] = useState(false)
    const [stampId, setStampId] = useState<string>('')
    const [stampUrl, setStampUrl] = useState<string>('')

    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
        } else if (status === 'unauthenticated') {
            signIn();
        } else if (status === 'authenticated') {
            pagInitialize();
        }
    }, [status])

    const pagInitialize = async () => {
        setIsLoading(false);
    }

    const hWmImgChange = async (file: File) => {
        setWmImg(file)
        return true
    }
    const hWmImgSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (wmImg) {
            setIsLoading(true)
            setShowTextValid(false)
            setShowImageValid(false)
            setIsValidate(false)
            setExtractedWatermark('')

            if (wmImg === null) {
                toast({
                    title: "error",
                    description: "Please select a watermark image.",
                })
                setIsLoading(false)
                return
            }

            let url = '/v1/filigrana/corda'
            const formData = new FormData()
            formData.append("file", wmImg)

            const account = session?.user.account
            const headers = {
                'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
                'Content-Type': 'multipart/form-data',
            }

            try {
                if (watermarkType === WM_TEXT) {

                    if (stampId === '') {
                        toast({
                            title: "error",
                            description: "Please select your watermark stamp.",
                        })
                        setIsLoading(false)
                        return
                    }

                    formData.append("version", "text-basic-001")
                    formData.append("watermark", stampId)

                    const res = await wmAPI.post(url + '/testo', formData, {
                        headers,
                    })
                    const validResult: ValidTextResult = (res as { data: ValidTextResult }).data
                    setShowTextValid(true)
                    setExtractedWatermark(validResult.extracted_watermark)

                } else {
                    formData.append("version", "image-basic-000")
                    formData.append("watermark", stampId)
                    const response = await wmAPI.post(url + '/immagine', formData, {
                        headers,
                        responseType: 'blob',
                    })
                    
                    const blob = (response as { data: Blob }).data
                    const imageUrl = URL.createObjectURL(blob);

                    setShowImageValid(true)
                    setValidWmImg(imageUrl)
                }
                
            } catch (error: any) {
                let error_message: string = ""
                if (axios.isAxiosError(error) && error.response) {
                    const { detail } = error.response.data
                    error_message = detail
                } else {
                    console.error("Error uploading file:", error)
                    error_message = error.message as string
                }

                toast({
                    title: "error",
                    description: error_message,
                })
            }
        }
        setIsLoading(false)
    }
    
    const hTabChange = (value: string) => {
        setWatermarkType(value as typeof WM_TEXT | typeof WM_IMAGE)
        setStampId('')
        setStampUrl('')
    }
    const stampSelect = (stampid: string, url: string) => {
        setStampId(stampid)
        setStampUrl(url)
    }
    return(
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
            <DragAndDropBox
                dropboxId="vaildImg"
                handleFileChange={hWmImgChange}
                className="w-full"
            >
                <DragAndDropBoxIcon name={"Add"}/>
                <DragAndDropBoxTitle>
                    {dragndrop_title}
                </DragAndDropBoxTitle>
                <DragAndDropBoxDescription>
                    {dragndrop_desc}
                </DragAndDropBoxDescription>
            </DragAndDropBox>
            <p className="underline hover:decoration-1 ...">{dragndrop_warn}</p>
            {wmImg
                ?(<div className="flex flex-col w-full pt-4">
                    <Tabs
                        className="w-full"
                        defaultValue={WM_TEXT}
                        onValueChange={hTabChange}
                    >
                        <TabsList className="w-full">
                            <TabsTrigger value={WM_TEXT}>Text Watermark</TabsTrigger>
                            <TabsTrigger value={WM_IMAGE}>Image Watermark</TabsTrigger>
                        </TabsList>
                        <TabsContent value={WM_TEXT}>
                            {stampId == ""
                                ?(<></>)
                                :(
                                    <div className="flex flex-row items-center w-11/12 space-x-4 mt-5">
                                        <span className="text-sm text-white-500">
                                            Selected Stamp:
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {stampId}
                                        </span>
                                    </div>
                                )
                            }
                            <StampSelector
                                lang={lang}
                                btn_text={select_stamp}
                                type="text"
                                onSelect={stampSelect}
                            />
                            <Button
                                variant="secondary"
                                className="rounded-full w-full mt-4"
                                onClick={hWmImgSubmit}
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {submit}
                            </Button>
                        </TabsContent>
                        <TabsContent value={WM_IMAGE}>
                            {stampId == ""
                                ?<StampSelector
                                    lang={lang}
                                    btn_text={select_stamp}
                                    type="image"
                                    onSelect={stampSelect}
                                    />
                                :(
                                    <div className="flex flex-row items-center w-11/12 space-x-4 mt-5">
                                        <span className="text-sm text-white-500">
                                            Selected Stamp:
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {stampId}
                                        </span>
                                        <img src={stampUrl} className="w-8 h-8 object-cover"/>
                                    </div>
                                )
                            }
                            <Button
                                variant="secondary"
                                className="rounded-full w-full mt-4"
                                onClick={hWmImgSubmit}
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {submit}
                            </Button>
                        </TabsContent>
                    </Tabs>
                    
                </div>)
            :<></>}
            {showTextValid && (watermarkType === WM_TEXT)
                ?(<div className="mt-4">
                    <span>Extracted : {extractedWatermark}</span>
                </div>)
                :<></>
            }
            {showImageValid && (watermarkType === WM_IMAGE)
                ?(<div className="mt-4">
                    {validWmImg &&(
                        <div className="flex items-center space-x-2">
                            <p>추출이 완료 되었습니다.</p>
                            <ImageDisplay
                                imageUrl={validWmImg}
                                previewUrl={validWmImg}
                            />
                        </div>
                    )}
                </div>)
                :<></>
            }
        </div>
    )
}