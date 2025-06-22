<script lang="ts">
  import Textfield from '@smui/textfield';
  import { updateInputText } from '$lib/stores/appStore';
  import { MAX_INPUT_LENGTH } from '$lib/utils/constants';

  /**
   * 入力テキストの値
   */
  export let value: string = '';

  /**
   * 文字数カウント（リアクティブ）
   */
  $: characterCount = value.length;

  /**
   * 最大文字数を超えているかどうか
   */
  $: isOverLimit = characterCount > MAX_INPUT_LENGTH;

  /**
   * テキスト入力時のハンドラ
   * @param event - 入力イベント
   */
  function handleInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    value = target.value;
    updateInputText(value);
  }
</script>

<div class="text-input">
  <Textfield
    bind:value
    label="トークンカウントしたいテキストを入力"
    textarea
    style="width: 100%;"
    input$rows={10}
    input$placeholder="ここにテキストを入力してください..."
    on:input={handleInput}
    invalid={isOverLimit}
  />
  
  <div class="character-count" class:over-limit={isOverLimit}>
    {characterCount.toLocaleString()} / {MAX_INPUT_LENGTH.toLocaleString()} 文字
  </div>
  
  {#if isOverLimit}
    <div class="error-message">
      最大文字数を超えています。{MAX_INPUT_LENGTH.toLocaleString()}文字以内で入力してください。
    </div>
  {/if}
</div>

<style>
  .text-input {
    margin-bottom: 16px;
  }

  .character-count {
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.6);
    text-align: right;
    margin-top: 4px;
  }

  .character-count.over-limit {
    color: #d32f2f;
    font-weight: 500;
  }

  .error-message {
    font-size: 0.75rem;
    color: #d32f2f;
    margin-top: 4px;
    margin-left: 16px;
  }
</style>
