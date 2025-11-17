import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WordBookPage from './pages/WordBookPage';
import GamePage from './pages/GamePage';
import ClassesPage from './pages/ClassesPage';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wordbook/:id" element={<WordBookPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </div>
    </ConfigProvider>
  );
}

export default App;