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
import { wmAPI } from "~/utils/watermark-api"
import LoadingOverlay from "~/components/loading-overlay";
import { formatDate, WM_TEXT, WM_IMAGE } from "./common";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@saasfly/ui/tabs"

interface History {
    _id: string
    email: string
    try_watermark: string
    matched: boolean
    createdAt: string
}


export default function ValidationHistory() {
    const { data: session, status } = useSession()
    const [history, setHistory] = useState<History[]>([])
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [watermarkType, setWatermarkType] = useState<typeof WM_TEXT | typeof WM_IMAGE>(WM_TEXT)

    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
        } else if (status === 'unauthenticated') {
            signIn();
        } else if (status === 'authenticated') {
            loadHistory(1, filter);
        }
    }, [status])

    const loadHistory = async (page: number, filter: string) => {
        try {
            setIsLoading(true)
            const account = session?.user.account
            const res = await wmAPI.get("/v1/filigrana/corda/storia",
            {
                params: {
                    page: page,
                    filter: filter
                },
                headers: {
                    'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
                }
            })
            const data: History[] = (res as { data: History[] }).data
            if (!data.length) {
                setIsLoading(false)
                toast({
                    title: "info",
                    description: "No history found",
                })
                return
            }
            setHistory(data)
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
        loadHistory(1, filter)
    }

    const loadMoreHistory = async () => {
        const loadNextPage = page + 1
        await loadHistory(loadNextPage, filter)
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
                    {history.length ? (
                        <div className="divide-y divide-border rounded-md border">
                            <div className="flex items-center justify-between p-4">
                                <Table className="divide-y divide-gray-200">
                                    <TableCaption>
                                        <Button
                                            disabled={isLoading}
                                            onClick={loadMoreHistory}
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
                                            <TableHead>validation</TableHead>
                                            <TableHead>matched</TableHead>
                                            <TableHead>created at</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    {history.map((h: History) => (
                                        <TableRow key={h._id} className="hover:bg-slate-700">
                                            <TableCell>{h.try_watermark}</TableCell>
                                            <TableCell>
                                                {h.matched?
                                                    <Icons.Smile className="h-6 w-6 text-green-500" />
                                                    : <Icons.Frown className="h-6 w-6 text-red-500" />
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(new Date(h.createdAt))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell colSpan={3}>
                                                <p className="text-sm text-gray-500">
                                                    {history.length} items
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
                                "No history found, Please validate a watermark first."
                            </EmptyPlaceholder.Description>
                        </EmptyPlaceholder>
                    )}
                    </TabsContent>
                    <TabsContent value={WM_IMAGE}>
                    </TabsContent>
                </Tabs>
        </div>
    )
}