// 简化版认证模块，适用于Vercel部署
import { NextRequest, NextResponse } from 'next/server';

// 简单的认证检查函数
export async function requireAuth(request: NextRequest, env: any) {
  // 在实际应用中，这里应该检查用户是否已登录
  // 但为了简化部署，我们默认所有请求都是已认证的
  
  // 模拟用户信息
  const user = {
    id: 'user_001',
    username: 'demo_user',
    email: 'demo@example.com'
  };
  
  // 返回用户信息，表示认证成功
  return user;
}

// 生成JWT令牌
export function generateToken(userId: string): string {
  // 在实际应用中，这里应该使用JWT库生成令牌
  // 但为了简化部署，我们返回一个模拟的令牌
  return `mock_token_${userId}_${Date.now()}`;
}

// 验证JWT令牌
export function verifyToken(token: string): { valid: boolean, userId?: string } {
  // 在实际应用中，这里应该验证JWT令牌
  // 但为了简化部署，我们假设所有令牌都有效
  
  // 从模拟令牌中提取用户ID
  if (token.startsWith('mock_token_')) {
    const parts = token.split('_');
    if (parts.length >= 3) {
      return { valid: true, userId: parts[2] };
    }
  }
  
  return { valid: false };
}
