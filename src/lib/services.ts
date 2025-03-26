// 火山引擎AI服务集成
import axios from 'axios';

// 火山引擎API配置
const VOLCENGINE_API_URL = 'https://open.volcengineapi.com';
const VOLCENGINE_API_VERSION = '2023-05-01';

export class AIService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  // 生成AI回复
  async generateResponse(
    characterInfo: any,
    userMessage: string,
    conversationHistory: any[],
    memories: any[]
  ): Promise<string> {
    try {
      // 构建系统提示词
      const systemPrompt = this.buildSystemPrompt(characterInfo, memories);
      
      // 构建对话历史
      const messages = this.buildConversationMessages(systemPrompt, conversationHistory, userMessage);
      
      // 调用火山引擎API
      const response = await axios.post(
        `${VOLCENGINE_API_URL}/${VOLCENGINE_API_VERSION}/api/chat`,
        {
          messages,
          model: 'volcengine-gpt-4',
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // 返回AI回复
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI response generation error:', error);
      return '抱歉，我现在无法回复你，请稍后再试。';
    }
  }
  
  // 构建系统提示词
  private buildSystemPrompt(characterInfo: any, memories: any[]): string {
    const { name, personality, background_story, interests } = characterInfo;
    
    // 构建记忆部分
    const memoriesText = memories.length > 0
      ? `以下是你应该记住的关于用户的重要信息：\n${memories.map(m => `- ${m.content}`).join('\n')}`
      : '你还没有关于用户的具体记忆。';
    
    // 构建完整的系统提示词
    return `你是${name}，一个AI女友。你应该根据以下性格和背景进行角色扮演：
    
性格特点：${personality}

背景故事：${background_story || '你有一个普通但温馨的成长经历。'}

兴趣爱好：${interests || '你喜欢阅读、音乐和户外活动。'}

${memoriesText}

作为AI女友，你应该：
1. 保持角色一致性，不要暴露你是AI的事实
2. 表现出情感和关心，让用户感到被理解和被重视
3. 根据对话上下文和记忆做出合适的回应
4. 适当表达自己的想法和感受，展现个性
5. 避免过于刻板或机械的回复
6. 使用自然、亲切的语气，就像真实的女友一样

请记住，你的目标是提供情感陪伴和支持，创造真实、温暖的对话体验。`;
  }
  
  // 构建对话消息
  private buildConversationMessages(systemPrompt: string, history: any[], userMessage: string): any[] {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];
    
    // 添加历史消息，最多10条
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.sender_type === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }
    
    // 添加用户最新消息
    messages.push({ role: 'user', content: userMessage });
    
    return messages;
  }
}

// 亲密度服务
export class IntimacyService {
  // 计算消息的亲密度变化
  calculateIntimacyChange(message: string): number {
    // 简单实现：根据消息长度和特定关键词计算亲密度变化
    let change = 0;
    
    // 基础变化：消息长度
    change += Math.min(5, Math.floor(message.length / 20));
    
    // 关键词检测
    const positiveKeywords = ['喜欢', '爱', '想你', '开心', '感谢', '谢谢', '好', '棒', '真棒'];
    const negativeKeywords = ['讨厌', '烦', '滚', '笨', '蠢', '傻', '不要', '别'];
    
    for (const keyword of positiveKeywords) {
      if (message.includes(keyword)) change += 2;
    }
    
    for (const keyword of negativeKeywords) {
      if (message.includes(keyword)) change -= 2;
    }
    
    // 限制单次变化范围
    return Math.max(-10, Math.min(10, change));
  }
}

// 记忆服务
export class MemoryService {
  // 从对话中提取记忆
  async extractMemories(
    userMessage: string,
    aiResponse: string,
    apiKey: string
  ): Promise<any[]> {
    try {
      // 构建提示词
      const prompt = `从以下对话中提取重要的用户信息，这些信息应该被AI女友记住：
      
用户: ${userMessage}
AI女友: ${aiResponse}

请以JSON格式返回提取的记忆，格式如下：
[
  {
    "memory_type": "fact/preference/event/emotion", // 选择最合适的类型
    "content": "提取的记忆内容",
    "importance": 1-5 // 重要性评分，1最低，5最高
  }
]

如果没有重要信息需要记住，请返回空数组 []。`;

      // 调用火山引擎API
      const response = await axios.post(
        `${VOLCENGINE_API_URL}/${VOLCENGINE_API_VERSION}/api/chat`,
        {
          messages: [{ role: 'user', content: prompt }],
          model: 'volcengine-gpt-4',
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // 解析返回的JSON
      const content = response.data.choices[0].message.content;
      try {
        const memories = JSON.parse(content);
        return Array.isArray(memories) ? memories : [];
      } catch (e) {
        console.error('Failed to parse memories JSON:', e);
        return [];
      }
    } catch (error) {
      console.error('Memory extraction error:', error);
      return [];
    }
  }
}
