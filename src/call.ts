export type CallOptions = RequestInit & { isText?: boolean };

export const BaseOptions: CallOptions = {
    method: 'GET',
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

export async function call<TRESULT>(
    url: string,
    { isText, headers, ...options }: RequestInit & { isText?: boolean } = {}
): Promise<TRESULT> {
    const { headers: baseHeaders, ...baseOptions } = BaseOptions;
    const result = await fetch(url, {
        ...baseOptions,
        headers: {
            ...baseHeaders,
            ...headers,
        },
        ...options,
    });

    let value: any;
    if (isText) {
        value = await result.text();
    } else {
        value = await result.json();
    }

    if (result.status < 200 || result.status >= 300) {
        throw new Error(value);
    }

    return value;
}

export async function get<TRESULT>(url: string, options: CallOptions = {}): Promise<TRESULT> {
    return call<TRESULT>(url, options);
}

export async function post<TBODY, TRESULT>(url: string, body: TBODY, options: CallOptions = {}): Promise<TRESULT> {
    return call<TRESULT>(url, {
        method: 'POST',
        body: JSON.stringify(body),
        ...options,
    });
}

export async function put<TBODY, TRESULT>(url: string, body: TBODY, options: CallOptions = {}): Promise<TRESULT> {
    return call<TRESULT>(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        ...options,
    });
}

export async function patch<TBODY, TRESULT>(url: string, body: TBODY, options: CallOptions = {}): Promise<TRESULT> {
    return call<TRESULT>(url, {
        method: 'patch',
        body: JSON.stringify(body),
        ...options,
    });
}

export async function del<TRESULT>(url: string, options: CallOptions = {}): Promise<TRESULT> {
    return call<TRESULT>(url, {
        method: 'DELETE',
        ...options,
    });
}
