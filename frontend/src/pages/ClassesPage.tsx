import React, { useState, useEffect } from 'react';
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
  Select,
  Tag,
} from 'antd';
import {
  BookOutlined,
  UserOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// 使用百词斩样式的组件
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

const ClassCard = styled(Card)`
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

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [wordBooks, setWordBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchClasses();
    fetchWordBooks();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUserRole(response.data.role);
    } catch (error) {
      message.error('获取用户信息失败');
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data.data);
    } catch (error) {
      message.error('获取班级列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchWordBooks = async () => {
    try {
      const response = await axios.get('/api/wordbooks');
      setWordBooks(response.data.data);
    } catch (error) {
      message.error('获取词书列表失败');
    }
  };

  const handleCreateClass = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('/api/classes', values);
      message.success('班级创建成功');
      setIsModalVisible(false);
      form.resetFields();
      fetchClasses();
    } catch (error) {
      message.error('班级创建失败');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <PageContainer>
      <StyledHeader>
        <Title level={3} style={{ margin: 0, color: 'white' }}>
          英语单词学习系统
        </Title>
      </StyledHeader>
      <Layout>
        <StyledSider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['2']}
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
              我的班级
            </Title>
            {userRole === 'teacher' && (
              <Button 
                type="primary" 
                onClick={handleCreateClass}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderColor: 'transparent'
                }}
              >
                <PlusOutlined />
                创建班级
              </Button>
            )}
          </div>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={classes}
            loading={loading}
            renderItem={(item: any) => (
              <List.Item>
                <ClassCard
                  title={item.name}
                  extra={
                    userRole === 'teacher' ? (
                      <Tag color="blue">教师</Tag>
                    ) : (
                      <Tag color="green">学生</Tag>
                    )
                  }
                >
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>词书: </Text>
                    <Text>
                      {item.wordBookId?.title || '未分配'}
                    </Text>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>学生数量: </Text>
                    <Text>{item.studentIds?.length || 0}</Text>
                  </div>
                  {userRole === 'teacher' && (
                    <div>
                      <Text strong>学生列表: </Text>
                      <div style={{ marginTop: 8 }}>
                        {item.studentIds && item.studentIds.length > 0 ? (
                          item.studentIds.map((student: any) => (
                            <Tag key={student._id} color="green">
                              {student.username}
                            </Tag>
                          ))
                        ) : (
                          <Text type="secondary">暂无学生</Text>
                        )}
                      </div>
                    </div>
                  )}
                </ClassCard>
              </List.Item>
            )}
          />
        </StyledContent>
      </Layout>
      <Modal
        title="创建班级"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="班级名称"
            rules={[{ required: true, message: '请输入班级名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="wordBookId" label="选择词书">
            <Select placeholder="选择词书">
              {wordBooks.map((wordBook: any) => (
                <Option key={wordBook._id} value={wordBook._id}>
                  {wordBook.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ClassesPage;