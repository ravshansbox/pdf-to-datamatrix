import { spawn } from 'child_process';
import express, { Request } from 'express';
import { createServer } from 'http';

const app = express();

const { HTTP_PORT = '80' } = process.env;

const parseQuery = (request: Request, key: string) => {
  const value = parseQuerySingle(request, key);
  if (typeof value === 'string') {
    return value;
  }
};

const parseQuerySingle = (request: Request, key: string) => {
  let value = request.query[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

app.post('/', (request, response) => {
  const resolution = parseQuery(request, 'resolution') || '96';
  const cp = spawn('dmtxread', ['-n', '-r', resolution]);
  request.pipe(cp.stdin);
  cp.stdout.pipe(response);
  cp.stderr.pipe(response);
});

const server = createServer(app);

server.listen(HTTP_PORT, () => {
  console.info('Listening on %s', server.address());
});
