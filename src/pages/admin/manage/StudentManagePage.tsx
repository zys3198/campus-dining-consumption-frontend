import { useState } from 'react'
import { Card, Table } from 'antd'
import type { TablePaginationConfig } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { studentApi } from '@/api/resources'

export default function StudentManagePage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-students', page, pageSize],
    queryFn: () => studentApi.list({ page, page_size: pageSize }),
  })

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setPage(pagination.current)
    if (pagination.pageSize) setPageSize(pagination.pageSize)
  }

  return (
    <Card title="学生管理">
      <Table
        dataSource={data?.data}
        columns={[
          { title: '学号', dataIndex: 'student_id', key: 'student_id' },
          { title: '姓名', dataIndex: 'name', key: 'name' },
          { title: '院系', dataIndex: 'department', key: 'department' },
          { title: '年级', dataIndex: 'grade', key: 'grade' },
        ]}
        rowKey="student_id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: data?.meta?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 名学生`,
        }}
        onChange={handleTableChange}
      />
    </Card>
  )
}
