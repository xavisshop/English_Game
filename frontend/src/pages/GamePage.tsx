import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, message, Progress } from 'antd';
import { PlayCircleOutlined, RedoOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

// 使用百词斩样式的容器
const PageContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const GameCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  
  .ant-card-head {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 16px 16px 0 0;
  }
`;

const WordDisplay = styled.div`
  font-size: 36px;
  text-align: center;
  margin: 24px 0;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 24px 0;
`;

const OptionButton = styled(Button)`
  height: 80px;
  font-size: 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #333;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const GamePage = () => {
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Mock data for words
  const mockWords = [
    { word: 'apple', definition: '苹果' },
    { word: 'banana', definition: '香蕉' },
    { word: 'orange', definition: '橙子' },
    { word: 'grape', definition: '葡萄' },
    { word: 'strawberry', definition: '草莓' },
  ];

  const startGame = () => {
    setScore(0);
    setTotalWords(0);
    setGameOver(false);
    getNextWord();
  };

  const getNextWord = () => {
    if (totalWords >= mockWords.length) {
      setGameOver(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * mockWords.length);
    const word = mockWords[randomIndex];
    setCurrentWord(word);
    setTotalWords(totalWords + 1);

    // Generate options
    const otherWords = mockWords.filter((_, index) => index !== randomIndex);
    const randomOptions: { word: string; definition: string }[] = [];
    while (randomOptions.length < 3) {
      const randomOptionIndex = Math.floor(Math.random() * otherWords.length);
      const option = otherWords[randomOptionIndex];
      if (!randomOptions.includes(option)) {
        randomOptions.push(option);
      }
    }

    // Insert correct answer at random position
    const correctPosition = Math.floor(Math.random() * 4);
    const allOptions = [...randomOptions];
    allOptions.splice(correctPosition, 0, word);
    setOptions(allOptions);
  };

  const handleOptionSelect = (selectedOption: any) => {
    if (selectedOption.word === currentWord.word) {
      message.success('正确!');
      setScore(score + 1);
    } else {
      message.error(`错误! 正确答案是: ${currentWord.definition}`);
    }

    // Move to next word after a short delay
    setTimeout(() => {
      getNextWord();
    }, 1000);
  };

  const restartGame = () => {
    startGame();
  };

  return (
    <PageContainer>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24, color: '#333' }}>
        单词游戏
      </Title>
      {!currentWord && !gameOver && (
        <GameCard>
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>准备开始单词游戏</Title>
            <Text>测试你对单词的掌握程度</Text>
            <div style={{ marginTop: 24 }}>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                size="large"
                onClick={startGame}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderColor: 'transparent',
                  borderRadius: '50px',
                  padding: '0 40px',
                  height: '50px'
                }}
              >
                开始游戏
              </Button>
            </div>
          </div>
        </GameCard>
      )}
      {currentWord && !gameOver && (
        <GameCard title={`第 ${totalWords} 个单词`}>
          <div style={{ textAlign: 'center' }}>
            <Progress
              percent={Math.round((score / totalWords) * 100)}
              status="active"
              strokeColor={{
                '0%': '#667eea',
                '100%': '#764ba2',
              }}
              style={{ marginTop: 12 }}
            />
          </div>
          <WordDisplay>
            {currentWord.word}
          </WordDisplay>
          <OptionsContainer>
            {options.map((option, index) => (
              <OptionButton
                key={index}
                onClick={() => handleOptionSelect(option)}
              >
                {option.definition}
              </OptionButton>
            ))}
          </OptionsContainer>
        </GameCard>
      )}
      {gameOver && (
        <GameCard title="游戏结束">
          <div style={{ textAlign: 'center' }}>
            <Title level={3}>游戏结束!</Title>
            <Text>你的得分: {score} / {mockWords.length}</Text>
            <Text style={{ display: 'block', marginTop: 12 }}>
              正确率: {Math.round((score / mockWords.length) * 100)}%
            </Text>
            <div style={{ marginTop: 24 }}>
              <Button
                type="primary"
                icon={<RedoOutlined />}
                size="large"
                onClick={restartGame}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderColor: 'transparent',
                  borderRadius: '50px',
                  padding: '0 40px',
                  height: '50px'
                }}
              >
                再玩一次
              </Button>
            </div>
          </div>
        </GameCard>
      )}
    </PageContainer>
  );
};

export default GamePage;