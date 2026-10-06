const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let raw = '';
  res.on('data', chunk => raw += chunk);
  res.on('end', () => {
    const tabs = JSON.parse(raw);
    const pageTab = tabs.find(t => t.url.includes('localhost:3000'));
    if (!pageTab) {
      console.log('No page tab found. Tabs:', tabs.map(t => t.url));
      process.exit(0);
    }
    console.log('Connecting to tab:', pageTab.url);
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Page.reload' }));
    };
    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('*** EXCEPTION THROWN IN BROWSER ***');
        console.error(JSON.stringify(msg.params.exceptionDetails, null, 2));
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        console.log(`CONSOLE [${msg.params.type}]:`, ...msg.params.args.map(a => a.value || a.description));
      }
    };
    setTimeout(() => {
      process.exit(0);
    }, 2500);
  });
});
