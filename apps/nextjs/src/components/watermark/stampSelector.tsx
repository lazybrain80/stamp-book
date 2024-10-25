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
    TableBody,
    TableRow,
    TableCell,
} from "@saasfly/ui/table";
import { toast } from "@saasfly/ui/use-toast"
import { Button } from "@saasfly/ui/button"
import * as Icons from "@saasfly/ui/icons"
import { wmAPI } from "~/utils/watermark-api"
import { formatDate } from "./common";
import { Checkbox } from "@saasfly/ui/checkbox"

interface StampInfo{
    _id: string
    watermark: string
    watermark_url: string
    preview_url: string
    createdAt: string
}

interface StampSelectorProps {
    lang: string
    btn_text: string
    type: string
    onSelect: (stampid: string, url: string) => void
}

export default function StampSelector({
    lang,
    btn_text,
    type,
    onSelect
}: StampSelectorProps) {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false);
    const [stamps, setStamps] = useState<StampInfo[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState(1)
    const [selectedStamp, setSelectedStamp] = useState(0)

    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
        } else if (status === 'unauthenticated') {
            signIn();
        } else if (status === 'authenticated') {
            
        }
    }, [status])

    const openDialog = () => {
        setIsOpen(true)
        loadStamps(1)
    }
    const closeDialog = () => {
        setIsOpen(false)
        setStamps([])
    }

    const loadStamps = async (page: number) => {
        try {
            setIsLoading(true)
            const account = session?.user.account
            const res = await wmAPI.get("/v1/filigrana/corda/timbro",
            {
                params: {
                    page: page,
                    tipo: type,
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

    const loadMoreStamps = () => {
        const newPage = page + 1
        loadStamps(newPage)
        setPage(newPage)
    }

    const selectRow = (event: React.MouseEvent<HTMLTableRowElement>) => {
        const selectedRow = event.currentTarget
        const rowIndex = selectedRow.getAttribute('data-index')
        setSelectedStamp(rowIndex ? parseInt(rowIndex) : 0)
    }

    const selectStamp = () => {
        if (selectedStamp > 0 && selectedStamp <= stamps.length) {
            const selected = stamps[selectedStamp - 1];
            if (selected) {
                onSelect(selected._id, selected.watermark_url)
                closeDialog()
            } else {
                toast({
                    title: "error",
                    description: "Invalid stamp selection",
                })
            }
        } else {
            toast({
                title: "error",
                description: "Invalid stamp selection",
            })
        }
    }
    
    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger
                className="w-full"
            >
                <Button
                    onClick={openDialog}
                >
                    <Icons.Stamp
                        className="mr-2"
                    />
                    {btn_text}
                </Button>
            </DialogTrigger>
            <DialogContent
                className="w-full md:max-w-max"
            >
                <DialogHeader>
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
                                onClick={loadMoreStamps}
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
                                <TableHead></TableHead>
                                <TableHead>id</TableHead>
                                <TableHead>stamp</TableHead>
                                <TableHead>image</TableHead>
                                <TableHead>created at</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {stamps.map((s: StampInfo, index: number) => (
                            <TableRow
                                data-index={index + 1}
                                key={s._id}
                                className="hover:bg-slate-700"
                                onClick={selectRow}
                                data-state={index + 1 === selectedStamp ? "selected" : ""}
                            >
                                <TableCell>
                                    <Checkbox
                                        checked={index + 1 === selectedStamp}
                                    />
                                </TableCell>
                                <TableCell>{s._id}</TableCell>
                                <TableCell>
                                    {type === "image"
                                    ?(<img
                                        className="w-16 h-16 object-cover"
                                        src={s.watermark_url}
                                        alt="Image"
                                    />)
                                    :(<>
                                        {s.watermark}
                                    </>)
                                    }
                                    
                                </TableCell>
                                <TableCell>
                                    <img
                                        className="w-16 h-16 object-cover"
                                        src={s.preview_url}
                                        alt="Image"
                                    />
                                </TableCell>
                                <TableCell>
                                    {formatDate(lang, new Date(s.createdAt))}
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={selectStamp}
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