<script lang="ts">
  import Button from '@smui/button';
  import Card, { Content } from '@smui/card';
  import { addInputImage, removeInputImage } from '$lib/stores/appStore';
  import { convertFileToBase64 } from '$lib/services/anthropicService';
  import type { ImageData } from '$lib/types/tokenCount';

  /**
   * 入力画像一覧
   */
  export let inputImages: ImageData[] = [];

  /**
   * ローディング状態
   */
  let isLoadingImage = false;

  /**
   * ファイル入力要素
   */
  let fileInput: HTMLInputElement;

  /**
   * ファイル選択時の処理
   */
  async function handleFileSelect(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (!files || files.length === 0) return;

    try {
      isLoadingImage = true;
      
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          console.warn(`Skipping non-image file: ${file.name}`);
          continue;
        }
        
        console.log(`Processing file: ${file.name}`);
        const imageData = await convertFileToBase64(file);
        addInputImage(imageData);
        console.log(`Successfully added image: ${file.name}`);
      }
      
      // ファイル入力をリセット
      target.value = '';
    } catch (error) {
      console.error('Failed to add image from file:', error);
      // エラーをアプリストアに設定（必要に応じて）
      if (error instanceof Error) {
        console.error(`Image processing error: ${error.message}`);
      }
    } finally {
      isLoadingImage = false;
    }
  }

  /**
   * 画像削除処理
   */
  function handleRemoveImage(index: number): void {
    removeInputImage(index);
  }

  /**
   * ファイル選択ダイアログを開く
   */
  function openFileDialog(): void {
    fileInput.click();
  }
</script>

<div class="image-input">
  <h3 class="section-title">画像入力</h3>
  
  <!-- ファイル入力 -->
  <div class="file-input-section">
    <input
      bind:this={fileInput}
      type="file"
      accept="image/*"
      multiple
      on:change={handleFileSelect}
      style="display: none;"
    />
    <Button
      variant="outlined"
      on:click={openFileDialog}
      disabled={isLoadingImage}
    >
      {isLoadingImage ? '読み込み中...' : 'ファイルから選択'}
    </Button>
  </div>

  <!-- 追加された画像一覧 -->
  {#if inputImages.length > 0}
    <div class="images-list">
      <h4 class="images-title">追加された画像 ({inputImages.length})</h4>
      <div class="images-grid">
        {#each inputImages as image, index (index)}
          <Card class="image-card">
            <Content class="image-content">
              <img
                src={`data:${image.mediaType};base64,${image.data}`}
                alt="入力画像 {index + 1}"
                class="preview-image"
              />
              <div class="image-actions">
                <Button
                  variant="text"
                  size="small"
                  on:click={() => handleRemoveImage(index)}
                  style="color: #d32f2f;"
                >
                  削除
                </Button>
              </div>
            </Content>
          </Card>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .image-input {
    margin-bottom: 24px;
  }

  .section-title {
    margin: 0 0 16px 0;
    font-size: 1.125rem;
    font-weight: 500;
    color: #424242;
  }

  .file-input-section {
    margin-bottom: 16px;
  }

  .images-list {
    margin-top: 24px;
  }

  .images-title {
    margin: 0 0 12px 0;
    font-size: 1rem;
    font-weight: 500;
    color: #424242;
  }

  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  :global(.image-card) {
    border: 1px solid #e0e0e0 !important;
  }

  :global(.image-content) {
    padding: 12px !important;
  }

  .preview-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .image-actions {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 600px) {
    .images-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
    }

    .preview-image {
      height: 100px;
    }
  }
</style>
