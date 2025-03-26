// 数据库工具函数
import { D1Database } from '@cloudflare/workers-types';

// 通用数据库操作函数
export async function executeQuery(db: D1Database, query: string, params?: any[]) {
  try {
    const result = await db.prepare(query).bind(...(params || [])).run();
    return { success: true, data: result };
  } catch (error) {
    console.error('Database query error:', error);
    return { success: false, error: error.message };
  }
}

// 用户相关数据库操作
export async function createUser(db: D1Database, username: string, email: string, passwordHash: string) {
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  
  return executeQuery(
    db,
    'INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, username, email, passwordHash, now, now]
  );
}

export async function getUserByEmail(db: D1Database, email: string) {
  try {
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    return { success: true, data: user };
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserById(db: D1Database, id: string) {
  try {
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    return { success: true, data: user };
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, error: error.message };
  }
}

// 角色相关数据库操作
export async function getAllCharacters(db: D1Database) {
  try {
    const characters = await db.prepare('SELECT * FROM characters').all();
    return { success: true, data: characters.results };
  } catch (error) {
    console.error('Get characters error:', error);
    return { success: false, error: error.message };
  }
}

export async function getCharacterById(db: D1Database, id: string) {
  try {
    const character = await db.prepare('SELECT * FROM characters WHERE id = ?').bind(id).first();
    return { success: true, data: character };
  } catch (error) {
    console.error('Get character error:', error);
    return { success: false, error: error.message };
  }
}

// 用户角色关联相关数据库操作
export async function getUserCharacters(db: D1Database, userId: string) {
  try {
    const query = `
      SELECT uc.id, uc.user_id, uc.character_id, uc.intimacy_level, uc.created_at, uc.updated_at,
             c.name, c.description, c.avatar_url
      FROM user_characters uc
      JOIN characters c ON uc.character_id = c.id
      WHERE uc.user_id = ?
    `;
    const userCharacters = await db.prepare(query).bind(userId).all();
    return { success: true, data: userCharacters.results };
  } catch (error) {
    console.error('Get user characters error:', error);
    return { success: false, error: error.message };
  }
}

export async function createUserCharacter(db: D1Database, userId: string, characterId: string) {
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  
  return executeQuery(
    db,
    'INSERT INTO user_characters (id, user_id, character_id, intimacy_level, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, userId, characterId, 0, now, now]
  );
}

// 对话相关数据库操作
export async function createConversation(db: D1Database, userId: string, characterId: string, title: string) {
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  
  return executeQuery(
    db,
    'INSERT INTO conversations (id, user_id, character_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, userId, characterId, title, now, now]
  );
}

export async function getUserConversations(db: D1Database, userId: string) {
  try {
    const query = `
      SELECT c.*, ch.name as character_name, ch.avatar_url
      FROM conversations c
      JOIN characters ch ON c.character_id = ch.id
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC
    `;
    const conversations = await db.prepare(query).bind(userId).all();
    return { success: true, data: conversations.results };
  } catch (error) {
    console.error('Get conversations error:', error);
    return { success: false, error: error.message };
  }
}

// 消息相关数据库操作
export async function createMessage(db: D1Database, conversationId: string, senderType: 'user' | 'character', content: string) {
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  
  return executeQuery(
    db,
    'INSERT INTO messages (id, conversation_id, sender_type, content, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, conversationId, senderType, content, now]
  );
}

export async function getConversationMessages(db: D1Database, conversationId: string, limit = 50, offset = 0) {
  try {
    const query = `
      SELECT * FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
      LIMIT ? OFFSET ?
    `;
    const messages = await db.prepare(query).bind(conversationId, limit, offset).all();
    return { success: true, data: messages.results };
  } catch (error) {
    console.error('Get messages error:', error);
    return { success: false, error: error.message };
  }
}

// 记忆相关数据库操作
export async function createMemory(db: D1Database, userId: string, characterId: string, memoryType: string, content: string, importance = 1) {
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  
  return executeQuery(
    db,
    'INSERT INTO memories (id, user_id, character_id, memory_type, content, importance, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, userId, characterId, memoryType, content, importance, now, now]
  );
}

export async function getCharacterMemories(db: D1Database, userId: string, characterId: string) {
  try {
    const query = `
      SELECT * FROM memories
      WHERE user_id = ? AND character_id = ?
      ORDER BY importance DESC, created_at DESC
    `;
    const memories = await db.prepare(query).bind(userId, characterId).all();
    return { success: true, data: memories.results };
  } catch (error) {
    console.error('Get memories error:', error);
    return { success: false, error: error.message };
  }
}

// 亲密度相关数据库操作
export async function updateIntimacyLevel(db: D1Database, userCharacterId: string, newLevel: number, changeReason: string) {
  try {
    // 获取当前亲密度
    const userCharacter = await db.prepare('SELECT * FROM user_characters WHERE id = ?').bind(userCharacterId).first();
    if (!userCharacter) {
      return { success: false, error: 'User character relationship not found' };
    }
    
    const previousLevel = userCharacter.intimacy_level;
    const now = Math.floor(Date.now() / 1000);
    
    // 更新亲密度
    await db.prepare('UPDATE user_characters SET intimacy_level = ?, updated_at = ? WHERE id = ?')
      .bind(newLevel, now, userCharacterId).run();
    
    // 记录亲密度变化
    const logId = crypto.randomUUID();
    await db.prepare('INSERT INTO intimacy_logs (id, user_character_id, previous_level, new_level, change_reason, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(logId, userCharacterId, previousLevel, newLevel, changeReason, now).run();
    
    return { success: true };
  } catch (error) {
    console.error('Update intimacy error:', error);
    return { success: false, error: error.message };
  }
}
