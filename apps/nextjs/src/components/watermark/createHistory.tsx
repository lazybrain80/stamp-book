"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import {
    Table,
    TableCaption,
    TableHead,
    TableHeader,
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
import ImageDisplay from "./imageDisplay"
import { WM_TEXT, WM_IMAGE } from "./common";

interface TextHistory {
    _id: string
    email: string
    type: string
    url: string
    watermark: string
    createdAt: string
}

interface ImageHistory {
    _id: string
    email: string
    type: string
    url: string
    watermark_url: string
    createdAt: string
}


export default function CreationHistory() {
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
                    description: "No text history found",
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
                    description: "No text history found",
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
                                        </TableRow>
                                    </TableHeader>
                                    {textHistory.map((h: TextHistory) => (
                                        <TableRow key={h._id} className="hover:bg-slate-700">
                                            <TableCell>{h._id}</TableCell>
                                            <TableCell>{h.watermark}</TableCell>
                                            <TableCell className="text-center">
                                                <ImageDisplay
                                                    imageUrl={h.url}
                                                />
                                            </TableCell>
                                            <TableCell>{h.createdAt}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell colSpan={4}>
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
                                        </TableRow>
                                    </TableHeader>
                                    {imageHistory.map((h: ImageHistory) => (
                                        <TableRow key={h._id} className="hover:bg-slate-700">
                                            <TableCell>{h._id}</TableCell>
                                            <TableCell className="text-center">
                                                <ImageDisplay
                                                    imageUrl={h.url}
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <ImageDisplay
                                                    imageUrl={h.watermark_url}
                                                />
                                            </TableCell>
                                            <TableCell>{h.createdAt}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell colSpan={4}>
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