export function parseUrl() {
  const searchParams = location.search.replace('?', '').split('&');
  const result = {};
  searchParams.forEach((param) => {
    const index = param.indexOf('=');
    if (index > 0) {
      const key = param.substring(0, index);
      const value = param.substring(index + 1);
      result[key] = (value === "true" || value === "false") ? value === "true" : value;
    } else {
      result[param] = null;
    }

  });

  return result;
}