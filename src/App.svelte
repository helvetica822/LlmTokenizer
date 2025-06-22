<script lang="ts">
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import Paper from '@smui/paper';
  
  import ProviderSelector from '$components/ProviderSelector.svelte';
  import ModelSelector from '$components/ModelSelector.svelte';
  import TextInput from '$components/TextInput.svelte';
  import ImageInput from '$components/ImageInput.svelte';
  import TokenCounter from '$components/TokenCounter.svelte';
  import ResultDisplay from '$components/ResultDisplay.svelte';
  
  import { appStore } from '$lib/stores/appStore';

  /**
   * アプリケーション状態（リアクティブ）
   */
  $: state = $appStore;
</script>

<div class="app">
  <TopAppBar variant="static">
    <Row>
      <Section>
        <Title>AI Token Counter</Title>
      </Section>
    </Row>
  </TopAppBar>

  <main class="main-content">
    <LayoutGrid>
      <Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
        <Paper class="content-paper" elevation={2}>
          <div class="form-container">
            <h2 class="form-title">トークン数カウンター</h2>
            <p class="form-description">
              AIモデルのトークン数を簡単にカウントできます。プロバイダとモデルを選択し、テキストまたは画像を入力してください。
            </p>

            <div class="form-section">
              <ProviderSelector bind:value={state.selectedProvider} />
            </div>

            <div class="form-section">
              <ModelSelector 
                bind:value={state.selectedModel}
                selectedProvider={state.selectedProvider}
              />
            </div>

            <div class="form-section">
              <TextInput bind:value={state.inputText} />
            </div>

            <div class="form-section">
              <ImageInput 
                bind:imageUrl={state.imageUrl}
                bind:inputImages={state.inputImages}
              />
            </div>

            <div class="form-section">
              <TokenCounter
                selectedProvider={state.selectedProvider}
                selectedModel={state.selectedModel}
                inputText={state.inputText}
                inputImages={state.inputImages}
                isLoading={state.isLoading}
              />
            </div>

            <ResultDisplay
              tokenCount={state.tokenCount}
              error={state.error}
            />
          </div>
        </Paper>
      </Cell>
    </LayoutGrid>
  </main>

  <footer class="footer">
    <p>&copy; 2025 AI Token Counter. Built with Svelte and Material UI.</p>
  </footer>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
  }

  .main-content {
    flex: 1;
    padding: 24px 16px;
  }

  :global(.content-paper) {
    padding: 32px !important;
    margin: 0 auto;
    max-width: 800px;
  }

  .form-container {
    width: 100%;
  }

  .form-title {
    margin: 0 0 8px 0;
    font-size: 2rem;
    font-weight: 400;
    color: #1976d2;
    text-align: center;
  }

  .form-description {
    margin: 0 0 32px 0;
    color: #666;
    text-align: center;
    line-height: 1.6;
  }

  .form-section {
    margin-bottom: 24px;
  }

  .footer {
    background-color: #1976d2;
    color: white;
    text-align: center;
    padding: 16px;
    margin-top: auto;
  }

  .footer p {
    margin: 0;
    font-size: 0.875rem;
  }

  @media (max-width: 600px) {
    .main-content {
      padding: 16px 8px;
    }

    :global(.content-paper) {
      padding: 24px 16px !important;
    }

    .form-title {
      font-size: 1.75rem;
    }
  }
</style>
