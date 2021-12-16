export function callXhr<T>(
    url: string,
    {
        method = 'POST',
        body,
        mimeType,
        headers,
        isText,
        onProgress,
    }: {
        method?: 'POST' | 'PUT';
        body?: XMLHttpRequestBodyInit;
        mimeType?: string;
        headers?: Record<string, string>;
        isText?: boolean;
        onProgress?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    }
) {
    return new Promise<T>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('progress', (event) => {
            if (onProgress) {
                onProgress(event);
            }
        });
        xhr.addEventListener(
            'abort',
            (event) => {
                reject(event);
            },
            false
        );
        xhr.addEventListener(
            'error',
            (event) => {
                reject(event);
            },
            false
        );
        xhr.addEventListener('timeout', (event) => {
            reject(event);
        });
        // xhr.addEventListener('loadend', () => {});
        // xhr.addEventListener('loadstart', () => {});
        // xhr.addEventListener('readystatechange', () => {});
        xhr.addEventListener(
            'load',
            () => {
                if (isText) {
                    resolve(xhr.response);
                } else {
                    resolve(JSON.parse(xhr.response));
                }
            },
            false
        );
        if (mimeType) {
            xhr.overrideMimeType(mimeType);
        }
        if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });
        }
        xhr.open(method, url, true);
        xhr.send(body);
    });
}
