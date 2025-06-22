import type { TokenCountRequest, TokenCountResponse, ImageData } from '$lib/types/tokenCount';
import { get_encoding, encoding_for_model, type TiktokenEncoding } from 'tiktoken';

/**
 * OpenAI APIエラークラス
 */
class OpenAIApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'OpenAIApiError';
  }
}

/**
 * モデル名からエンコーディング名を取得します
 */
function getEncodingForModel(model: string): TiktokenEncoding {
  // GPT-4系モデルのマッピング
  if (model.includes('gpt-4o')) {
    return 'o200k_base';
  } else if (model.includes('gpt-4')) {
    return 'cl100k_base';
  } else if (model.includes('gpt-3.5')) {
    return 'cl100k_base';
  } else {
    // デフォルトは cl100k_base
    return 'cl100k_base';
  }
}

/**
 * 画像のトークン数を計算します（概算）
 * OpenAIの画像トークン計算ルールに基づく
 */
function calculateImageTokens(imageData: ImageData): number {
  // 基本的な画像トークン数（OpenAIの仕様に基づく概算）
  // 実際の計算はより複雑ですが、ここでは簡略化
  const baseTokens = 85; // 基本トークン数
  
  // 画像サイズに基づく追加トークン数の概算
  // base64データの長さから画像サイズを推定
  const dataLength = imageData.data.length;
  const estimatedSize = dataLength * 0.75; // base64デコード後のサイズ概算
  
  // 画像サイズに基づく追加トークン数
  let additionalTokens = 0;
  if (estimatedSize > 1024 * 1024) { // 1MB以上
    additionalTokens = 255;
  } else if (estimatedSize > 512 * 1024) { // 512KB以上
    additionalTokens = 170;
  } else {
    additionalTokens = 85;
  }
  
  return baseTokens + additionalTokens;
}

/**
 * tiktokenを使用してトークン数をカウントします。
 * @param request - トークンカウントリクエスト
 * @returns トークンカウント結果
 * @throws OpenAIApiError - トークンカウントに失敗した場合
 */
export async function countTokensWithOpenAI(request: TokenCountRequest): Promise<TokenCountResponse> {
  try {
    // コンテンツが空の場合はエラー
    if ((!request.text || !request.text.trim()) && (!request.images || request.images.length === 0)) {
      throw new OpenAIApiError('テキストまたは画像を入力してください');
    }

    let totalTokens = 0;

    // テキストのトークン数を計算
    if (request.text && request.text.trim()) {
      console.log(`Counting tokens for text: ${request.text.length} characters`);
      
      try {
        // モデルに対応するエンコーディングを取得
        const encodingName = getEncodingForModel(request.model);
        const encoding = get_encoding(encodingName);
        
        // テキストをエンコードしてトークン数を取得
        const tokens = encoding.encode(request.text);
        const textTokens = tokens.length;
        
        console.log(`Text tokens: ${textTokens} (encoding: ${encodingName})`);
        totalTokens += textTokens;
        
        // エンコーディングを解放
        encoding.free();
      } catch (error) {
        console.error('Error encoding text:', error);
        throw new OpenAIApiError(`テキストのトークンカウントに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
      }
    }

    // 画像のトークン数を計算
    if (request.images && request.images.length > 0) {
      console.log(`Counting tokens for ${request.images.length} images`);
      
      // GPT-4系モデルかチェック
      const isVisionModel = request.model.includes('gpt-4o') || request.model.includes('gpt-4');
      
      if (!isVisionModel) {
        throw new OpenAIApiError('選択されたモデルは画像をサポートしていません');
      }
      
      let imageTokens = 0;
      request.images.forEach((image, index) => {
        const tokens = calculateImageTokens(image);
        console.log(`Image ${index + 1}: ${tokens} tokens (estimated)`);
        imageTokens += tokens;
      });
      
      totalTokens += imageTokens;
    }

    console.log(`Total tokens for model ${request.model}: ${totalTokens}`);

    return {
      inputTokens: totalTokens,
      totalTokens: totalTokens
    };

  } catch (error) {
    if (error instanceof OpenAIApiError) {
      throw error;
    }
    
    console.error('Unknown error occurred during token counting:', error);
    throw new OpenAIApiError(`トークンカウントに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}
