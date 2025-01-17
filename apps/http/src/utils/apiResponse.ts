import { Response } from 'express';

interface ApiResponseOptions {
    statusCode: number;
    message: string;
    data?: any;
    error?: any;
}

const sendApiRespnose = (res: Response, options: ApiResponseOptions): Response => {
    const { statusCode, message, data, error } = options;

    const responsePayload = {
        success: statusCode >= 200 && statusCode < 300,
        message,
        data: data || null,
        error: error || null,
    }

    return res.status(statusCode).json(responsePayload);
}