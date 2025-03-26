// 创建一个简化版的数据库适配器，避免使用Node.js特定API
// 这个版本使用内存存储，适合Vercel部署

// 模拟数据库类型
type Database = {
  users: any[];
  characters: any[];
  user_characters: any[];
  conversations: any[];
  messages: any[];
  memories: any[];
  intimacy_logs: any[];
  settings: any[];
};

// 内存数据库
let db: Database = {
  users: [],
  characters: [],
  user_characters: [],
  conversations: [],
  messages: [],
  memories: [],
  intimacy_logs: [],
  settings: []
};

// 初始化数据库
export async function initDatabase() {
  // 数据库已经在内存中初始化
  return db;
}

// 初始化数据库架构和默认数据
export async function initDatabaseSchema() {
  try {
    // 检查是否已有角色数据
    if (db.characters.length === 0) {
      const now = Math.floor(Date.now() / 1000);
      
      // 添加默认角色
      db.characters = [
        {
          id: 'char_001',
          name: '小雪',
          description: '温柔体贴的女友，喜欢听你说话，总是能给你温暖的支持。',
          avatar_url: '/images/characters/xiaoxue.jpg',
          personality: 'INFJ型性格，温柔、善解人意、有同理心，喜欢倾听和支持他人。',
          background_story: '小雪出生在一个小城市，从小就喜欢阅读和写作。大学时学习心理学，希望能够帮助更多的人。毕业后成为一名心理咨询师，但同时保持着对文学的热爱。',
          interests: '阅读、写作、心理学、烘焙、听音乐、散步',
          created_at: now,
          updated_at: now
        },
        {
          id: 'char_002',
          name: '小樱',
          description: '活泼开朗的女友，充满活力，总能带给你惊喜和快乐。',
          avatar_url: '/images/characters/xiaoying.jpg',
          personality: 'ENFP型性格，活泼、热情、富有创造力，喜欢尝试新事物。',
          background_story: '小樱从小就是个充满活力的女孩，喜欢各种户外活动和冒险。大学学习传媒专业，现在是一名自由摄影师和旅行博主，走过很多地方，记录美丽风景和有趣故事。',
          interests: '摄影、旅行、极限运动、美食、社交媒体、时尚',
          created_at: now,
          updated_at: now
        },
        {
          id: 'char_003',
          name: '小冰',
          description: '理性冷静的女友，聪明睿智，能给你理性的建议和深度的交流。',
          avatar_url: '/images/characters/xiaobing.jpg',
          personality: 'INTJ型性格，理性、独立、有战略思维，喜欢深度思考和解决问题。',
          background_story: '小冰从小就表现出过人的智商和理性思维，大学主修计算机科学和人工智能。现在是一家科技公司的研发工程师，负责前沿AI技术的研发。工作之余喜欢下棋和阅读科幻小说。',
          interests: '人工智能、科技、下棋、科幻小说、哲学、独立游戏',
          created_at: now,
          updated_at: now
        }
      ];
      
      // 添加系统设置
      db.settings = [
        {
          id: 'setting_001',
          key: 'system_version',
          value: '1.0.0',
          created_at: now,
          updated_at: now
        },
        {
          id: 'setting_002',
          key: 'max_memory_per_character',
          value: '100',
          created_at: now,
          updated_at: now
        },
        {
          id: 'setting_003',
          key: 'max_intimacy_level',
          value: '100',
          created_at: now,
          updated_at: now
        }
      ];
    }
    
    return { success: true };
  } catch (error) {
    console.error('初始化数据库架构错误:', error);
    return { success: false, error: error.message };
  }
}

