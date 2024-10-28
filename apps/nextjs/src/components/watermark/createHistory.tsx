"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import {
    Table,
    TableCaption,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    TableFooter,
    TableCell,
} from "@saasfly/ui/table";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { Button } from "@saasfly/ui/button"
import { Input } from "@saasfly/ui/input"
import * as Icons from "@saasfly/ui/icons"
import { toast } from "@saasfly/ui/use-toast"
import { wmAPI } from "~/utils/watermark-api";
import LoadingOverlay from "~/components/loading-overlay";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@saasfly/ui/tabs"
import StampImagePopUp from "./stampImagePopUp";
import { formatDate, WM_TEXT, WM_IMAGE } from "./common";
import RemoveStampedImage from "./removeStampedImage";

interface TextHistory {
    _id: string
    email: string
    type: string
    preview_url: string
    watermark: string
    createdAt: string
}

interface ImageHistory {
    _id: string
    email: string
    type: string
    preview_url: string
    watermark_url: string
    watermark_preview_url: string
    createdAt: string
}

interface CreationHistoryProps {
    lang: string
}

export default function CreationHistory(
    { lang }: CreationHistoryProps
) {
    const { data: session, status } = useSession()
    const [textHistory, setTextHistory] = useState<TextHistory[]>([])
    const [imageHistory, setImageHistory] = useState<ImageHistory[]>([])
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [watermarkType, setWatermarkType] = useState<typeof WM_TEXT | typeof WM_IMAGE>(WM_TEXT)

    // fetch history
    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
        } else if (status === 'unauthenticated') {
            signIn();
        } else if (status === 'authenticated') {
            loadTextCreationHistory(1, filter)
            loadImageCreationHistory(1, filter)
        }
    }, [status])

    const loadTextCreationHistory = async (page: number, filter: string) => {
        try {
            setIsLoading(true)
            const account = session?.user.account
            const res = await wmAPI.get("/v1/filigrana/storia/testo",
            {
                params: {
                    page: page,
                    filter: filter
                },
                headers: {
                    'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
                }
            })
            const data: TextHistory[] = (res as { data: TextHistory[] }).data
            if (!data.length) {
                setIsLoading(false)
                toast({
                    title: "info",
                    description: "No text-watermark creation history found",
                })
                return
            }
            setTextHistory([...textHistory, ...data])
        } catch (error) {
            toast({
                title: "error",
                description: String(error),
            })
        }
        setIsLoading(false)
    }

    const loadImageCreationHistory = async (page: number, filter: string) => {
        try {
            setIsLoading(true)
            const account = session?.user.account
            const res = await wmAPI.get("/v1/filigrana/storia/immagine",
            {
                params: {
                    page: page,
                    filter: filter
                },
                headers: {
                    'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
                }
            })
            const data: ImageHistory[] = (res as { data: ImageHistory[] }).data
            if (!data.length) {
                setIsLoading(false)
                toast({
                    title: "info",
                    description: "No image-watermark creation history found",
                })
                return
            }
            setImageHistory([...imageHistory, ...data])
        } catch (error) {
            toast({
                title: "error",
                description: String(error),
            })
        }
        setIsLoading(false)
    }

    const filterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value)
    }

    const filterHistory = async () => {
        setPage(1)
        if (watermarkType === WM_IMAGE) {
            await loadImageCreationHistory(1, filter)
            return
        }
        await loadTextCreationHistory(1, filter)
    }

    const loadMoreTextHistory = async () => {
        const loadNextPage = page + 1
        await loadTextCreationHistory(loadNextPage, filter)
        setPage(loadNextPage)
    }

    const loadMoreImageHistory = async () => {
        const loadNextPage = page + 1
        await loadImageCreationHistory(loadNextPage, filter)
        setPage(loadNextPage)
    }

    const hTabChange = (value: string) => {
        setFilter("")
        setWatermarkType(value as typeof WM_TEXT | typeof WM_IMAGE)
    }

    const reloadTxtHistory = async (removed_id: string) => {
        const updatedTextHistory = textHistory.reduce((acc: TextHistory[], h: TextHistory) => {
            if (h._id !== removed_id) {
                acc.push(h)
            }
            return acc
        }, []);
        setTextHistory(updatedTextHistory);
    }

    const reloadImgHistory = async (removed_id: string) => {
        const updatedImgHistory = imageHistory.reduce((acc: ImageHistory[], h: ImageHistory) => {
            if (h._id !== removed_id) {
                acc.push(h)
            }
            return acc
        }, []);
        setImageHistory(updatedImgHistory);
    }

    return (
        <div>
            <LoadingOverlay isLoading={isLoading} />
            <div className="mt-4 mb-4 flex divide-y divide-border rounded-md border">
                <Icons.ListFilter className="m-3 text-gray-400" />
                <Input
                    className="m-1"
                    placeholder="Filter by filename or watermark"
                    value={filter}
                    onChange={filterChange}
                />
                <Button
                    className="m-1"
                    onClick={filterHistory}
                >
                    Filter
                </Button>
            </div>
            <Tabs
                className="w-full"
                defaultValue={WM_TEXT}
                onValueChange={hTabChange}
            >
                <TabsList className="w-full">
                    <TabsTrigger value={WM_TEXT}>Text History</TabsTrigger>
                    <TabsTrigger value={WM_IMAGE}>Image History</TabsTrigger>
                </TabsList>
                <TabsContent value={WM_TEXT}>
                    {textHistory.length ? (
                        <div className="divide-y divide-border rounded-md border">
                            <div className="flex items-center justify-between p-4">
                                <Table className="divide-y divide-gray-200">
                                    <TableCaption>
                                        <Button
                                            disabled={isLoading}
                                            onClick={loadMoreTextHistory}
                                        >
                                            {isLoading
                                                ?(<Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />)
                                                :<Icons.ArrowDownFromLine className="h-6 w-6 mr-2"/>
                                            }
                                            Load more history
                                        </Button>
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className="hover:bg-gray-50">
                                            <TableHead>id</TableHead>
                                            <TableHead>embedded text</TableHead>
                                            <TableHead className="text-center">watermark image</TableHead>
                                            <TableHead>created at</TableHead>
                                            <TableHead/>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {textHistory.map((h: TextHistory) => (
                                        <TableRow key={h._id} className="hover:bg-slate-700">
                                            <TableCell>{h._id}</TableCell>
                                            <TableCell>{h.watermark}</TableCell>
                                            <TableCell className="text-center">
                                                <StampImagePopUp
                                                    imageId={h._id}
                                                    previewUrl={h.preview_url}
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(lang, new Date(h.createdAt))}</TableCell>
                                            <TableCell>
                                                <RemoveStampedImage
                                                    imageType="text"
                                                    imageId={h._id}
                                                    reload={reloadTxtHistory}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell colSpan={5}>
                                                <p className="text-sm text-gray-500">
                                                    {textHistory.length} items
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    ) : (
                        <EmptyPlaceholder
                            title="No history found"
                        >
                            <EmptyPlaceholder.Title>
                                "No history found"
                            </EmptyPlaceholder.Title>
                            <EmptyPlaceholder.Description>
                                "No history found. Please create a watermark first."
                            </EmptyPlaceholder.Description>
                        </EmptyPlaceholder>
                    )}
                </TabsContent>
                <TabsContent value={WM_IMAGE}>
                    {imageHistory.length ? (
                        <div className="divide-y divide-border rounded-md border">
                            <div className="flex items-center justify-between p-4">
                                <Table className="divide-y divide-gray-200">
                                    <TableCaption>
                                        <Button
                                            disabled={isLoading}
                                            onClick={loadMoreImageHistory}
                                        >
                                            {isLoading
                                                ?(<Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />)
                                                :<Icons.ArrowDownFromLine className="h-6 w-6 mr-2"/>
                                            }
                                            Load more history
                                        </Button>
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className="hover:bg-gray-50">
                                            <TableHead>id</TableHead>
                                            <TableHead className="text-center">
                                                image
                                            </TableHead>
                                            <TableHead className="text-center">
                                                watermark
                                            </TableHead>
                                            <TableHead>created at</TableHead>
                                            <TableHead/>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {imageHistory.map((h: ImageHistory) => (
                                        <TableRow key={h._id} className="hover:bg-slate-700">
                                            <TableCell>{h._id}</TableCell>
                                            <TableCell className="text-center">
                                                <StampImagePopUp
                                                    imageId={h._id}
                                                    previewUrl={h.preview_url}
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <img
                                                    src={h.watermark_preview_url}
                                                    alt="Preview"
                                                    className="absolute top-0 left-0 w-16 h-10 object-cover rounded-full border-2 border-white shadow-lg"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(lang, new Date(h.createdAt))}</TableCell>
                                            <TableCell>
                                                <RemoveStampedImage
                                                    imageType="image"
                                                    imageId={h._id}
                                                    reload={reloadImgHistory}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell colSpan={5}>
                                                <p className="text-sm text-gray-500">
                                                    {imageHistory.length} items
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    ) : (
                        <EmptyPlaceholder
                            title="No history found"
                        >
                            <EmptyPlaceholder.Title>
                                "No history found"
                            </EmptyPlaceholder.Title>
                            <EmptyPlaceholder.Description>
                                "No history found. Please create a watermark first."
                            </EmptyPlaceholder.Description>
                        </EmptyPlaceholder>
                    )}
                </TabsContent>
            </Tabs>
            
        </div>
    )
}