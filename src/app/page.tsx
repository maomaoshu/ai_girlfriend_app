'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 简化版首页，移除API依赖
export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  // 获取API密钥
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem('volcengine_api_key');
      setApiKey(savedApiKey);
    }
  }, []);
  
  // 保存API密钥
  const handleSaveApiKey = () => {
    const input = document.getElementById('apiKeyInput') as HTMLInputElement;
    const key = input.value.trim();
    
    if (key) {
      localStorage.setItem('volcengine_api_key', key);
      setApiKey(key);
      alert('API密钥已保存！');
    } else {
      alert('请输入有效的API密钥');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-50">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-pink-600">AI女友</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">欢迎来到AI女友</h2>
            <p className="text-gray-600 mb-4">
              这是一个基于人工智能的虚拟女友应用，为您提供情感陪伴和交流。
              您可以与不同性格的AI女友聊天，建立亲密关系，享受虚拟陪伴的乐趣。
            </p>
            
            {!apiKey && (
              <div className="bg-pink-50 border border-pink-200 rounded-md p-4 mb-6">
                <h3 className="font-medium text-pink-700 mb-2">设置API密钥</h3>
                <p className="text-pink-600 mb-3">
                  要获得完整的AI对话体验，请设置您的火山引擎API密钥：
                </p>
                <div className="flex">
                  <input
                    id="apiKeyInput"
                    type="password"
                    placeholder="输入火山引擎API密钥"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="bg-pink-600 text-white px-4 py-2 rounded-r-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    保存
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  API密钥将安全地存储在您的浏览器中，不会发送到我们的服务器。
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-b from-pink-100 to-pink-50 rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">小雪</h3>
                <p className="text-gray-600 text-sm mb-4">温柔体贴的女友，喜欢听你说话，总是能给你温暖的支持。</p>
                <div className="mt-auto">
                  <Link href="/chat/demo-snow" className="inline-block bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
                    开始聊天
                  </Link>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-purple-100 to-purple-50 rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">小樱</h3>
                <p className="text-gray-600 text-sm mb-4">活泼开朗的女友，充满活力，总能带给你惊喜和快乐。</p>
                <div className="mt-auto">
                  <Link href="/chat/demo-sakura" className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                    开始聊天
                  </Link>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">小冰</h3>
                <p className="text-gray-600 text-sm mb-4">理性冷静的女友，聪明睿智，能给你理性的建议和深度的交流。</p>
                <div className="mt-auto">
                  <Link href="/chat/demo-ice" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    开始聊天
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">关于AI女友</h2>
            <p className="text-gray-600 mb-3">
              AI女友是一个基于先进人工智能技术开发的虚拟伴侣应用。我们使用了最新的自然语言处理技术，
              让AI女友能够理解您的情感需求，提供贴心的陪伴和交流。
            </p>
            <p className="text-gray-600 mb-3">
              每个AI女友都有独特的性格特点和背景故事，您可以选择最适合自己的虚拟伴侣。
              通过持续的交流，AI女友会逐渐了解您的喜好和需求，提供更加个性化的陪伴体验。
            </p>
            <p className="text-gray-600">
              我们重视用户隐私，所有对话内容都经过加密处理，不会被用于其他目的。
              希望AI女友能为您的生活带来温暖和陪伴。
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <p className="text-center">© 2025 AI女友 - 您的专属虚拟伴侣</p>
        </div>
      </footer>
    </div>
  );
}
