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

interface CreateWatermarkProps {
    dragndrop_title: string
    dragndrop_desc: string
    dragndrop_warn: string
    input_wm_warning: string
    submit: string
}

interface WmResult {
    wm: string
    filename: string
}

const WM_TEXT = "wm_text"
const WM_IMAGE = "wm_image"

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
    const [originalImg, setOriginalImg] = useState<null | File>(null)
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

    const hOriginalImgChange = (file: File) => {
        setOriginalImg(file)
    }
    const hOriginalImgSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (originalImg) {
            setIsLoading(true)
            setCreatedWmText("")
            setCreatedWmFile("")

            let url = '/v1/filigrana'
            if(watermarkType === WM_IMAGE) {
                url += '/immagine'
            } else {
                url += '/testo'
            }
            const formData = new FormData()
            formData.append("type", watermarkType)
            formData.append("file", originalImg)
            formData.append("watermark", customWmText)
            const account = session?.user.account
            try {
                const res = await wmAPI.post(url, formData, {
                    headers: {
                        'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                const wmResult: WmResult = (res as { data: WmResult }).data
                setCreatedWmText(wmResult.wm)
                setCreatedWmFile(wmResult.filename)

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
            const account = session?.user.account
            const response = await wmAPI.get(`/v1/filigrana/file?filename=${createdWmFile}`, {
                responseType: 'blob', // Important for handling binary data
                headers: {
                    'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
                    'Cache-Control': 'no-cache', // Prevent caching
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            })
            const url = window.URL.createObjectURL(new Blob([(response as AxiosResponse<Blob>).data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${createdWmFile}`) // Set the file name
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

    const hTabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWatermarkType(e.target.value as typeof WM_TEXT | typeof WM_IMAGE)
    }
    return(
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
            <DragAndDropBox
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
                        onChange={hTabChange}
                    >
                        <TabsList className="w-full">
                            <TabsTrigger value={WM_TEXT}>Text Watermark</TabsTrigger>
                            <TabsTrigger value={WM_IMAGE} disabled>Image Watermark</TabsTrigger>
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
                                onClick={hOriginalImgSubmit}
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {submit}
                            </Button>
                        </TabsContent>
                        <TabsContent value="wm_image">
                            <div className="flex flex-row items-center w-11/12 space-x-4 mt-5">
                                <span className="text-sm text-gray-500">
                                    image watermark
                                </span>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>)
            :<></>}
            {createdWmText
                ?<div className="flex items-center" >
                    <h2 className="flex-initial mt-4 text-left  mr-4">
                        Watermark: {createdWmText}
                    </h2>
                    <Button
                        variant="default"
                        className="flex-auto rounded-full mt-4"
                        onClick={hWmImgDownload}
                        disabled={isLoading}
                    >
                        {isLoading
                            ?(<Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />)
                            :<Icons.DownloadCloud className="h-6 w-6 mr-2"/>
                        }
                        {createdWmFile}
                    </Button>
                </div>
            :<></>}
        </div>
    )
}