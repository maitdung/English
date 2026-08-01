const CLOUDFLARE_API_HOSTNAME = 'api.cloudflare.com';
const DEPLOY_HOOK_PATH_PATTERN =
  /^\/client\/v4\/pages\/webhooks\/deploy_hooks\/[^/]+\/?$/;

export function isCloudflarePagesDeployHookUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === 'https:' &&
      url.hostname === CLOUDFLARE_API_HOSTNAME &&
      url.port === '' &&
      url.username === '' &&
      url.password === '' &&
      url.search === '' &&
      url.hash === '' &&
      DEPLOY_HOOK_PATH_PATTERN.test(url.pathname)
    );
  } catch {
    return false;
  }
}
