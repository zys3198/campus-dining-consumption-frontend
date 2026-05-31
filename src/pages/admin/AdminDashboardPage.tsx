import { Row, Col } from "antd"
import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "@/api/dashboard"
import { StatCard } from "@/components/common/StatCard"

export default function AdminDashboardPage() {
  const opsQuery = useQuery({ queryKey: ["admin-operations"], queryFn: dashboardApi.operations })
  const nutQuery = useQuery({ queryKey: ["admin-nutrition"], queryFn: dashboardApi.nutrition })

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}><StatCard title="今日销售额" value={opsQuery.data?.today?.total_amount ?? 0} suffix="元" precision={2} /></Col>
        <Col span={6}><StatCard title="今日订单" value={opsQuery.data?.today?.total_count ?? 0} suffix="笔" /></Col>
        <Col span={6}><StatCard title="平均热量" value={nutQuery.data?.avg_energy_kcal ?? 0} suffix="kcal" precision={1} /></Col>
        <Col span={6}><StatCard title="营养预警" value={nutQuery.data?.alert_count ?? 0} suffix="人" /></Col>
      </Row>
    </div>
  )
}
