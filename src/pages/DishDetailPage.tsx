import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Image, Typography, Button, Spin, Row, Col, Statistic, Space } from 'antd'
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { dishApi } from '@/api/resources'

const { Title, Text } = Typography

const DishDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: dish, isLoading } = useQuery({
    queryKey: ['dish', id],
    queryFn: () => dishApi.get(id!),
    enabled: !!id,
  })

  if (isLoading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />

  if (!dish) return <Card><Text>餐品不存在</Text></Card>

  return (
    <Card
      title={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
          <span>餐品详情</span>
        </Space>
      }
    >
      <Row gutter={24}>
        <Col span={8}>
          <Image
            width="100%"
            src={`https://picsum.photos/seed/${dish.dish_id}/400/400`}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            style={{ borderRadius: 12 }}
          />
        </Col>
        <Col span={16}>
          <Title level={3}>{dish.dish_name}</Title>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Statistic
                title="价格"
                value={dish.price}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#f5222d' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="分类"
                value={dish.category}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="状态"
                value={dish.is_available === 1 ? '供应中' : '已售罄'}
                valueStyle={{ color: dish.is_available === 1 ? '#52c41a' : '#999' }}
              />
            </Col>
          </Row>

          <Descriptions column={2} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="餐品编号">{dish.dish_id}</Descriptions.Item>
            <Descriptions.Item label="所属窗口">{dish.window_name}</Descriptions.Item>
            {dish.tags && <Descriptions.Item label="标签">{dish.tags}</Descriptions.Item>}
          </Descriptions>

          {dish.nutrition && (
            <>
              <Title level={5}>营养信息（每100g）</Title>
              <Row gutter={16}>
                <Col span={6}>
                  <Card size="small">
                    <Statistic title="热量" value={dish.nutrition.energy_kcal} suffix="kcal" />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic title="蛋白质" value={dish.nutrition.protein_g} suffix="g" />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic title="脂肪" value={dish.nutrition.fat_g} suffix="g" />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic title="碳水" value={dish.nutrition.carbs_g} suffix="g" />
                  </Card>
                </Col>
              </Row>
            </>
          )}

          <Button type="primary" icon={<ShoppingCartOutlined />} size="large" style={{ marginTop: 24 }}>
            加入购餐车
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default DishDetailPage
