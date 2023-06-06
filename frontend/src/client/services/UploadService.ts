/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NoteSchema } from '../models/NoteSchema';
import type { UploadOutSchema } from '../models/UploadOutSchema';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UploadService {

    /**
     * Upload Note
     * @param requestBody
     * @returns UploadOutSchema Successful Response
     * @throws ApiError
     */
    public static uploadNote(
        requestBody: NoteSchema,
    ): CancelablePromise<UploadOutSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload-note/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
