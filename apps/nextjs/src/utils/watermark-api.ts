import axios from 'axios';

// 기본 DNS 설정
const defaultDNS = 'http://127.0.0.1:8000';

// axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: defaultDNS,
    headers: {
    'Content-Type': 'application/json',
    },
});

const customAxiosIns = {
    get: (url: string, params: any) =>
        new Promise((resolve, reject) => {
            axiosInstance
                .get(url, params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        }),
    post: (url: string, data: any, params: any) =>
        new Promise((resolve, reject) => {
            axiosInstance
                .post(url, data, params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        }),
    put: (url: string, data: any, params: any) =>
        new Promise((resolve, reject) => {
            axiosInstance
                .put(url, data, params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        }),
    delete: (url: string, params: any) =>
        new Promise((resolve, reject) => {
            axiosInstance
                .delete(url, params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        }),
}

export { customAxiosIns as wmAPI }