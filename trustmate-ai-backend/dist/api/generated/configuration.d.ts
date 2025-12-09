interface AWSv4Configuration {
    options?: {
        region?: string;
        service?: string;
    };
    credentials?: {
        accessKeyId?: string;
        secretAccessKey?: string;
        sessionToken?: string;
    };
}
export interface ConfigurationParameters {
    apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>);
    username?: string;
    password?: string;
    accessToken?: string | Promise<string> | ((name?: string, scopes?: string[]) => string) | ((name?: string, scopes?: string[]) => Promise<string>);
    awsv4?: AWSv4Configuration;
    basePath?: string;
    serverIndex?: number;
    baseOptions?: any;
    formDataCtor?: new () => any;
}
export declare class Configuration {
    apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>);
    username?: string;
    password?: string;
    accessToken?: string | Promise<string> | ((name?: string, scopes?: string[]) => string) | ((name?: string, scopes?: string[]) => Promise<string>);
    awsv4?: AWSv4Configuration;
    basePath?: string;
    serverIndex?: number;
    baseOptions?: any;
    formDataCtor?: new () => any;
    constructor(param?: ConfigurationParameters);
    isJsonMime(mime: string): boolean;
}
export {};
