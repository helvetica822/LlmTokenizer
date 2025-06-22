<script lang="ts">
  import Button from '@smui/button';
  import CircularProgress from '@smui/circular-progress';
  import { countTokens } from '$lib/services/providerService';
  import { setLoading, setTokenCount, setError } from '$lib/stores/appStore';
  import { ProviderType } from '$lib/types/provider';
  import { MAX_INPUT_LENGTH } from '$lib/utils/constants';
  import type { ImageData } from '$lib/types/tokenCount';

  /**
   * 選択されたプロバイダ
   */
  export let selectedProvider: string | null = null;

  /**
   * 選択されたモデル
   */
  export let selectedModel: string | null = null;

  /**
   * 入力テキスト
   */
  export let inputText: string = '';

  /**
   * 入力画像
   */
  export let inputImages: ImageData[] = [];

  /**
   * ローディング状態
   */
  export let isLoading: boolean = false;

  /**
   * カウントボタンが無効かどうか（リアクティブ）
   */
  $: hasContent = (inputText && inputText.trim()) || (inputImages && inputImages.length > 0);
  $: isDisabled = !selectedProvider || 
                  !selectedModel || 
                  !hasContent ||
                  (inputText && inputText.length > MAX_INPUT_LENGTH) ||
                  isLoading;

  /**
   * トークンカウント実行ハンドラ
   */
  async function handleCountTokens(): Promise<void> {
    if (!selectedProvider || !selectedModel || !hasContent) {
      return;
    }

    try {
      setLoading(true);
      
      const result = await countTokens(
        selectedProvider as ProviderType,
        {
          text: inputText?.trim() || undefined,
          images: inputImages && inputImages.length > 0 ? inputImages : undefined,
          model: selectedModel
        }
      );

      setTokenCount(result);
    } catch (error) {
      console.error('Token count failed:', error);
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('トークンカウントに失敗しました');
      }
    }
  }
</script>

<div class="token-counter">
  <Button
    variant="raised"
    disabled={isDisabled}
    on:click={handleCountTokens}
    style="width: 100%;"
  >
    {#if isLoading}
      <CircularProgress style="height: 20px; width: 20px; margin-right: 8px;" indeterminate />
      カウント中...
    {:else}
      トークン数をカウント
    {/if}
  </Button>

  {#if isDisabled && !isLoading}
    <div class="helper-text">
      {#if !selectedProvider}
        プロバイダを選択してください
      {:else if !selectedModel}
        モデルを選択してください
      {:else if !hasContent}
        テキストまたは画像を入力してください
      {:else if inputText && inputText.length > MAX_INPUT_LENGTH}
        テキストが長すぎます
      {/if}
    </div>
  {/if}

  {#if hasContent && !isDisabled}
    <div class="content-summary">
      {#if inputText && inputText.trim()}
        <span class="content-item">テキスト: {inputText.length}文字</span>
      {/if}
      {#if inputImages && inputImages.length > 0}
        <span class="content-item">画像: {inputImages.length}枚</span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .token-counter {
    margin-bottom: 24px;
  }

  .helper-text {
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.6);
    text-align: center;
    margin-top: 8px;
  }

  .content-summary {
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.6);
    text-align: center;
    margin-top: 8px;
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .content-item {
    background-color: #f5f5f5;
    padding: 4px 8px;
    border-radius: 4px;
  }
</style>
