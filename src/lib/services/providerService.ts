import type { Provider, Model } from '$lib/types/provider';
import type { TokenCountRequest, TokenCountResponse } from '$lib/types/tokenCount';
import { ProviderType } from '$lib/types/provider';
import { PROVIDERS } from '$lib/utils/constants';
import { countTokensWithAnthropic } from './anthropicService';
import { countTokensWithGemini } from './geminiService';
import { countTokensWithOpenAI } from './openaiService';

/**
 * 利用可能なプロバイダ一覧を取得します。
 * @returns プロバイダ一覧
 */
export function getAvailableProviders(): Provider[] {
  return PROVIDERS;
}

/**
 * 指定されたプロバイダのモデル一覧を取得します。
 * @param providerType - プロバイダの種類
 * @returns モデル一覧、プロバイダが見つからない場合は空配列
 */
export function getModelsForProvider(providerType: ProviderType): Model[] {
  const provider = PROVIDERS.find(p => p.type === providerType);
  return provider?.models || [];
}

/**
 * プロバイダ名からプロバイダ情報を取得します。
 * @param providerType - プロバイダの種類
 * @returns プロバイダ情報、見つからない場合はundefined
 */
export function getProviderByType(providerType: ProviderType): Provider | undefined {
  return PROVIDERS.find(p => p.type === providerType);
}

/**
 * 指定されたプロバイダとモデルでトークン数をカウントします。
 * @param providerType - プロバイダの種類
 * @param request - トークンカウントリクエスト
 * @returns トークンカウント結果
 * @throws Error - サポートされていないプロバイダまたはAPI呼び出しに失敗した場合
 */
export async function countTokens(
  providerType: ProviderType,
  request: TokenCountRequest
): Promise<TokenCountResponse> {
  switch (providerType) {
    case ProviderType.Anthropic:
      return await countTokensWithAnthropic(request);
    
    case ProviderType.Gemini:
      return await countTokensWithGemini(request);
    
    case ProviderType.OpenAI:
      return await countTokensWithOpenAI(request);
    
    default:
      throw new Error(`サポートされていないプロバイダです: ${providerType}`);
  }
}

/**
 * モデルIDが指定されたプロバイダで有効かチェックします。
 * @param providerType - プロバイダの種類
 * @param modelId - モデルID
 * @returns 有効な場合はtrue
 */
export function isValidModelForProvider(providerType: ProviderType, modelId: string): boolean {
  const models = getModelsForProvider(providerType);
  return models.some(model => model.id === modelId);
}

/**
 * モデルIDからモデル情報を取得します。
 * @param providerType - プロバイダの種類
 * @param modelId - モデルID
 * @returns モデル情報、見つからない場合はundefined
 */
export function getModelById(providerType: ProviderType, modelId: string): Model | undefined {
  const models = getModelsForProvider(providerType);
  return models.find(model => model.id === modelId);
}
