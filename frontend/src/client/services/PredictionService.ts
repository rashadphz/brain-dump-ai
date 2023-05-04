/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PredictionIn } from '../models/PredictionIn';
import type { PredictionOut } from '../models/PredictionOut';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PredictionService {

    /**
     * Make Prediction
     * @param requestBody
     * @returns PredictionOut Successful Response
     * @throws ApiError
     */
    public static makePrediction(
        requestBody: PredictionIn,
    ): CancelablePromise<PredictionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/prediction/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
