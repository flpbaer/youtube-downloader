export const YTDL_CONFIG = {
  requestOptions: {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  },
};

export const ERROR_MESSAGES = {
  403: [
    '💡 Dicas para resolver o erro 403:',
    '   1. Aguarde alguns minutos e tente novamente',
    '   2. Tente com outro vídeo do YouTube',
    '   3. Verifique se o vídeo não está privado ou com restrições',
    '   4. O YouTube pode estar limitando requisições temporariamente',
  ],
  410: ['💡 Dica: Este vídeo pode estar com restrições ou foi removido.'],
  extract: [
    '💡 Dica: Erro ao extrair informações do vídeo.',
    '   Tente atualizar a biblioteca: npm update @distube/ytdl-core',
  ],
};
