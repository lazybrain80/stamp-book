"use client"

import { Button } from "@saasfly/ui/button"
import { Switch } from "@saasfly/ui/switch"
import { Input } from "@saasfly/ui/input"
import { toast } from "@saasfly/ui/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@saasfly/ui/tabs"
import * as Icons from "@saasfly/ui/icons"
import axios, { AxiosResponse } from "axios"
import { useSession, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import {
    DragAndDropBox,
    DragAndDropBoxDescription,
    DragAndDropBoxIcon,
    DragAndDropBoxTitle
} from "~/components/drag-n-drop-box"
import { wmAPI } from "~/utils/watermark-api"
import { ImageDownload, WM_IMAGE, WM_TEXT } from "./common"

interface CreateWatermarkProps {
    dragndrop_title: string
    dragndrop_desc: string
    dragndrop_warn: string
    input_wm_warning: string
    submit: string
}

interface WmResult {
    watermark_text: string
    image_url: string
}

interface ImageDimensions {
    width: number
    height: number
}


export default function CreateWatermark(
    {
        dragndrop_title,
        dragndrop_desc,
        dragndrop_warn,
        input_wm_warning,
        submit
    }: CreateWatermarkProps
) {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [watermarkType, setWatermarkType] = useState<typeof WM_TEXT | typeof WM_IMAGE>(WM_TEXT)
    const [originalImg, setOriginalImg] = useState<File | null>(null)
    const [imageDimensions, setImageDimensions] = useState<ImageDimensions | {width: 0, height:0}>({width: 0, height:0});
    const [wmImageLimit, setWmImageLimit] = useState<ImageDimensions | {width: 0, height:0}>({width: 0, height:0});
    const [watermarkImg, setWatermarkImg] = useState<File | null>(null)
    const [customWmText, setCustomWmText] = useState('')

    const [createdWmFile, setCreatedWmFile] = useState("")
    const [createdWmText, setCreatedWmText] = useState("")

    const [isCustomWm, setIsCustomWm] = useState(false)

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
    const isImageFile = (file: File) => {
        return file.type.startsWith('image/');
    }

    const getImageDimensions = (file: File): Promise<{ width: number, height: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            }
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        })
    }

    const hOriginalImgChange = async (file: File) => {
        
        if (isImageFile(file)) {
            const dimensions = await getImageDimensions(file)
            if (dimensions.width < 128 || dimensions.height < 128) {
                alert('Please select an image file with dimensions more than 128 x 128.');
                return false
            }
            setOriginalImg(file)
            setWmImageLimit({
                width: Math.floor(dimensions.width / 8),
                height: Math.floor(dimensions.height / 8)
            })
            setImageDimensions(dimensions)
        } else {
            alert('Please select a valid image file.');
        }
        return true
    }
    const hWatermarkImgChange = async (file: File) => {
        
        if (isImageFile(file)) {
            const dimensions = await getImageDimensions(file)
            if (dimensions.width > wmImageLimit.width || dimensions.height > wmImageLimit.height) {
                alert('Please select an smaller watermark image.');
                return false
            }
            setWatermarkImg(file)
        } else {
            alert('Please select a valid image file.');
        }
        return true
    }
    const hWatermarkingSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (originalImg) {
            setIsLoading(true)
            setCreatedWmText("")
            setCreatedWmFile("")

            let url = '/v1/filigrana'
            const formData = new FormData()
            formData.append("file", originalImg)

            if(watermarkType === WM_IMAGE) {
                if (watermarkImg === null) {
                    alert('Please select a watermark image.')
                    setIsLoading(false)
                    return
                }

                url += '/immagine'
                formData.append("version", "image-basic-000")
                formData.append("watermark", watermarkImg)
            } else {
                url += '/testo'
                formData.append("version", "text-basic-000")
                formData.append("watermark", customWmText)
            }
                
            const account = session?.user.account
            try {
                const res = await wmAPI.post(url, formData, {
                    headers: {
                        'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })

                const wmResult: WmResult = (res as { data: WmResult }).data

                setCreatedWmText(wmResult.watermark_text)
                setCreatedWmFile(wmResult.image_url)

                toast({
                    title: "success",
                    description: "watermark created",
                })

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
    const hWmImgDownload = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const link = document.createElement('a')
            link.href = createdWmFile
            link.setAttribute('download', "watermarked_image.png")
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error response:", error.response.data)
            } else {
                console.error("Error downloading file:", error)
            }
        }
        setIsLoading(false)
    }
    const hInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]*$/ // 허용할 문자들
        if (regex.test(value) || value === '') {
            setCustomWmText(value)
        }
    }

    const hTabChange = (value: string) => {
        setWatermarkType(value as typeof WM_TEXT | typeof WM_IMAGE)
    }
    return(
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
            <DragAndDropBox
                dropboxId="originalImg"
                handleFileChange={hOriginalImgChange}
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
            {originalImg
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
                        <TabsContent value="wm_text">
                            <div className="flex flex-row items-center w-11/12 space-x-4 mt-5">
                                <Switch
                                    checked={isCustomWm}
                                    onCheckedChange={setIsCustomWm}
                                    role="switch"
                                    aria-label="is-custom-wm"
                                />
                                <Input
                                    className="w-6/12"
                                    disabled={!isCustomWm}
                                    placeholder="Custom text"
                                    maxLength={20}
                                    value={customWmText}
                                    onChange={hInputChange}
                                />
                                <span>{customWmText.length}/20</span>
                            </div>
                            <div className="flex flex-row items-center w-11/12 space-x-4 mt-5">
                                <span className="text-sm text-gray-500 ml-14">
                                    {input_wm_warning}
                                </span>
                            </div>
                            <Button
                                variant="secondary"
                                className="rounded-full w-full mt-4"
                                onClick={hWatermarkingSubmit}
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {submit}
                            </Button>
                        </TabsContent>
                        <TabsContent value="wm_image">
                            <div className="container mx-auto p-4 flex flex-col items-center justify-center">
                                <div className="w-full flex flex-row ">
                                    {/* <Button className="w-1/4">
                                        <Icons.Settings className="h-6 w-6 mr-2"/>
                                        이미지 워터마크 불러오기
                                    </Button> */}
                                    <div className="w-full flex items-center justify-center">
                                        <DragAndDropBox
                                            dropboxId="watermarkImg"
                                            handleFileChange={hWatermarkImgChange}
                                            className="w-3/4"
                                        >
                                            <DragAndDropBoxIcon name={"Add"}/>
                                            <DragAndDropBoxTitle>
                                                {dragndrop_title}
                                            </DragAndDropBoxTitle>
                                            <DragAndDropBoxDescription>
                                                {dragndrop_desc}
                                            </DragAndDropBoxDescription>
                                        </DragAndDropBox>
                                    </div>
                                </div>
                                <p className="underline hover:decoration-1 ...">{dragndrop_warn}</p>
                                <p className="underline decoration-pink-500">주의: 삽입할 이미지 워터마크는 {wmImageLimit.width} X {wmImageLimit.height} 이하 만 가능합니다.</p>
                            </div>
                            <Button
                                variant="secondary"
                                className="rounded-full w-full mt-4"
                                onClick={hWatermarkingSubmit}
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
            {createdWmFile
                ?<div className="flex items-center" >
                    {watermarkType === WM_TEXT
                        ?<h2 className="flex-initial mt-4 text-left  mr-4">
                            Watermark: {createdWmText}
                        </h2>
                        :<h2 className="flex-initial mt-4 text-left  mr-4">
                            Image Watermark
                        </h2>
                    }
                    <Button
                        variant="default"
                        className="flex-auto rounded-full mt-4"
                        onClick={() => ImageDownload(createdWmFile)}
                        disabled={isLoading}
                    >
                        {isLoading
                            ?(<Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />)
                            :<Icons.DownloadCloud className="h-6 w-6 mr-2"/>
                        }
                        Download watermark image
                    </Button>
                </div>
            :<></>}
        </div>
    )
}