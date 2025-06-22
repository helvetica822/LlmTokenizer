<script lang="ts">
  import Card, { Content } from '@smui/card';
  import Button from '@smui/button';
  import { clearError } from '$lib/stores/appStore';
  import type { TokenCountResponse } from '$lib/types/tokenCount';

  /**
   * トークンカウント結果
   */
  export let tokenCount: TokenCountResponse | null = null;

  /**
   * エラーメッセージ
   */
  export let error: string | null = null;

  /**
   * エラーを閉じるハンドラ
   */
  function handleCloseError(): void {
    clearError();
  }
</script>

{#if tokenCount}
  <div class="result-display">
    <Card>
      <Content class="result-content">
        <h3 class="result-title">トークンカウント結果</h3>
        
        <div class="token-info">
          <div class="token-item">
            <span class="token-label">入力トークン数:</span>
            <span class="token-value">{tokenCount.inputTokens.toLocaleString()}</span>
          </div>
        </div>
      </Content>
    </Card>
  </div>
{/if}

{#if error}
  <div class="error-display">
    <Card style="background-color: #ffebee;">
      <Content class="error-content">
        <div class="error-header">
          <h3 class="error-title">エラー</h3>
          <Button
            variant="text"
            size="small"
            on:click={handleCloseError}
            style="min-width: auto; padding: 4px 8px;"
          >
            ✕
          </Button>
        </div>
        
        <p class="error-message">{error}</p>
      </Content>
    </Card>
  </div>
{/if}

<style>
  .result-display,
  .error-display {
    margin-top: 16px;
  }

  :global(.result-content),
  :global(.error-content) {
    padding: 24px !important;
  }

  .result-title {
    margin: 0 0 16px 0;
    font-size: 1.25rem;
    font-weight: 500;
    color: #1976d2;
  }

  .token-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .token-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .token-item:last-child {
    border-bottom: none;
  }

  .token-label {
    font-weight: 500;
    color: #424242;
  }

  .token-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1976d2;
  }

  .error-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 500;
    color: #d32f2f;
  }

  .error-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .error-message {
    margin: 0;
    color: #d32f2f;
    line-height: 1.5;
  }

  @media (max-width: 600px) {
    .token-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .token-value {
      align-self: flex-end;
    }
  }
</style>
