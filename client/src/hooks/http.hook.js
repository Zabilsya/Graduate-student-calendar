import { useState, useCallback } from 'react'
import axios from "axios";

export const useHttp = () => {
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            let response
            let data = null

            switch (method) {
                case 'GET':
                    response = await axios.get(url)
                    break
                case 'POST':
                    response = await axios.post(url, { method, body, headers })
                    break
                default:
                    throw new Error('Что-то пошло не так')
            }

            if (!response.data.success) {
                alert(response.data.message);
            } else {
                data = response.data.message
            }

            return data
        } catch (e) {
            alert('Что-то пошло не так');
        }
    }, [])

    return request
}