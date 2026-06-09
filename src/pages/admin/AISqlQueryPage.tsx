import { useState } from 'react'
import { Card, Input, Button, Table, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { aiApi } from '@/api/ai'

const { TextArea } = Input

export default function AISqlQueryPage() {
  const [question, setQuestion] = useState('')
  const [sql, setSql] = useState('')
  const mutation = useMutation({
    mutationFn: (q: string) => aiApi.query({ question: q }),
    onSuccess: (data) => setSql(data.sql),
    onError: () => message.error('SQL生成失败'),
  })

  return (
    <div>
      <div className="page-header">AI 查询</div>
      <Card title="自然语言查询">
        <TextArea
          rows={2}
          placeholder="用自然语言描述你想查询的数据，例如：本周各食堂的销售额排名"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <Button
          type="primary"
          onClick={() => mutation.mutate(question)}
          loading={mutation.isPending}
          style={{ marginTop: 16 }}
        >
          查询
        </Button>
      </Card>
      {sql && (
        <Card title="生成的SQL" style={{ marginTop: 16 }}>
          <pre style={{
            background: '#F8FAFC',
            padding: 16,
            borderRadius: 8,
            overflow: 'auto',
            border: '1px solid #E2E8F0',
            color: '#1E293B',
            fontSize: 13,
          }}>{sql}</pre>
        </Card>
      )}
      {mutation.data?.results && (
        <Card title="查询结果" style={{ marginTop: 16 }}>
          <Table
            dataSource={mutation.data.results}
            columns={mutation.data.columns.map(col => ({ title: col, dataIndex: col, key: col }))}
            rowKey={(_, i) => String(i)}
            pagination={false}
          />
          <p style={{ color: '#94A3B8', marginTop: 8, fontSize: 13 }}>
            共 {mutation.data.row_count} 行 · 执行耗时 {mutation.data.execution_time_ms}ms
          </p>
        </Card>
      )}
    </div>
  )
}
