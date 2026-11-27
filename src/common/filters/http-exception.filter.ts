import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    let statusCode = 500;
    let message = 'Internal server error';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body: any = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (Array.isArray(body.message)) {
        message = 'Validation failed.';
        errors = body.message;
      } else {
        message = body.message ?? exception.message;
      }
    } else {
      this.logger.error(exception);
    }
    if (errors.length === 0) errors = [message];

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}