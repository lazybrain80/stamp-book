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

interface History {
    _id: string
    email: string
    try_watermark: string
    matched: boolean
    createdAt: string
}

const formatDate = (date: Date) => {
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
};

export default function ValidationHistory() {
    const { data: session, status } = useSession()
    const [history, setHistory] = useState<History[]>([])
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
        } else if (status === 'unauthenticated') {
            signIn();
        } else if (status === 'authenticated') {
            loadHistory();
        }
    }, [status])

    const loadHistory = async () => {
        try {
            setIsLoading(true)
            const account = session?.user.account
            const res = await wmAPI.get("/v1/filigrana/corda/history",
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
        loadHistory()
    }

    const loadMoreHistory = async () => {
        const loadNextPage = page + 1
        try {
            setIsLoading(true)
            const account = session?.user.account
            const res = await wmAPI.get("/v1/filigrana/corda/history",
            {
                params: {
                    page: loadNextPage,
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
                    description: "No more history found",
                })
                return
            }
            setPage(loadNextPage)
            setHistory([...history, ...data])
        } catch (error) {
            toast({
                title: "error",
                description: String(error),
            })
        }
        setIsLoading(false)
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
                                <TableRow key={h._id} className="hover:bg-gray-50">
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
        </div>
    )
}