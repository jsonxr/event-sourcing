
const ResponsePayload = function(code: any, payload: any) {
  this.code = code;
  this.payload = payload;
}

export const respondWithCode = function(code: any, payload: any) {
  return new ResponsePayload(code, payload);
}

export const writeJson = function(response: { writeHead: (arg0: any, arg1: { 'Content-Type': string; }) => void; end: (arg0: any) => void; }, arg1: any, arg2?: any) {
  var code;
  var payload;

  if(arg1 && arg1 instanceof ResponsePayload) {
    writeJson(response, (arg1 as any).payload, (arg1 as any).code);
    return;
  }

  if(arg2 && Number.isInteger(arg2)) {
    code = arg2;
  }
  else {
    if(arg1 && Number.isInteger(arg1)) {
      code = arg1;
    }
  }
  if(code && arg1) {
    payload = arg1;
  }
  else if(arg1) {
    payload = arg1;
  }

  if(!code) {
    // if no response code given, we default to 200
    code = 200;
  }
  if(typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }
  response.writeHead(code, {'Content-Type': 'application/json'});
  response.end(payload);
}
