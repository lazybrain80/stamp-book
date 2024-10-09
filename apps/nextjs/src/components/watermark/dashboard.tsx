"use client"
// https://apexcharts.com/docs

import { useSession, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { toast } from "@saasfly/ui/use-toast"
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
import { wmAPI } from "~/utils/watermark-api"
import dynamic from 'next/dynamic';
import LoadingOverlay from "~/components/loading-overlay";

// 동적 로딩을 사용하여 ApexCharts를 클라이언트 사이드에서만 로드
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface WeeklyCount {
  [key: string]: number // 예: { "Mon": 10, "Tue": 20, ... }
}

interface DashInfo {
    daily_stamp_count: number
    daily_validation_count: number
    total_stamp_count: number
    total_validation_count: number
    weekly_stamp_count: WeeklyCount
    weekly_validation_count: WeeklyCount
}

interface SecureStampDashboardProps {
  today_wm_usage_title: string
  total_wm_usage_title: string
  today_valid_usage_title: string
  total_valid_usage_title: string
  weekly_wm_usage_title: string
  weekly_valid_usage_title: string
  weekdays: string[]
}

export default function SecureStampDashboard(
  {
    today_wm_usage_title,
    total_wm_usage_title,
    today_valid_usage_title,
    total_valid_usage_title,
    weekly_wm_usage_title,
    weekly_valid_usage_title,
    weekdays
  }: SecureStampDashboardProps
) {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dashInfo, setDashInfo] = useState<null | DashInfo>(null)

    useEffect(() => {
      if (status === 'loading') {
        setIsLoading(true);
      } else if (status === 'unauthenticated') {
        signIn();
      } else if (status === 'authenticated') {
        loadDashboardInfo();
      }
    }, [status])

    const loadDashboardInfo = async () => {
        try {
          setIsLoading(true)
          const account = session?.user.account
          const res = await wmAPI.get("/v1/filigrana/cruscotto",
          {
              headers: {
                  'Authorization': `${account?.provider}:Bearer:${account?.id_token}`,
              }
          })

          const data = (res as { data: DashInfo }).data
          if (!data) {
              toast({
                  title: "info",
                  description: "No Dashboard info found",
              })
              return
          }
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
      total_validation_count,
      weekly_stamp_count,
      weekly_validation_count
    } = dashInfo ?? {}

    const weeklyStampValues = weekly_stamp_count ? Object.values(weekly_stamp_count) : [];
    const weeklyValidationValues = weekly_validation_count ? Object.values(weekly_validation_count) : [];

    return(
        <div className="w-full h-4/5">
          <LoadingOverlay isLoading={isLoading} />
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {today_wm_usage_title}
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
                  {total_wm_usage_title}
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
                  {today_valid_usage_title}
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
                  {total_valid_usage_title}
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
            height={250}
            type="bar"
            series={[{ name: "Weekly stamp count", data: weeklyStampValues }]}
            options={{
              title: {
                text: weekly_wm_usage_title,
                floating: true,
                offsetY: -5,
                align: 'center',
                style: {
                  color: '#FFFFFF'
                }
              },
              chart: {
                id: "basic-bar",
                toolbar: {
                  show: false
                }
              },
              plotOptions: {
                bar: {
                  borderRadius: 10,
                  dataLabels: {
                    position: 'top', // top, center, bottom
                  },
                }
              },
              dataLabels: {
                enabled: true,
                style: {
                  fontSize: '12px',
                  colors: ["#FFFFFF"]
                }
              },
              tooltip: {
                enabled: false
              },
              xaxis: {
                categories: weekdays,
                labels: {
                  style: {
                    fontSize: '12px',
                    colors: "#FFFFFF"
                  }
                }
              },
              yaxis: {
                labels: {
                  style: {
                    fontSize: '12px',
                    colors: "#FFFFFF"
                    }
                  }
                }
              }
            }
          />
          <Chart
            className="mt-12"
            height={250}
            type="bar"
            series={[{ name: "Weeklu Validation", data: weeklyValidationValues }]}
            options={{
              title: {
                text: weekly_valid_usage_title,
                floating: true,
                offsetY: -5,
                align: 'center',
                style: {
                  color: '#FFFFFF'
                }
              },
              chart: {
                id: "basic-bar",
                toolbar: {
                  show: false
                }
              },
              colors: ['#009933'],
              plotOptions: {
                bar: {
                  borderRadius: 10,
                  dataLabels: {
                    position: 'top', // top, center, bottom
                  },
                }
              },
              dataLabels: {
                enabled: true,
                style: {
                  fontSize: '12px',
                  colors: ["#FFFFFF"]
                }
              },
              tooltip: {
                enabled: false
              },
              xaxis: {
                categories: weekdays,
                labels: {
                  style: {
                    fontSize: '12px',
                    colors: "#FFFFFF"
                  }
                }
              },
              yaxis: {
                labels: {
                  style: {
                    fontSize: '12px',
                    colors: "#FFFFFF"
                  }
                }
              }
            }}
          />
        </div>
            
    )
}