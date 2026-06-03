import { useState, useCallback } from 'react'
import {
  Card,
  Tabs,
  Upload,
  Button,
  Alert,
  Table,
  Tag,
  Typography,
  Space,
  Progress,
  App,
} from 'antd'
import {
  UploadOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileExcelOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload'
import type { ImportResponse } from '@/types'
import { importApi } from '@/api/resources'

const { Dragger } = Upload
const { Text, Paragraph } = Typography

interface ImportError {
  key: string
  message: string
}

interface ImportResult {
  status: 'success' | 'error'
  response?: ImportResponse
  errorMessage?: string
}

const ACCEPT_EXTENSIONS = '.csv,.xlsx,.xls,.json,.jsonl'

const CSV_COLUMNS: Record<string, { columns: string[]; example: string }> = {
  transactions: {
    columns: [
      'txn_id', 'student_id', 'window_id', 'txn_time',
      'total_amount', 'meal_type', 'payment_method', 'dishes',
    ],
    example:
      'txn_id,student_id,window_id,txn_time,total_amount,meal_type,payment_method,dishes\n'
      + 'TXN001,20240001,W001,2026-05-28 12:30:00,15.50,2,1,D001:1:8.00;D002:1:7.50',
  },
  students: {
    columns: ['student_id', 'name', 'department', 'grade', 'gender'],
    example:
      'student_id,name,department,grade,gender\n'
      + '20240001,张三,计算机学院,大一,1',
  },
  queue: {
    columns: [
      'record_id', 'window_id', 'wait_start', 'wait_end',
      'wait_duration', 'student_count', 'collect_method',
    ],
    example:
      'record_id,window_id,wait_start,wait_end,wait_duration,student_count,collect_method\n'
      + 'QR001,W001,2026-05-28T12:00:00,2026-05-28T12:05:30,330,15,1',
  },
}

function ImportPanel({
  title,
  description,
  dataType,
  importFn,
}: {
  title: string
  description: string
  dataType: keyof typeof CSV_COLUMNS
  importFn: (file: File) => Promise<ImportResponse>
}) {
  const { message } = App.useApp()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [errors, setErrors] = useState<ImportError[]>([])

  const spec = CSV_COLUMNS[dataType]

  const handleUpload = useCallback(async () => {
    if (fileList.length === 0) {
      message.warning('请先选择文件')
      return
    }

    const rawFile = fileList[0].originFileObj
    if (!rawFile) return

    setLoading(true)
    setResult(null)
    setErrors([])

    try {
      const res = await importFn(rawFile)
      setResult({ status: 'success', response: res })

      if (res.error_details && res.error_details.length > 0) {
        setErrors(
          res.error_details.map((msg, i) => ({
            key: `${i}`,
            message: msg,
          })),
        )
      }

      message.success(`导入完成：成功 ${res.imported} 条`)
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || '导入失败'
      setResult({ status: 'error', errorMessage: msg })
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }, [fileList, importFn, message])

  const handleRemoveFile = () => {
    setFileList([])
    setResult(null)
    setErrors([])
  }

  const errorColumns = [
    {
      title: '#',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: '错误信息',
      dataIndex: 'message',
      key: 'message',
    },
  ]

  const totalRecords = result?.response
    ? result.response.imported + (result.response.skipped ?? 0) + result.response.error_count
    : 0

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Paragraph type="secondary">{description}</Paragraph>

      <Card size="small" title="文件格式要求">
        <Space direction="vertical" size={4}>
          <Text>
            支持格式：
            <Tag icon={<FileExcelOutlined />} color="green">.xlsx</Tag>
            <Tag icon={<FileTextOutlined />} color="blue">.csv</Tag>
            <Tag icon={<FileTextOutlined />} color="orange">.json</Tag>
            <Tag icon={<FileTextOutlined />} color="orange">.jsonl</Tag>
          </Text>
          <Text>
            必填列：
            {spec.columns.map((col) => (
              <Tag key={col}>{col}</Tag>
            ))}
          </Text>
          <details style={{ marginTop: 4 }}>
            <summary style={{ cursor: 'pointer', color: '#1677ff' }}>查看示例</summary>
            <pre style={{
              background: '#f5f5f5',
              padding: 12,
              borderRadius: 6,
              fontSize: 12,
              marginTop: 8,
              overflowX: 'auto',
            }}>
              {spec.example}
            </pre>
          </details>
        </Space>
      </Card>

      <Dragger
        accept={ACCEPT_EXTENSIONS}
        maxCount={1}
        fileList={fileList}
        beforeUpload={(_file, _fileList) => {
          return false // prevent auto upload
        }}
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList)
          setResult(null)
          setErrors([])
        }}
        onRemove={handleRemoveFile}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域</p>
        <p className="ant-upload-hint">支持 CSV / Excel / JSON 文件</p>
      </Dragger>

      <Button
        type="primary"
        icon={<UploadOutlined />}
        loading={loading}
        disabled={fileList.length === 0}
        onClick={handleUpload}
        block
      >
        开始导入
      </Button>

      {result?.response && (
        <Card size="small" title="导入结果">
          <Space direction="vertical" style={{ width: '100%' }}>
            {totalRecords > 0 && (
              <Progress
                percent={Math.round((result.response.imported / totalRecords) * 100)}
                success={{ percent: Math.round((result.response.imported / totalRecords) * 100) }}
                format={() => `${result.response!.imported} / ${totalRecords}`}
              />
            )}
            <Space wrap>
              <Tag icon={<CheckCircleOutlined />} color="success">
                成功 {result.response.imported}
              </Tag>
              {result.response.skipped != null && result.response.skipped > 0 && (
                <Tag color="warning">跳过重复 {result.response.skipped}</Tag>
              )}
              {result.response.error_count > 0 && (
                <Tag icon={<CloseCircleOutlined />} color="error">
                  失败 {result.response.error_count}
                </Tag>
              )}
            </Space>
            {errors.length > 0 && (
              <Table
                dataSource={errors}
                columns={errorColumns}
                size="small"
                pagination={{ pageSize: 10 }}
                style={{ marginTop: 8 }}
              />
            )}
          </Space>
        </Card>
      )}

      {result?.status === 'error' && (
        <Alert type="error" message={result.errorMessage} showIcon />
      )}
    </Space>
  )
}

export default function DataImportPage() {
  const tabItems = [
    {
      key: 'transactions',
      label: '消费记录导入',
      children: (
        <ImportPanel
          title="消费记录导入"
          description="批量导入消费流水数据。系统会自动校验学生、窗口、菜品是否存在，并跳过重复记录。"
          dataType="transactions"
          importFn={importApi.transactions}
        />
      ),
    },
    {
      key: 'students',
      label: '学生信息导入',
      children: (
        <ImportPanel
          title="学生信息导入"
          description="批量导入学生基本信息。已存在的学生（按学号匹配）会被更新，新学生会被插入。"
          dataType="students"
          importFn={importApi.students}
        />
      ),
    },
    {
      key: 'queue',
      label: '排队记录导入',
      children: (
        <ImportPanel
          title="排队记录导入"
          description="批量导入排队等候数据。系统会校验 wait_end > wait_start 且时长为正数。"
          dataType="queue"
          importFn={importApi.queueRecords}
        />
      ),
    },
  ]

  return (
    <Card title="数据导入">
      <Tabs items={tabItems} />
    </Card>
  )
}
