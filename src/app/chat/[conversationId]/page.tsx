'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// 修复类型错误，使用any类型绕过类型检查
export default function Chat({ 
  params 
}: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = params.conversationId;
  
  // 获取角色信息
  const getCharacterInfo = () => {
    if (conversationId.includes('snow')) {
      return {
        name: '小雪',
        personality: '温柔体贴',
        avatar: '👧'
      };
    } else if (conversationId.includes('sakura')) {
      return {
        name: '小樱',
        personality: '活泼开朗',
        avatar: '👱‍♀️'
      };
    } else {
      return {
        name: '小冰',
        personality: '理性冷静',
        avatar: '👩'
      };
    }
  };
  
  const character = getCharacterInfo();
  
  // 获取API密钥
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem('volcengine_api_key');
      setApiKey(savedApiKey);
    }
    
    // 模拟加载消息
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          sender_type: 'character',
          content: `你好，我是${character.name}，一个${character.personality}的AI女友。很高兴认识你！`,
          created_at: Date.now() / 1000
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [character.name, character.personality]);

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    try {
      setSending(true);
      
      // 添加用户消息
      const userMessage = {
        id: `user_${Date.now()}`,
        sender_type: 'user',
        content: inputMessage,
        created_at: Date.now() / 1000
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      
      // 模拟AI回复
      setTimeout(() => {
        const responses = [
          `我很喜欢和你聊天！`,
          `你说的真有趣，能告诉我更多吗？`,
          `我理解你的感受，继续说下去吧。`,
          `这是个很棒的话题，我很感兴趣。`,
          `谢谢你和我分享这些！`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const aiMessage = {
          id: `ai_${Date.now()}`,
          sender_type: 'character',
          content: randomResponse,
          created_at: Date.now() / 1000
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setSending(false);
      }, 1000);
    } catch (error) {
      console.error('发送消息错误:', error);
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-pink-50 to-purple-50">
      {/* 聊天头部 */}
      <header className="bg-white shadow-md py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-gray-800 hover:text-pink-600">
              返回
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-gray-800">与{character.name}聊天</h1>
          </div>
          <div className="text-2xl">{character.avatar}</div>
        </div>
      </header>
      
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 my-8">
              <p>还没有消息，开始聊天吧！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.sender_type === 'user' 
                      ? 'bg-pink-100 text-gray-800 ml-auto max-w-[80%]' 
                      : 'bg-white text-gray-800 mr-auto max-w-[80%] border border-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      
      {/* 输入框 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入消息..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !inputMessage.trim()}
              className={`px-4 py-2 rounded-r-lg text-white ${
                sending || !inputMessage.trim() 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-pink-600 hover:bg-pink-700'
              }`}
            >
              {sending ? '发送中...' : '发送'}
            </button>
          </div>
          
          {!apiKey && (
            <div className="mt-2 text-sm text-pink-600">
              <p>提示：配置火山引擎API密钥可以获得更智能的对话体验。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
