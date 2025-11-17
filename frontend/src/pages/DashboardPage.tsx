import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Card,
  List,
  Typography,
  message,
  Modal,
  Form,
  Input,
  Upload,
} from 'antd';
import {
  BookOutlined,
  UserOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// 使用百词斩样式的卡片组件
const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  .ant-card-head {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 16px 16px 0 0;
  }
`;

const PageContainer = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StyledSider = styled(Sider)`
  background: #f0f2f5;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  background: #f0f2f5;
`;

const WordBookCard = styled(StyledCard)`
  text-align: center;
  
  .ant-card-head {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
`;

const DashboardPage = () => {
  const [wordBooks, setWordBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWordBooks();
  }, []);

  const fetchWordBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/wordbooks');
      setWordBooks(response.data.data);
    } catch (error) {
      message.error('获取词书列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWordBook = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('/api/wordbooks', values);
      message.success('词书创建成功');
      setIsModalVisible(false);
      form.resetFields();
      fetchWordBooks();
    } catch (error) {
      message.error('词书创建失败');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleStudyWordBook = (id: string) => {
    navigate(`/wordbook/${id}`);
  };

  const handlePlayGame = () => {
    navigate('/game');
  };

  return (
    <PageContainer>
      <StyledHeader>
        <Title level={3} style={{ margin: 0, color: 'white' }}>
          英语单词学习系统
        </Title>
        <Button 
          type="primary" 
          onClick={handlePlayGame}
          style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <PlayCircleOutlined />
          开始游戏
        </Button>
      </StyledHeader>
      <Layout>
        <StyledSider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<BookOutlined />}>
              词书管理
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              班级管理
            </Menu.Item>
          </Menu>
        </StyledSider>
        <StyledContent>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              我的词书
            </Title>
            <Button 
              type="primary" 
              onClick={handleCreateWordBook}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderColor: 'transparent'
              }}
            >
              <PlusOutlined />
              创建词书
            </Button>
          </div>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={wordBooks}
            loading={loading}
            renderItem={(item: any) => (
              <List.Item>
                <WordBookCard
                  title={item.title}
                  extra={<Text style={{ color: 'white' }}>{item.wordCount} 个单词</Text>}
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => handleStudyWordBook(item._id)}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderColor: 'transparent'
                      }}
                    >
                      开始学习
                    </Button>,
                  ]}
                >
                  <Text>{item.description}</Text>
                  <div style={{ marginTop: 16 }}>
                    <Text type="secondary">来源: {item.source}</Text>
                  </div>
                </WordBookCard>
              </List.Item>
            )}
          />
        </StyledContent>
      </Layout>
      <Modal
        title="创建词书"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="词书名称"
            rules={[{ required: true, message: '请输入词书名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default DashboardPage;