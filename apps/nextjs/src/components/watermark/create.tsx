"use client"

import { Button } from "@saasfly/ui/button"
import { Switch } from "@saasfly/ui/switch"
import { Input } from "@saasfly/ui/input"
import { toast } from "@saasfly/ui/use-toast"
import * as Icons from "@saasfly/ui/icons"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useState } from "react"
import {
    DragAndDropBox,
    DragAndDropBoxDescription,
    DragAndDropBoxIcon,
    DragAndDropBoxTitle
} from "~/components/drag-n-drop-box"

interface CreateWatermarkProps {
    dragndrop_title: string
    dragndrop_desc: string
    input_wm_warning: string
    submit: string
}

interface WmResult {
    wm: string
    filename: string
}

export default function CreateWatermark(
    {
        dragndrop_title,
        dragndrop_desc,
        input_wm_warning,
        submit
    }: CreateWatermarkProps
) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [originalImg, setOriginalImg] = useState<null | File>(null)
    const [customWmText, setCustomWmText] = useState('')

    const [createdWmFile, setCreatedWmFile] = useState("")
    const [createdWmText, setCreatedWmText] = useState("")

    const { data: session } = useSession()

    const [isCustomWm, setIsCustomWm] = useState(false)

    const hOriginalImgChange = (file: File) => {
        setOriginalImg(file)
    }
    const hOriginalImgSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (originalImg) {
            setIsLoading(true)
            setCreatedWmText("")
            setCreatedWmFile("")

            const formData = new FormData()
            formData.append("file", originalImg)
            formData.append("watermark", customWmText)
            const account = session?.user.account
            try {
                const res = await axios.post('http://127.0.0.1:8000/v1/filigrana', formData, {
                    headers: {
                        'Auth-Provider': account?.provider,
                        'Authorization': `Bearer ${account?.access_token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                const wmResult: WmResult = res.data
                setCreatedWmText(wmResult.wm)
                setCreatedWmFile(wmResult.filename)

                toast({
                    title: "success",
                    description: "watermark created",
                })

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const { detail } = error.response.data
                    console.error("Error response22222:", error.response.data)
                    toast({
                        title: "error",
                        description: detail,
                    })
                } else {
                    console.error("Error uploading file:", error)
                }
            }
        }
        setIsLoading(false)
    }
    const hWmImgDownload = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const account = session?.user.account
            const response = await axios.get(`http://127.0.0.1:8000/v1/filigrana/file?filename=${createdWmFile}`, {
                responseType: 'blob', // Important for handling binary data
                headers: {
                    'Auth-Provider': account?.provider,
                    'Authorization': `Bearer ${account?.access_token}`,
                    'Cache-Control': 'no-cache', // Prevent caching
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            })
            const url = window.URL.createObjectURL(new Blob([response.data]))
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
    return(
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
            <DragAndDropBox
                handleFileChange={hOriginalImgChange}
            >
                <DragAndDropBoxIcon name={"Add"}/>
                <DragAndDropBoxTitle>
                    {dragndrop_title}
                </DragAndDropBoxTitle>
                <DragAndDropBoxDescription>
                    {dragndrop_desc}
                </DragAndDropBoxDescription>
            </DragAndDropBox>
            {originalImg
                ?(<div className="flex flex-col w-full items-center">
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
                            placeholder="Custom watermark"
                            maxLength={27}
                            value={customWmText}
                            onChange={hInputChange}
                        />
                        <span>{customWmText.length}/27</span>
                    </div>
                    <div className="flex flex-row items-center w-11/12 space-x-4 mt-5">
                        <span className="text-sm text-gray-500 ml-14">
                            {input_wm_warning}
                        </span>
                    </div>
                    <Button
                        variant="secondary"
                        className="rounded-full w-11/12 mt-4"
                        onClick={hOriginalImgSubmit}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {submit}
                    </Button>
                </div>)
            :<></>}
            {createdWmText
                ?<div className="flex items-center" >
                    <Button
                        variant="default"
                        className="rounded-full mt-4 mr-4"
                        onClick={hWmImgDownload}
                        disabled={isLoading}
                    >
                        {isLoading
                            ?(<Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />)
                            :<Icons.Check className="h-6 w-6 mr-2"/>
                        }
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