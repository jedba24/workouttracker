const statusMap = {
  OKAY: 200,
  SUCCESS: 201,
  BAD_REQUEST: 404,
  INTERNAL_ERROR: 500,
  NOT_FOUND: 404,
  NOT_AUTHORIZED: 401,
  FORBIDDEN: 403,
};
type StatusKey = keyof typeof statusMap;
export class CustomError extends Error {
  public statusCode: number;
  constructor({ message, status }: { message: string; status: StatusKey }) {
    super(message);
    this.statusCode = statusMap[status];
  }
}
