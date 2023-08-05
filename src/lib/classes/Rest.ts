import { PUBLIC_SERVER_URL } from "$env/static/public";

export enum RestMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    DELETE = "DELETE",
}

export default class Rest {
    static token: string;

    /**
     * Sends a request to the server with the given body(stringified)
     * @param location 
     * @param body 
     * @param method 
     * @returns 
     */
    static async sendToServer(location: string, body: any, method: RestMethod = RestMethod.POST): Promise<Response> {
        return fetch(`${PUBLIC_SERVER_URL}/${location}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: Rest.token,
            },
            body: JSON.stringify(body),
        });
    }

    /**
     * Sends a bodyless request to the server
     * @param location 
     * @param method 
     * @returns 
     */
    static async getFromServer(location: string, method: RestMethod = RestMethod.GET): Promise<Response> {
        return fetch(`${PUBLIC_SERVER_URL}/${location}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: Rest.token,
            }
        });
    }

    /**
     * Sends a bodyless request to the server, already wrapped the json parsing part
     * @param location 
     * @param method 
     * @returns 
     */
    static async getJsonFromServer(location: string, method: RestMethod = RestMethod.GET): Promise<any> {
        return (await fetch(`${PUBLIC_SERVER_URL}/${location}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: Rest.token,
            }
        })).json();
    }

    /**
     * Issues a bodyless GET request to the specified location
     * @param location The url that needs to be checked
     * @returns Whether the requested location is accessible (`Response.ok`)
     */
    static async isTokenValid(location: string): Promise<boolean> {
        return  (await fetch(`${PUBLIC_SERVER_URL}/${location}`, {
            method: RestMethod.GET,
            headers: {
                "Content-Type": "application/json",
                Authorization: Rest.token,
            }
        })).ok;
    }
}