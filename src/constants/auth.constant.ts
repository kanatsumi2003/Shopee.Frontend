export const STATE_STATUS = {
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
}

export type StateStatus = (typeof STATE_STATUS)[keyof typeof STATE_STATUS];