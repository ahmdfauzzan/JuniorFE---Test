
export function getPayloadFromEvent(event): any {
    let params = {};
    try {
        if (event.body) {
            params = JSON.parse(event.body);
        }
    } catch(err) {
        params = event.body;
    }
    let query = {}
    try {
        if (event.query) {
            query = JSON.parse(event.query);
        }
    } catch(err) {
        query = event.query;
    }
    const payload = Object.assign(params, query);
    console.log("payload:", payload)
    return payload
}

export function responseBuilder(res: any, is_success: boolean, status_code: number, data: any = null, pagination: any = null, error_code: string = null) {
    const response = {
        status_code: status_code.toString(),
        is_success: is_success,
        error_code: error_code,
        data: data,
        pagination: pagination
    };

    return res.status(status_code).json(response);
}

export function getAuthorizationHeaders(event) {
    let authorization = "";
    if (event.headers.hasOwnProperty("Authorization")) {
        authorization = event.headers.Authorization;
    } else if (event.headers.hasOwnProperty("authorization")) {
        authorization = event.headers.authorization;
    }
    return authorization;
}