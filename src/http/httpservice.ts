import { AxiosRequestConfig, AxiosResponse, default as axios } from 'axios';

export const httpService = (function () {

    return {
        // get: axios.get,
        // post: axios.post,
        // patch: axios.patch,

        async get<T>(url: string, config?: AxiosRequestConfig) {
            //console.log('GET REQUEST', {url})
            return await axios.get(url, config)
        },
        async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
            //console.log('POST REQUEST', {url})
            return await axios.post(url, data, config).catch(error => {
                if (error.response) {
                    console.error('ERROR in POST', {
                        request: {
                            url,
                            //data,
                        },
                        response: {
                            //data: error.response.data,
                            status: error.response.status,
                            statusText: error.response.statusText,
                        }
                    })
                }
                throw error;
            })
        },
        async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
            //console.log('PATCH REQUEST', {url})
            return await axios.patch(url, data, config)
        },
    }

}())