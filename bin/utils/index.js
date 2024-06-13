import axios from "axios";

/**
 * @description: 获取线上数据
 */
export async function getOnlineData(key) {
    return new Promise((resolve, reject) => {
        axios.get(`https://my.wyhaoran.site/haoran-cli.json?_t=${new Date().getTime()}`).then(res => {
            resolve(res?.data?.[key])
        }).catch(()=>{resolve()})
    })
}
