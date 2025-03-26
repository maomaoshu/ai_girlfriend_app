'use client';

import { useState, useEffect } from 'react';
import { AIService } from '@/lib/services';

// 环境变量配置组件
export default function VolcengineConfig() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 加载已保存的API密钥
  useEffect(() => {
    const savedApiKey = localStorage.getItem('volcengine_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    setLoading(false);
  }, []);

  // 保存API密钥
  const handleSave = () => {
    if (!apiKey) {
      setError('请输入API密钥');
      return;
    }

    try {
      // 测试API密钥是否有效
      const aiService = new AIService(apiKey);
      
      // 保存到本地存储
      localStorage.setItem('volcengine_api_key', apiKey);
      setSaved(true);
      setError('');
      
      // 3秒后重置保存状态
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error('Save API key error:', err);
      setError('保存API密钥失败');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">火山引擎API配置</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
          API密钥已保存成功！
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
          API密钥
        </label>
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          placeholder="输入火山引擎API密钥"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          保存
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>注意：API密钥将保存在浏览器本地存储中，仅用于与火山引擎API通信。</p>
        <p className="mt-2">
          如需获取火山引擎API密钥，请访问：
          <a 
            href="https://www.volcengine.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700"
          >
            火山引擎官网
          </a>
        </p>
      </div>
    </div>
  );
}
