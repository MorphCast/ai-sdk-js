/* global CY */

export function loadSDK() {
  const url = 'https://ai-sdk.morphcast.com/v1.14/ai-sdk.js';
  const script = document.createElement('script');
  document.body.appendChild(script);

  return new Promise((resolve, reject) => {
    script.onload = () => resolve(CY);
    script.onerror = reject;
    script.src = url;
  });
}
