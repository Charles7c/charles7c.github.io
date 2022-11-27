import { request } from './config'

export const getPv = (id, call) => {
    request.get(`/pv/${id}`, {}).then(result => {
        call(process(result))
    })
}

function process(result) {
    if (result.code === 200) {
        return result.data
    } else {
        console.log(result.msg)
    }
}

export default { getPv }