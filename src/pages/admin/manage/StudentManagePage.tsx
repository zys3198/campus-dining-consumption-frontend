import React from 'react'
import { Card, Table } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { studentApi } from '@/api/resources'

export default function StudentManagePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: studentApi.list,
  })

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
      />
    </Card>
  )
}
