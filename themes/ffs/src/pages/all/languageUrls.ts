type LocationParts = Pick<Location, 'hostname' | 'pathname' | 'search' | 'hash' | 'port' | 'protocol'>;

export function languageUrls({ hostname, pathname, search, hash, port, protocol }: LocationParts) {
  const suffix = `${pathname}${search}${hash}`;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      en: `${protocol}//${hostname}:${port === '3001' ? '3000' : port || '3000'}${suffix}`,
      es: `${protocol}//${hostname}:${port === '3000' ? '3001' : port || '3001'}${suffix}`
    };
  }
  return {
    en: `https://www.fastfillsystems.com${suffix}`,
    es: `https://es.fastfillsystems.com${suffix}`
  };
}
