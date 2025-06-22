<script lang="ts">
  import Select, { Option } from '@smui/select';
  import { getModelsForProvider } from '$lib/services/providerService';
  import { selectModel } from '$lib/stores/appStore';
  import { ProviderType } from '$lib/types/provider';
  import type { Model } from '$lib/types/provider';

  /**
   * 選択されたモデルの値
   */
  export let value: string | null = null;

  /**
   * 選択されたプロバイダ
   */
  export let selectedProvider: string | null = null;

  /**
   * 利用可能なモデル一覧（リアクティブ）
   */
  $: availableModels = selectedProvider 
    ? getModelsForProvider(selectedProvider as ProviderType)
    : [];

  /**
   * セレクトボックスが無効かどうか
   */
  $: isDisabled = !selectedProvider || availableModels.length === 0;


  /**
   * プロバイダが変更された時にモデル選択をリセット
   */
  $: if (selectedProvider !== null) {
    value = null;
  }

  /**
   * valueが変更された時の処理
   */
  $: if (value) {
    selectModel(value);
  }
</script>

<div class="model-selector">
  <Select
    bind:value
    label="モデルを選択"
    disabled={isDisabled}
    style="width: 100%;"
  >
    <Option value={undefined} />
    {#each availableModels as model (model.id)}
      <Option value={model.id} title={model.description}>
        {model.name}
      </Option>
    {/each}
  </Select>
  
  {#if isDisabled && !selectedProvider}
    <div class="helper-text">
      まずプロバイダを選択してください
    </div>
  {/if}
</div>

<style>
  .model-selector {
    margin-bottom: 16px;
  }

  .helper-text {
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 4px;
    margin-left: 16px;
  }
</style>
