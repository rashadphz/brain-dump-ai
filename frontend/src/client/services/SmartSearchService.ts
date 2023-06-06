/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SmartSearchService {

    /**
     * Smart Search
     * @param query
     * @returns string Successful Response
     * @throws ApiError
     */
    public static smartSearch(
        query: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/smart-search/',
            query: {
                'query': query,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
