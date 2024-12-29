class CustomError extends Error {
  constructor(name, status, message) {
      super(message);
      this.name = name; 
      this.statusCode = status;
  }
}


export class BadRequestException extends CustomError {
  constructor(message = "잘못된 요청입니다."){
    super(400, message);
  }
}