/**
 * Dynamically loads an array of external scripts into the document.
 * @param scriptUrls An array of URLs for the scripts to load.
 * @returns A promise that resolves when all scripts are loaded, or rejects if any script fails to load.
 */
export const loadExternalScripts = (scriptUrls: string[]): Promise<void> => {
  const loadScript = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if the script is already on the page
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.async = true;

      script.onload = () => {
        console.log(`Script loaded: ${url}`);
        resolve();
      };

      script.onerror = () => {
        console.error(`Failed to load script: ${url}`);
        reject(new Error(`Failed to load script: ${url}`));
      };

      document.body.appendChild(script);
    });
  };

  return Promise.all(scriptUrls.map(loadScript)).then(() => {});
};
