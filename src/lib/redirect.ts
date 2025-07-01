interface RedirectOptions {
  delayMs?: number;
  soft?: boolean; 
  onError?: (error: Error) => void; 
  onBeforeRedirect?: () => void; 
}

export default function redirect(url: string, options: RedirectOptions = {}) {
  try {
    
    options.onBeforeRedirect?.();

    const performRedirect = () => {
      if (options.soft && window.history.pushState) {
        window.history.pushState(null, '', url);
      } else {
        window.location.href = url;
      }
    };

    if (options.delayMs && options.delayMs > 0) {
      setTimeout(performRedirect, options.delayMs);
    } else {
      performRedirect();
    }

  } catch (error) {
    console.error("Redirect failed:", error);
    options.onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}
