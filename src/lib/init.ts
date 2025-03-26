// 应用初始化脚本
import * as dbAdapter from './db-adapters';

// 初始化标志
let isInitialized = false;

// 初始化函数
export async function initializeApp() {
  // 防止重复初始化
  if (isInitialized) return;
  
  try {
    console.log('Initializing application...');
    
    // 初始化数据库
    await dbAdapter.initDatabase();
    await dbAdapter.initDatabaseSchema();
    
    console.log('Application initialized successfully');
    isInitialized = true;
  } catch (error) {
    console.error('Application initialization error:', error);
    throw error;
  }
}

// 导出初始化状态
export function isAppInitialized() {
  return isInitialized;
}