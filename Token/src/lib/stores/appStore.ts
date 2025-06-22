import { writable } from 'svelte/store';
import type { AppState, ImageData } from '$lib/types/tokenCount';

/**
 * アプリケーションの初期状態
 */
const initialState: AppState = {
  selectedProvider: null,
  selectedModel: null,
  inputText: '',
  inputImages: [],
  imageUrl: '',
  isLoading: false,
  tokenCount: null,
  error: null
};

/**
 * アプリケーション状態を管理するストア
 */
export const appStore = writable<AppState>(initialState);

/**
 * プロバイダを選択します。
 * @param provider - 選択されたプロバイダ
 */
export function selectProvider(provider: string): void {
  appStore.update(state => ({
    ...state,
    selectedProvider: provider,
    selectedModel: null, // プロバイダが変更されたらモデル選択をリセット
    tokenCount: null,
    error: null
  }));
}

/**
 * モデルを選択します。
 * @param model - 選択されたモデル
 */
export function selectModel(model: string): void {
  appStore.update(state => ({
    ...state,
    selectedModel: model,
    tokenCount: null,
    error: null
  }));
}

/**
 * 入力テキストを更新します。
 * @param text - 入力されたテキスト
 */
export function updateInputText(text: string): void {
  appStore.update(state => ({
    ...state,
    inputText: text,
    tokenCount: null,
    error: null
  }));
}

/**
 * 画像URLを更新します。
 * @param url - 画像URL
 */
export function updateImageUrl(url: string): void {
  appStore.update(state => ({
    ...state,
    imageUrl: url,
    tokenCount: null,
    error: null
  }));
}

/**
 * 入力画像を追加します。
 * @param image - 画像データ
 */
export function addInputImage(image: ImageData): void {
  appStore.update(state => ({
    ...state,
    inputImages: [...state.inputImages, image],
    tokenCount: null,
    error: null
  }));
}

/**
 * 入力画像を削除します。
 * @param index - 削除する画像のインデックス
 */
export function removeInputImage(index: number): void {
  appStore.update(state => ({
    ...state,
    inputImages: state.inputImages.filter((_, i) => i !== index),
    tokenCount: null,
    error: null
  }));
}

/**
 * すべての入力画像をクリアします。
 */
export function clearInputImages(): void {
  appStore.update(state => ({
    ...state,
    inputImages: [],
    tokenCount: null,
    error: null
  }));
}

/**
 * ローディング状態を設定します。
 * @param loading - ローディング状態
 */
export function setLoading(loading: boolean): void {
  appStore.update(state => ({
    ...state,
    isLoading: loading
  }));
}

/**
 * トークンカウント結果を設定します。
 * @param tokenCount - トークンカウント結果
 */
export function setTokenCount(tokenCount: import('$lib/types/tokenCount').TokenCountResponse): void {
  appStore.update(state => ({
    ...state,
    tokenCount,
    error: null,
    isLoading: false
  }));
}

/**
 * エラーを設定します。
 * @param error - エラーメッセージ
 */
export function setError(error: string): void {
  appStore.update(state => ({
    ...state,
    error,
    tokenCount: null,
    isLoading: false
  }));
}

/**
 * 状態をリセットします。
 */
export function resetState(): void {
  appStore.set(initialState);
}

/**
 * エラーをクリアします。
 */
export function clearError(): void {
  appStore.update(state => ({
    ...state,
    error: null
  }));
}
