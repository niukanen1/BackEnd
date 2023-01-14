export class ResponseObject { 
    message: string = ""
    success: boolean = false
    data: object = {};
    constructor(message: string, success: boolean, data?: object) { 
        this.message = message
        this.success = success
        this.data = data ?? {}; 
    }
}
