"use client"
// https://apexcharts.com/docs
import axios from "axios"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "@saasfly/ui/use-toast"
import Chart from 'react-apexcharts'
import {
  BadgePlus,
  BadgeCheck,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@saasfly/ui/card";

export default function SecureStampDashboard() {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [originalImg, setOriginalImg] = useState<null | File>(null)
    const [customWmText, setCustomWmText] = useState('')

    const [createdWmFile, setCreatedWmFile] = useState("")
    const [createdWmText, setCreatedWmText] = useState("")
    const [isCustomWm, setIsCustomWm] = useState(false)

    return(
        <div className="w-full h-4/5">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  오늘의 워터마크 사용량
                </CardTitle>
                <BadgePlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 / 10</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  총 누적 사용량
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">999</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  오늘의 검증 사용량
                </CardTitle>
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20 / 50</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  총 누적 검증량
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9999</div>
              </CardContent>
            </Card>
          </div>
          
          <Chart
            className="mt-12"
            height={500}
            type="bar"
            series={[{ name: "Example", data: [10, 20, 30, 40, 30 ,20 ,10] }]}
            options={{
              chart: {
                id: "basic-bar"
              },
              xaxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              }
            }}
          />
        </div>
            
    )
}