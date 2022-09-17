/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onlongpress: () => void;
  }
}
