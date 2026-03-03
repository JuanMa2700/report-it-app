import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

interface Props {
  data: { date: string; reportes: number }[]
}

const chartConfig: ChartConfig = {
  reportes: { label: 'Reportes', color: '#8b5cf6' },
}

export function TrendChart({ data }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Tendencia de Reportes</CardTitle>
            <CardDescription>Reportes diarios en los últimos 30 días</CardDescription>
          </div>
          <Badge variant="secondary">Datos simulados</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[250px]">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillReportes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="reportes"
              type="monotone"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#fillReportes)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
