import { resolve } from 'path';
import { createServer } from 'livereload';
import { find } from 'port-authority';

const state = (globalThis.PLUGIN_LIVERELOAD = globalThis.PLUGIN_LIVERELOAD || {
  server: null,
});

export default function rollupPluginLivereload2(options = {}) {
  if (state.server) {
    state.server.close();
  }

  let enabled = options.verbose === false;
  const portPromise = find(options.port || 35729);

  portPromise.then(port => {
    state.server = createServer({ ...options, port });

    const p = resolve(process.cwd(), '');
    state.server.watch(p);
  });

  return {
    name: 'livereload',
    async banner() {
      if (options.inject === false) {
        return '';
      }
      const port = await portPromise;
      const snippetSrc = `(self.location.protocol.startsWith('http') ? '' : 'http:') + '//' + (self.location.hostname || 'localhost') + ':${port}/livereload.js?snipver=1'`;

      return `(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = ${snippetSrc}; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);`;
    },
    async generateBundle() {
      if (!enabled) {
        enabled = true;
        const port = await portPromise;
        const customPort = port !== 35729 ? ' on port ' + port : '';
        console.log(green('LiveReload enabled' + customPort));
      }
    },
  };
}

function green(text) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m';
}