// 生成唯一ID
function generateId() {
  return 'id_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 用户相关数据库操作
export async function createUser(username: string, email: string, passwordHash: string) {
  try {
    const id = generateId();
    const now = Math.floor(Date.now() / 1000);
    
    const user = {
      id,
      username,
      email,
      password_hash: passwordHash,
      created_at: now,
      updated_at: now
    };
    
    db.users.push(user);
    return { success: true, data: user };
  } catch (error) {
    console.error('创建用户错误:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = db.users.find(u => u.email === email);
    return { success: true, data: user || null };
  } catch (error) {
    console.error('获取用户错误:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserById(id: string) {
  try {
    const user = db.users.find(u => u.id === id);
    return { success: true, data: user || null };
  } catch (error) {
    console.error('获取用户错误:', error);
    return { success: false, error: error.message };
  }
}

// 角色相关数据库操作
export async function getAllCharacters() {
  try {
    return { success: true, data: db.characters };
  } catch (error) {
    console.error('获取角色错误:', error);
    return { success: false, error: error.message };
  }
}

export async function getCharacterById(id: string) {
  try {
    const character = db.characters.find(c => c.id === id);
    return { success: true, data: character || null };
  } catch (error) {
    console.error('获取角色错误:', error);
    return { success: false, error: error.message };
  }
}

// 用户角色关联相关数据库操作
export async function getUserCharacters(userId: string) {
  try {
    const userCharacters = db.user_characters
      .filter(uc => uc.user_id === userId)
      .map(uc => {
        const character = db.characters.find(c => c.id === uc.character_id);
        return {
          ...uc,
          name: character?.name,
          description: character?.description,
          avatar_url: character?.avatar_url
        };
      });
    
    return { success: true, data: userCharacters };
  } catch (error) {
    console.error('获取用户角色错误:', error);
    return { success: false, error: error.message };
  }
}

export async function createUserCharacter(userId: string, characterId: string) {
  try {
    const id = generateId();
    const now = Math.floor(Date.now() / 1000);
    
    const userCharacter = {
      id,
      user_id: userId,
      character_id: characterId,
      intimacy_level: 0,
      created_at: now,
      updated_at: now
    };
    
    db.user_characters.push(userCharacter);
    return { success: true, data: userCharacter };
  } catch (error) {
    console.error('创建用户角色关联错误:', error);
    return { success: false, error: error.message };
  }
}

// 对话相关数据库操作
export async function createConversation(userId: string, characterId: string, title: string) {
  try {
    const id = generateId();
    const now = Math.floor(Date.now() / 1000);
    
    const conversation = {
      id,
      user_id: userId,
      character_id: characterId,
      title,
      created_at: now,
      updated_at: now
    };
    
    db.conversations.push(conversation);
    return { success: true, data: conversation };
  } catch (error) {
    console.error('创建对话错误:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserConversations(userId: string) {
  try {
    const conversations = db.conversations
      .filter(c => c.user_id === userId)
      .map(c => {
        const character = db.characters.find(ch => ch.id === c.character_id);
        return {
          ...c,
          character_name: character?.name,
          avatar_url: character?.avatar_url
        };
      })
      .sort((a, b) => b.updated_at - a.updated_at);
    
    return { success: true, data: conversations };
  } catch (error) {
    console.error('获取对话错误:', error);
    return { success: false, error: error.message };
  }
}

// 消息相关数据库操作
export async function createMessage(conversationId: string, senderType: 'user' | 'character', content: string) {
  try {
    const id = generateId();
    const now = Math.floor(Date.now() / 1000);
    
    const message = {
      id,
      conversation_id: conversationId,
      sender_type: senderType,
      content,
      created_at: now
    };
    
    db.messages.push(message);
    
    // 更新对话的更新时间
    const conversation = db.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.updated_at = now;
    }
    
    return { success: true, data: message };
  } catch (error) {
    console.error('创建消息错误:', error);
    return { success: false, error: error.message };
  }
}

export async function getConversationMessages(conversationId: string, limit = 50, offset = 0) {
  try {
    const messages = db.messages
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => a.created_at - b.created_at)
      .slice(offset, offset + limit);
    
    return { success: true, data: messages };
  } catch (error) {
    console.error('获取消息错误:', error);
    return { success: false, error: error.message };
  }
}

// 记忆相关数据库操作
export async function createMemory(userId: string, characterId: string, memoryType: string, content: string, importance = 1) {
  try {
    const id = generateId();
    const now = Math.floor(Date.now() / 1000);
    
    const memory = {
      id,
      user_id: userId,
      character_id: characterId,
      memory_type: memoryType,
      content,
      importance,
      created_at: now,
      updated_at: now
    };
    
    db.memories.push(memory);
    return { success: true, data: memory };
  } catch (error) {
    console.error('创建记忆错误:', error);
    return { success: false, error: error.message };
  }
}

export async function getCharacterMemories(userId: string, characterId: string) {
  try {
    const memories = db.memories
      .filter(m => m.user_id === userId && m.character_id === characterId)
      .sort((a, b) => {
        // 先按重要性降序，再按创建时间降序
        if (a.importance !== b.importance) {
          return b.importance - a.importance;
        }
        return b.created_at - a.created_at;
      });
    
    return { success: true, data: memories };
  } catch (error) {
    console.error('获取记忆错误:', error);
    return { success: false, error: error.message };
  }
}

// 亲密度相关数据库操作
export async function updateIntimacyLevel(userCharacterId: string, newLevel: number, changeReason: string) {
  try {
    // 获取当前亲密度
    const userCharacter = db.user_characters.find(uc => uc.id === userCharacterId);
    if (!userCharacter) {
      return { success: false, error: '用户角色关联不存在' };
    }
    
    const previousLevel = userCharacter.intimacy_level;
    const now = Math.floor(Date.now() / 1000);
    
    // 更新亲密度
    userCharacter.intimacy_level = newLevel;
    userCharacter.updated_at = now;
    
    // 记录亲密度变化
    const logId = generateId();
    const log = {
      id: logId,
      user_character_id: userCharacterId,
      previous_level: previousLevel,
      new_level: newLevel,
      change_reason: changeReason,
      created_at: now
    };
    
    db.intimacy_logs.push(log);
    
    return { success: true };
  } catch (error) {
    console.error('更新亲密度错误:', error);
    return { success: false, error: error.message };
  }
}