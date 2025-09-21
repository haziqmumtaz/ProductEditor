import { reactive, toRefs, type Ref, type UnwrapRef } from "vue";

export interface BaseApiState<T = any> {
  response: T;
  loading: boolean;
  error: string;
}

export interface BaseApiOptions {
  defaultErrorMessage?: string;
}

export interface ApiComposable<T = any> {
  response: Ref<T>;
  loading: Ref<boolean>;
  error: Ref<string>;
  execute: (...args: any[]) => Promise<any>;
}

export function useBaseApi<T = any>(options: BaseApiOptions = {}) {
  const { defaultErrorMessage = "An error occurred" } = options;

  const state = reactive<BaseApiState<T>>({
    response: {} as T,
    loading: false,
    error: "",
  });

  async function executeApiCall<TResult = T>(
    apiCall: () => Promise<TResult>,
    customErrorMessage?: string
  ): Promise<TResult> {
    state.loading = true;
    state.error = "";

    try {
      const result = await apiCall();
      state.response = result as UnwrapRef<T>;
      return result;
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : customErrorMessage || defaultErrorMessage;

      state.error = errorMessage;
      throw e;
    } finally {
      state.loading = false;
    }
  }

  return {
    ...toRefs(state),
    executeApiCall,
  };
}
