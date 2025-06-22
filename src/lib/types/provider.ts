/**
 * AIプロバイダの種類を定義する列挙型
 */
export enum ProviderType {
  Anthropic = 'anthropic',
  OpenAI = 'openai',
  Gemini = 'gemini'
}

/**
 * AIモデルの情報を表すインターフェース
 */
export interface Model {
  /** モデルの一意な識別子 */
  id: string;
  /** モデルの表示名 */
  name: string;
  /** モデルの説明 */
  description?: string;
}

/**
 * AIプロバイダの情報を表すインターフェース
 */
export interface Provider {
  /** プロバイダの種類 */
  type: ProviderType;
  /** プロバイダの表示名 */
  name: string;
  /** プロバイダが提供するモデル一覧 */
  models: Model[];
}

/**
 * 選択されたプロバイダとモデルの組み合わせを表すインターフェース
 */
export interface SelectedProvider {
  /** 選択されたプロバイダ */
  provider: ProviderType;
  /** 選択されたモデル */
  model: string;
}
