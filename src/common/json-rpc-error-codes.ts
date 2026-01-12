/**
 * Standard JSON-RPC 2.0 error codes as defined in the specification.
 * @see https://www.jsonrpc.org/specification#error_object
 */
export enum JsonRpcErrorCode {
  /**
   * Invalid JSON was received by the server.
   * An error occurred on the server while parsing the JSON text.
   */
  PARSE_ERROR = -32700,

  /**
   * The JSON sent is not a valid Request object.
   * Missing required fields like "jsonrpc", "method", or malformed structure.
   */
  INVALID_REQUEST = -32600,

  /**
   * The method does not exist or is not available.
   * The requested RPC method name was not found on the server.
   */
  METHOD_NOT_FOUND = -32601,

  /**
   * Invalid method parameter(s).
   * The parameters provided to the method are invalid or malformed.
   */
  INVALID_PARAMS = -32602,

  /**
   * Internal JSON-RPC error.
   * An unexpected error occurred on the server while processing the request.
   */
  INTERNAL_ERROR = -32603,
}
