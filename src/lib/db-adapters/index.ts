// 数据库适配器索引文件
// 在Vercel环境中使用内存数据库适配器，更适合无服务器环境
import * as MemoryAdapter from './memory-adapter';

// 导出当前使用的数据库适配器
export default MemoryAdapter;

// 导出所有数据库操作函数
export const initDatabase = MemoryAdapter.initDatabase;
export const initDatabaseSchema = MemoryAdapter.initDatabaseSchema;
export const createUser = MemoryAdapter.createUser;
export const getUserByEmail = MemoryAdapter.getUserByEmail;
export const getUserById = MemoryAdapter.getUserById;
export const getAllCharacters = MemoryAdapter.getAllCharacters;
export const getCharacterById = MemoryAdapter.getCharacterById;
export const getUserCharacters = MemoryAdapter.getUserCharacters;
export const createUserCharacter = MemoryAdapter.createUserCharacter;
export const createConversation = MemoryAdapter.createConversation;
export const getUserConversations = MemoryAdapter.getUserConversations;
export const createMessage = MemoryAdapter.createMessage;
export const getConversationMessages = MemoryAdapter.getConversationMessages;
export const createMemory = MemoryAdapter.createMemory;
export const getCharacterMemories = MemoryAdapter.getCharacterMemories;
export const updateIntimacyLevel = MemoryAdapter.updateIntimacyLevel;