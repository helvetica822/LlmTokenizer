import type { Provider } from '$lib/types/provider';
import { ProviderType } from '$lib/types/provider';

/**
 * Anthropic APIのベースURL
 */
export const ANTHROPIC_API_BASE_URL = 'https://api.anthropic.com/v1';

/**
 * OpenAI APIのベースURL
 */
export const OPENAI_API_BASE_URL = 'https://api.openai.com/v1';

/**
 * Gemini APIのベースURL
 */
export const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * 利用可能なプロバイダとモデルの定義
 */
export const PROVIDERS: Provider[] = [
  {
    type: ProviderType.Anthropic,
    name: 'Anthropic',
    models: [
      {
        id: 'claude-opus-4-20250514',
        name: 'Claude Opus 4',
        description: '最新の最高性能モデル'
      },
      {
        id: 'claude-sonnet-4-20250514',
        name: 'Claude Sonnet 4',
        description: '最新の高性能モデル'
      },
      {
        id: 'claude-3-7-sonnet-20250219',
        name: 'Claude Sonnet 3.7',
        description: '改良された高性能モデル'
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: '高性能モデル'
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        description: '高速で効率的なモデル'
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: '高性能モデル'
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: '高速なモデル'
      }
    ]
  },
  {
    type: ProviderType.OpenAI,
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: '最新の高性能マルチモーダルモデル'
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: '高速で効率的なマルチモーダルモデル'
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: '高性能で高速なモデル'
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        description: '高性能な言語モデル'
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: '高速で効率的なモデル'
      }
    ]
  },
  {
    type: ProviderType.Gemini,
    name: 'Google',
    models: [
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: '最新の高速モデル'
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: '高性能なマルチモーダルモデル'
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: '高速で効率的なモデル'
      }
    ]
  }
];

/**
 * デフォルトのタイムアウト時間（ミリ秒）
 */
export const DEFAULT_TIMEOUT = 30000;

/**
 * 最大入力文字数
 */
export const MAX_INPUT_LENGTH = 100000;
