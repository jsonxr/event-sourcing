import path from 'path'
import http from 'http'
import * as oas3Tools from 'oas3-tools'

export const server = (port: number) => {

  // swaggerRouter configuration
  const options: any = {
    routing: {
      controllers: path.join(__dirname, 'routes')
    }
  };

  const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'openapi.yml'), options);
  const app = expressAppConfig.getApp();

  // Initialize the Swagger middleware
  http.createServer(app).listen(port, function () {
      console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
      console.log('Swagger-ui is available on http://localhost:%d/docs', port);
  });
}
