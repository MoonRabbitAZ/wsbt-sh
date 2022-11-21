export const get = (a, b, c) => {
  const retValue = c !== undefined ? c : null;
  return a.reduce((obj, key) => (obj && key && obj[key] !== null && obj[key] !== undefined ? obj[key] : retValue), b);
};

export const getQueryStringObj = () => {
  const url = new URL(window.location.href);
  return Object.fromEntries(new URLSearchParams(url.search));
};

export function getQuery(params) {
  const keys = Object.keys(params || {});
  const query = keys
    .filter((key) => params[key])
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return query;
}
