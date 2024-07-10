import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";
import dayjs from "dayjs";
import sleepPromise from 'sleep-promise';

export default async function (fastify, options) {
    const task = new AsyncTask(
        'demo_task_1',
        async (jobId) => {
            fastify.log.info(`job [demo_task_1] start at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
            // 60秒后执行下一次任务(测试任务未执行完，抛弃后续执行)
            await sleepPromise(1000 * 60)
            return fastify.log.info(`job [demo_task_1] resole at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
        },
        (err) => {
            console.error(err);
        }
    );
    // 定义任务执行间隔20s
    const job = new SimpleIntervalJob({ seconds: 20, }, task)
    fastify.scheduler.addSimpleIntervalJob(job);

}