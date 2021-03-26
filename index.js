const { createServer } = require('http');
const { spawn } = require('child_process');

const { HTTP_PORT = '80' } = process.env;

const server = createServer((request, response) => {
  const cp = spawn('dmtxread', ['-n', '-r', '96']);
  request.pipe(cp.stdin);
  cp.stdout.pipe(response);
  cp.stderr.pipe(response);
});

server.listen(HTTP_PORT, () => {
  console.info('Listening on %s', server.address());
});
