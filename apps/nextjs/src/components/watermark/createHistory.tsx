"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
    Table,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@saasfly/ui/table";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { toast } from "@saasfly/ui/use-toast"
import axios from "axios"

interface History {
    _id: string
    email: string
    filename: string
    watermark: string
    createdAt: string
}

export default function CreationHistory() {
    const { data: session } = useSession()
    const [history, setHistory] = useState([])
    // fetch history
    useEffect(() => {
        const fetchData = async () => {
            try {
                const account = session?.user.account
                const res = await axios.get("http://127.0.0.1:8000/v1/filigrana/history",{
                    headers: {
                        'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
                    }
                })
                const data = res.data
                setHistory(data)
            } catch (error) {
                toast({
                    title: "error",
                    description: String(error),
                })
            }
        }
        fetchData();
    }, [])


    return (
        <div>
            {history.length ? (
                <div className="divide-y divide-border rounded-md border">
                    <div className="flex items-center justify-between p-4">
                        <Table className="divide-y divide-gray-200">
                        <TableCaption>A list of creation history.</TableCaption>
                        <TableHeader>
                            <TableRow className="hover:bg-gray-50">
                            <TableHead>filename</TableHead>
                            <TableHead>watermark</TableHead>
                            <TableHead>created at</TableHead>
                            </TableRow>
                        </TableHeader>
                        {history.map((h: History) => (
                            <TableRow key={h._id} className="hover:bg-gray-50">
                                <td>{h.filename}</td>
                                <td>{h.watermark}</td>
                                <td>{h.createdAt}</td>
                            </TableRow>
                        ))}
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
        </div>
    )
}