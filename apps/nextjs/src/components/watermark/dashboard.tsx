"use client"
// https://apexcharts.com/docs
import axios from "axios"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
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
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    interface DashInfo {
        daily_stamp_count: number;
        daily_validation_count: number;
        total_stamp_count: number;
        total_validation_count: number;
    }

    const [dashInfo, setDashInfo] = useState<null | DashInfo>(null)

    // fetch history
    useEffect(() => {
      loadDashboardInfo()
    }, [])

    const loadDashboardInfo = async () => {
        try {
          setIsLoading(true)
          const account = session?.user.account
          const res = await axios.get("http://127.0.0.1:8000/v1/filigrana/cruscotto",
          {
              headers: {
                  'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
              }
          })
          const data = res.data
          if (!data) {
              setIsLoading(false)
              toast({
                  title: "info",
                  description: "No Dashboard info found",
              })
              return
          }
          console.log(data)
          setDashInfo(data)
      } catch (error) {
          toast({
              title: "error",
              description: String(error),
          })
      }
      setIsLoading(false)
    }

    const { daily_stamp_count,
      daily_validation_count,
      total_stamp_count,
      total_validation_count } = dashInfo ?? {}

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
                <div className="text-2xl font-bold">{daily_stamp_count} / 10</div>
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
                <div className="text-2xl font-bold">{total_stamp_count}</div>
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
                <div className="text-2xl font-bold">{daily_validation_count} / 50</div>
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
                <div className="text-2xl font-bold">{total_validation_count}</div>
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