import { PUBLIC_SERVER_URL, PUBLIC_FILE_SERVER_URL } from "$env/static/public";
import type Attachment from "./Attachment";

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

    static async sendMultipart(location: string, body: XMLHttpRequestBodyInit | Document, method: RestMethod = RestMethod.POST): Promise<Response> {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.timeout = 2000;
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        resolve(xhr.response)
                    } else {
                        reject(`Multipart HTTP Error occure with status code ${xhr.status}: ${xhr.responseText}`);
                    }
                }
            }
            xhr.ontimeout = function () {
                reject('timeout')
            }
            xhr.open(method, `${PUBLIC_SERVER_URL}/${location}`, true);
            xhr.setRequestHeader("Authorization", Rest.token);
            xhr.send(body);
        })
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
                Accept: "application/json"
            }
        })).json();
    }

    /**
     * Issues a bodyless GET request to the specified location
     * @param location The url that needs to be checked
     * @returns Whether the requested location is accessible (`Response.ok`)
     */
    static async isTokenValid(location: string): Promise<boolean> {
        return (await fetch(`${PUBLIC_SERVER_URL}/${location}`, {
            method: RestMethod.GET,
            headers: {
                "Content-Type": "application/json",
                Authorization: Rest.token,
            }
        })).ok;
    }

    static async getAttachment(attachment: Attachment) {
        return fetch(`${PUBLIC_FILE_SERVER_URL}/${attachment.endpoint}`, {
            method: RestMethod.GET,
            headers: {
                Authorization: Rest.token,
            },
        });
    }
}