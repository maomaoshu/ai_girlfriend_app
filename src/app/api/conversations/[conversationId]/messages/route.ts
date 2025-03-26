import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createMessage, getConversationMessages } from '@/lib/db-adapters';

// 修复类型定义，适配Next.js 15
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const conversationId = context.params.conversationId;
    
    // 获取分页参数
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // 获取对话的所有消息
    const { success, data: messages, error } = await getConversationMessages(
      conversationId,
      limit,
      offset
    );
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: error || '获取消息失败' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误，请稍后再试' },
      { status: 500 }
    );
  }
}

// 发送新消息
export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    const conversationId = context.params.conversationId;
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { success: false, error: '消息内容不能为空' },
        { status: 400 }
      );
    }
    
    // 创建用户消息
    const userMessageResult = await createMessage(
      conversationId,
      'user',
      content
    );
    
    if (!userMessageResult.success) {
      return NextResponse.json(
        { success: false, error: userMessageResult.error || '发送消息失败' },
        { status: 500 }
      );
    }
    
    // 创建一个简单的回复
    const characterMessageResult = await createMessage(
      conversationId,
      'character',
      '这是一个临时回复，将在集成火山引擎API后替换为真实的AI回复。'
    );
    
    if (!characterMessageResult.success) {
      return NextResponse.json(
        { success: false, error: characterMessageResult.error || 'AI回复生成失败' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        userMessage: userMessageResult.data,
        characterMessage: characterMessageResult.data
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误，请稍后再试' },
      { status: 500 }
    );
  }
}
