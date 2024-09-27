"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import {
    Dialog,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@saasfly/ui/dialog"
import {
    Table,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
    TableCell,
} from "@saasfly/ui/table";
import { toast } from "@saasfly/ui/use-toast"
import { Button } from "@saasfly/ui/button"
import * as Icons from "@saasfly/ui/icons"
import { wmAPI } from "~/utils/watermark-api"
import { formatDate } from "./common";


interface StampInfo{
    _id: string
    watermark_url: string
    createdAt: string
}


export default function StampSelector() {
    const { data: session, status } = useSession()
    const [stamps, setStamps] = useState<StampInfo[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
        } else if (status === 'unauthenticated') {
            signIn();
        } else if (status === 'authenticated') {
            loadStamps(1);
        }
    }, [status])

    const loadStamps = async (page: number) => {
        try {
            setIsLoading(true)
            const account = session?.user.account
            const res = await wmAPI.get("/v1/filigrana/corda/timbro",
            {
                params: {
                    page: page,
                },
                headers: {
                    'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
                }
            })
            const data: StampInfo[] = (res as { data: StampInfo[] }).data
            if (!data.length) {
                setIsLoading(false)
                toast({
                    title: "info",
                    description: "No Stamp found",
                })
                return
            }
            setStamps(data)
        } catch (error) {
            toast({
                title: "error",
                description: String(error),
            })
        }
        setIsLoading(false)
    }
    
    return (
        <Dialog>
            <DialogTrigger
                className="w-full"
            >
                <Button>
                    <Icons.Stamp
                        className="mr-2"
                    />
                    Please select a stamp
                </Button>
            </DialogTrigger>
            <DialogContent
                className="w-full md:max-w-max"
            >
                <DialogHeader>
                    <DialogClose />
                </DialogHeader>
                <DialogTitle>
                    Select Stamp
                </DialogTitle>
                <DialogDescription>
                    Select a stamp for validation
                </DialogDescription>
                <div className="flex items-center justify-between p-4 overflow-auto">
                    <Table className="divide-y divide-gray-200">
                        <TableCaption>
                            <Button
                                disabled={isLoading}
                                onClick={() => loadStamps(page + 1)}
                            >
                                {isLoading
                                    ?(<Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />)
                                    :<Icons.ArrowDownFromLine className="h-6 w-6 mr-2"/>
                                }
                                Load more stamps
                            </Button>
                        </TableCaption>
                        <TableHeader>
                            <TableRow className="hover:bg-gray-50">
                                <TableHead>id</TableHead>
                                <TableHead>stamp</TableHead>
                                <TableHead>created at</TableHead>
                            </TableRow>
                        </TableHeader>
                        {stamps.map((s: StampInfo) => (
                            <TableRow key={s._id} className="hover:bg-slate-700">
                                <TableCell>{s._id}</TableCell>
                                <TableCell>
                                    <img
                                        className="w-16 h-16 object-cover"
                                        src={s.watermark_url}
                                        alt="Image"
                                    />
                                </TableCell>
                                <TableCell>
                                    {formatDate(new Date(s.createdAt))}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableFooter>
                            <TableRow >
                                <TableCell colSpan={3}>
                                    <p className="text-sm text-gray-500">
                                        {stamps.length} items
                                    </p>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
                <DialogFooter
                    className="w-full"
                >
                    <Button
                        className="w-full"
                    >
                        <Icons.Stamp
                            className="mr-2"
                        />
                        Select
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}