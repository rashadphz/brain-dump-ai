/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatInSchema } from '../models/ChatInSchema';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ChatService {

    /**
     * Send Chat Message
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static sendChatMessage(
        requestBody: ChatInSchema,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
