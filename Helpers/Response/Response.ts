export class ResponseObject { 
    message: string = ""
    success: boolean = false
    data: object = {};
    jwtExpired: boolean; 
    constructor(message: string, success: boolean, data?: object, jwtExpired?: boolean) { 
        this.message = message
        this.success = success
        this.data = data ?? {};
        this.jwtExpired = jwtExpired ?? false;
    }
}
