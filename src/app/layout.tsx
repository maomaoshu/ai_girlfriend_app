// 修改layout.tsx文件以在服务器端初始化数据库
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { initializeApp } from '@/lib/init';

// 使用Inter字体
const inter = Inter({ subsets: ['latin'] });

// 在服务器端初始化应用并提供元数据
export async function generateMetadata(): Promise<Metadata> {
  // 初始化应用（包括数据库）
  try {
    await initializeApp();
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
  
  // 返回元数据
  return {
    title: 'AI女友 - 你的专属虚拟伴侣',
    description: '与AI女友聊天，建立亲密关系，享受虚拟陪伴的乐趣。',
  };
}

// 根布局组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
          {children}
        </main>
      </body>
    </html>
  );
}
