import { RPCClient } from '@alicloud/pop-core'

export default async function (fastify, options, done) {
    const client = new RPCClient({
        accessKeyId: 'xxxxx',
        accessKeySecret: 'xxxxx',
        endpoint: 'http://abc',
        apiVersion: 'efg'
    });

    const params = {
        PhoneNumbers: "****",//接收短信的手机号码
        SignName: "阿里云测试",//短信签名名称
        TemplateCode: "SMS_2xxxx****" //短信模板CODE
    }

    const requestOption = {
        method: 'POST'
    };

    const result = await client.request('SendSms', params, requestOption);
    console.log(result);

    const mail = require('./mail')
    mail.sendMail({}, {})
}