import type { TokenCountRequest, TokenCountResponse, ImageData } from '$lib/types/tokenCount';
import { DEFAULT_TIMEOUT } from '$lib/utils/constants';

/**
 * Gemini APIエラークラス
 */
class GeminiApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

/**
 * Gemini API用のコンテンツ部分を表すインターフェース
 */
interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

/**
 * Gemini API用のコンテンツを表すインターフェース
 */
interface GeminiContent {
  parts: GeminiPart[];
}

/**
 * Gemini APIのトークンカウントリクエストを表すインターフェース
 */
interface GeminiTokenCountRequest {
  contents: GeminiContent[];
}

/**
 * Gemini APIのトークンカウントレスポンスを表すインターフェース
 */
interface GeminiTokenCountResponse {
  totalTokens: number;
}

/**
 * Gemini APIを使用してトークン数をカウントします。
 * @param request - トークンカウントリクエスト
 * @returns トークンカウント結果
 * @throws GeminiApiError - API呼び出しに失敗した場合
 */
export async function countTokensWithGemini(request: TokenCountRequest): Promise<TokenCountResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Gemini API key is not configured');
    throw new GeminiApiError('Gemini APIキーが設定されていません');
  }

  // Gemini API用のコンテンツを構築
  const parts: GeminiPart[] = [];
  
  // テキストがある場合は追加
  if (request.text && request.text.trim()) {
    parts.push({
      text: request.text
    });
  }
  
  // 画像がある場合は追加
  if (request.images && request.images.length > 0) {
    console.log(`Adding ${request.images.length} images to Gemini request`);
    request.images.forEach((image, index) => {
      console.log(`Image ${index + 1}: type=${image.mediaType}, data length=${image.data.length}`);
      parts.push({
        inlineData: {
          mimeType: image.mediaType,
          data: image.data
        }
      });
    });
  }

  // コンテンツが空の場合はエラー
  if (parts.length === 0) {
    throw new GeminiApiError('テキストまたは画像を入力してください');
  }

  const geminiRequest: GeminiTokenCountRequest = {
    contents: [
      {
        parts: parts
      }
    ]
  };

  console.log(`Sending Gemini request with ${parts.length} parts to model: ${request.model}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    // プロキシ経由でAPIを呼び出し
    const response = await fetch(`/api/gemini/models/${request.model}:countTokens?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(geminiRequest),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error(`Gemini API error: ${errorMessage}`);
      throw new GeminiApiError(
        `トークンカウントに失敗しました: ${errorMessage}`,
        response.status,
        errorData.error?.code
      );
    }

    const data: GeminiTokenCountResponse = await response.json();
    
    return {
      inputTokens: data.totalTokens || 0,
      totalTokens: data.totalTokens || 0
    };

  } catch (error) {
    if (error instanceof GeminiApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Gemini API request timeout');
        throw new GeminiApiError('リクエストがタイムアウトしました');
      }
      
      console.error(`Gemini API request failed: ${error.message}`);
      throw new GeminiApiError(`APIリクエストに失敗しました: ${error.message}`);
    }
    
    console.error('Unknown error occurred during Gemini API request');
    throw new GeminiApiError('不明なエラーが発生しました');
  }
}

/**
 * APIキーが設定されているかチェックします。
 * @returns APIキーが設定されている場合はtrue
 */
export function isGeminiApiKeyConfigured(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}
