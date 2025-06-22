<script lang="ts">
  import Select, { Option } from '@smui/select';
  import { getAvailableProviders } from '$lib/services/providerService';
  import { selectProvider } from '$lib/stores/appStore';
  import type { Provider } from '$lib/types/provider';

  /**
   * 選択されたプロバイダの値
   */
  export let value: string | null = null;

  /**
   * 利用可能なプロバイダ一覧
   */
  const providers: Provider[] = getAvailableProviders();

  /**
   * valueが変更された時の処理
   */
  $: if (value) {
    selectProvider(value);
  }
</script>

<div class="provider-selector">
  <Select
    bind:value
    label="プロバイダを選択"
    style="width: 100%;"
  >
  <Option value={undefined} />
    {#each providers as provider (provider.type)}
      <Option value={provider.type}>{provider.name}</Option>
    {/each}
  </Select>
</div>

<style>
  .provider-selector {
    margin-bottom: 16px;
  }
</style>
