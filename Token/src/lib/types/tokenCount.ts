/**
 * 画像データを表すインターフェース
 */
export interface ImageData {
  /** 画像のbase64データ */
  data: string;
  /** 画像のMIMEタイプ */
  mediaType: string;
}

/**
 * Anthropic API用の画像ソースデータ
 */
export interface AnthropicImageSource {
  /** base64タイプ */
  type: 'base64';
  /** 画像のMIMEタイプ */
  media_type: string;
  /** 画像のbase64データ */
  data: string;
}

/**
 * メッセージコンテンツの種類
 */
export type MessageContent = 
  | { type: 'text'; text: string }
  | { type: 'image'; source: AnthropicImageSource };

/**
 * トークンカウントのリクエストを表すインターフェース
 */
export interface TokenCountRequest {
  /** カウント対象のテキスト */
  text?: string;
  /** カウント対象の画像 */
  images?: ImageData[];
  /** 使用するモデル */
  model: string;
}

/**
 * トークンカウントのレスポンスを表すインターフェース
 */
export interface TokenCountResponse {
  /** 入力トークン数 */
  inputTokens: number;
  /** 合計トークン数 */
  totalTokens: number;
}

/**
 * APIエラーを表すインターフェース
 */
export interface ApiError {
  /** エラーメッセージ */
  message: string;
  /** HTTPステータスコード */
  status?: number;
  /** エラーコード */
  code?: string;
}

/**
 * アプリケーションの状態を表すインターフェース
 */
export interface AppState {
  /** 選択されたプロバイダ */
  selectedProvider: string | null;
  /** 選択されたモデル */
  selectedModel: string | null;
  /** 入力テキスト */
  inputText: string;
  /** 入力画像 */
  inputImages: ImageData[];
  /** 画像URL */
  imageUrl: string;
  /** ローディング状態 */
  isLoading: boolean;
  /** トークンカウント結果 */
  tokenCount: TokenCountResponse | null;
  /** エラー情報 */
  error: string | null;
}
