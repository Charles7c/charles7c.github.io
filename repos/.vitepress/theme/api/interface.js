import { request } from './config'

export const getPv = (id, call) => {
    request.get(`/pv/${id}`, {}).then(result => {
        call(process(result))
    })
}

function process(result) {
    if (result.code === 1) {
        return result.data
    } else {
        console.log("系统异常:", result)
    }
}

export default { getPv }