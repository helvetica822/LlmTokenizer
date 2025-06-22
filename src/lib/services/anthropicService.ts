import type { TokenCountRequest, TokenCountResponse, ApiError, MessageContent, AnthropicImageSource } from '$lib/types/tokenCount';
import { DEFAULT_TIMEOUT } from '$lib/utils/constants';

/**
 * Anthropic APIエラークラス
 */
class AnthropicApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'AnthropicApiError';
  }
}

/**
 * Anthropic APIを使用してトークン数をカウントします。
 * @param request - トークンカウントリクエスト
 * @returns トークンカウント結果
 * @throws AnthropicApiError - API呼び出しに失敗した場合
 */
export async function countTokensWithAnthropic(request: TokenCountRequest): Promise<TokenCountResponse> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('Anthropic API key is not configured');
    throw new AnthropicApiError('Anthropic APIキーが設定されていません');
  }

  // メッセージコンテンツを構築
  const content: MessageContent[] = [];
  
  // テキストがある場合は追加
  if (request.text && request.text.trim()) {
    content.push({
      type: 'text',
      text: request.text
    });
  }
  
  // 画像がある場合は追加
  if (request.images && request.images.length > 0) {
    console.log(`Adding ${request.images.length} images to request`);
    request.images.forEach((image, index) => {
      console.log(`Image ${index + 1}: type=${image.mediaType}, data length=${image.data.length}`);
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: image.mediaType,
          data: image.data
        }
      });
    });
  }

  // コンテンツが空の場合はエラー
  if (content.length === 0) {
    throw new AnthropicApiError('テキストまたは画像を入力してください');
  }

  console.log(`Sending request with ${content.length} content items to model: ${request.model}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    // プロキシ経由でAPIを呼び出し
    const response = await fetch(`/api/anthropic/v1/messages/count_tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          {
            role: 'user',
            content: content
          }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error(`Anthropic API error: ${errorMessage}`);
      throw new AnthropicApiError(
        `トークンカウントに失敗しました: ${errorMessage}`,
        response.status,
        errorData.error?.type
      );
    }

    const data = await response.json();
    
    return {
      inputTokens: data.input_tokens || 0,
      totalTokens: data.input_tokens || 0
    };

  } catch (error) {
    if (error instanceof AnthropicApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Anthropic API request timeout');
        throw new AnthropicApiError('リクエストがタイムアウトしました');
      }
      
      console.error(`Anthropic API request failed: ${error.message}`);
      throw new AnthropicApiError(`APIリクエストに失敗しました: ${error.message}`);
    }
    
    console.error('Unknown error occurred during Anthropic API request');
    throw new AnthropicApiError('不明なエラーが発生しました');
  }
}

/**
 * URLから画像を取得してbase64に変換します。
 * @param url - 画像URL
 * @returns base64エンコードされた画像データ
 * @throws AnthropicApiError - 画像の取得に失敗した場合
 */
export async function fetchImageAsBase64(url: string): Promise<{ data: string; mediaType: string }> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('指定されたURLは画像ではありません');
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    return {
      data: base64,
      mediaType: contentType
    };
    
  } catch (error) {
    console.error(`Failed to fetch image from URL: ${url}`, error);
    
    if (error instanceof Error) {
      throw new AnthropicApiError(`画像の取得に失敗しました: ${error.message}`);
    }
    
    throw new AnthropicApiError('画像の取得に失敗しました');
  }
}

/**
 * ファイルをbase64に変換します。
 * @param file - 画像ファイル
 * @returns base64エンコードされた画像データ
 * @throws AnthropicApiError - ファイルの変換に失敗した場合
 */
export async function convertFileToBase64(file: File): Promise<{ data: string; mediaType: string }> {
  console.log(`Converting file to base64: ${file.name}, type: ${file.type}, size: ${file.size}`);
  
  // ファイルタイプの検証
  if (!file.type.startsWith('image/')) {
    throw new AnthropicApiError(`サポートされていないファイル形式です: ${file.type}`);
  }
  
  // ファイルサイズの制限（20MB）
  const MAX_FILE_SIZE = 20 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new AnthropicApiError(`ファイルサイズが大きすぎます: ${Math.round(file.size / 1024 / 1024)}MB（最大20MB）`);
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const result = reader.result as string;
        if (!result || typeof result !== 'string') {
          throw new Error('ファイルの読み込み結果が無効です');
        }
        
        const base64Data = result.split(',')[1]; // data:image/jpeg;base64, の部分を除去
        if (!base64Data) {
          throw new Error('base64データの抽出に失敗しました');
        }
        
        console.log(`File converted successfully: ${base64Data.length} characters`);
        
        resolve({
          data: base64Data,
          mediaType: file.type
        });
      } catch (error) {
        console.error('File conversion error:', error);
        reject(new AnthropicApiError(`ファイルの変換に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`));
      }
    };
    
    reader.onerror = (event) => {
      console.error('FileReader error:', event);
      reject(new AnthropicApiError('ファイルの読み込みに失敗しました'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * APIキーが設定されているかチェックします。
 * @returns APIキーが設定されている場合はtrue
 */
export function isAnthropicApiKeyConfigured(): boolean {
  return !!import.meta.env.VITE_ANTHROPIC_API_KEY;
}
