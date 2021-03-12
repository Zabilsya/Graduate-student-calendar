import { useCallback } from 'react'

export const useRequest = () => {

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        let response
        let data = null
        try {
            // console.log(body)
            // if (body) {
            //     body = JSON.stringify(body)
            //     headers['Content-Type'] = 'application/json'
            // }


            // switch (method) {
            //     case 'GET':
            //         response = await axios.get(url)
            //         break
            //     case 'POST':
            //         response = await axios.post(url, body)
            //         break
            //     default:
            //         throw new Error('Что-то пошло не так')
            // }

            if (!response.data.success) {
                alert(response.data.message);
            } else {
                data = response.data.message
            }

            return data
        } catch (e) {
            // alert(response.data.message);
        }
    }, [])

    return request
}