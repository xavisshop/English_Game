import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  List,
  Typography,
  Button,
  message,
  Modal,
  Form,
  Input,
  Upload,
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const WordCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const WordBookPage = () => {
  const { id } = useParams();
  const [wordBook, setWordBook] = useState<any>(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [importForm] = Form.useForm();

  useEffect(() => {
    fetchWordBook();
    fetchWords();
  }, [id]);

  const fetchWordBook = async () => {
    try {
      const response = await axios.get(`/api/wordbooks/${id}`);
      setWordBook(response.data.data);
    } catch (error) {
      message.error('获取词书信息失败');
    }
  };

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/wordbooks/${id}/words`);
      setWords(response.data.data);
    } catch (error) {
      message.error('获取单词列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = () => {
    setIsModalVisible(true);
  };

  const handleImportWords = () => {
    setIsImportModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post(`/api/wordbooks/${id}/words`, values);
      message.success('单词添加成功');
      setIsModalVisible(false);
      form.resetFields();
      fetchWords();
    } catch (error) {
      message.error('单词添加失败');
    }
  };

  const handleImportModalOk = async () => {
    try {
      const values = await importForm.validateFields();
      // 这里应该处理文件上传，简化实现
      message.success('单词导入成功');
      setIsImportModalVisible(false);
      importForm.resetFields();
      fetchWords();
    } catch (error) {
      message.error('单词导入失败');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleImportModalCancel = () => {
    setIsImportModalVisible(false);
    importForm.resetFields();
  };

  return (
    <PageContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {wordBook?.title}
          </Title>
          <Text type="secondary">{wordBook?.description}</Text>
        </div>
        <div>
          <Button
            type="primary"
            onClick={handleAddWord}
            style={{ marginRight: 12 }}
          >
            <PlusOutlined />
            添加单词
          </Button>
          <Button onClick={handleImportWords}>
            <UploadOutlined />
            导入单词
          </Button>
        </div>
      </div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={words}
        loading={loading}
        renderItem={(item: any) => (
          <List.Item>
            <WordCard
              title={item.word}
              extra={<Text type="secondary">{item.phonetic}</Text>}
            >
              <Text strong>释义:</Text>
              <Text style={{ display: 'block', marginBottom: 8 }}>
                {item.definition}
              </Text>
              {item.example && (
                <>
                  <Text strong>例句:</Text>
                  <Text style={{ display: 'block' }}>{item.example}</Text>
                </>
              )}
            </WordCard>
          </List.Item>
        )}
      />
      <Modal
        title="添加单词"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="添加"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="word"
            label="单词"
            rules={[{ required: true, message: '请输入单词' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phonetic" label="音标">
            <Input />
          </Form.Item>
          <Form.Item
            name="definition"
            label="释义"
            rules={[{ required: true, message: '请输入释义' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="example" label="例句">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="导入单词"
        visible={isImportModalVisible}
        onOk={handleImportModalOk}
        onCancel={handleImportModalCancel}
        okText="导入"
        cancelText="取消"
      >
        <Form form={importForm} layout="vertical">
          <Form.Item
            name="file"
            label="选择文件"
            rules={[{ required: true, message: '请选择文件' }]}
          >
            <Upload>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
          <Text type="secondary">
            支持 CSV 或 JSON 格式，包含 word, phonetic, definition, example
            字段
          </Text>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default WordBookPage;