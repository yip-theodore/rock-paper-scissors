import { context, ContractPromiseBatch, math, u128 } from 'near-sdk-as'
import { Entry, history } from './model'

function _random32(): u32 {
    const bytes = math.randomBuffer(4)
    return bytes[3] << 0 | bytes[2] << 8 | bytes[1] << 16 | bytes[0] << 24
}

export function play(p: u32): string {
    if (context.attachedDeposit > u128.from('1000000000000000000000000')) {
        throw new Error('incorrect deposit: cannot deposit more that 1Near')
    }
    const c = _random32() % 3
    if (p == c) {
        ContractPromiseBatch.create(context.sender).transfer(context.attachedDeposit)
        history.set(history.length, { p1: context.sender, p, c, result: 'tie', bet: context.attachedDeposit })
        return 'it’s a tie'
    }
    if (p == 2 && c == 1 || p == 1 && c == 0 || p == 0 && c == 2) {
        ContractPromiseBatch.create(context.sender).transfer(u128.mul(context.attachedDeposit, u128.from('2')))
        history.set(history.length, { p1: context.sender, p, c, result: 'win', bet: context.attachedDeposit })
        return 'you won'
    }
    history.set(history.length, { p1: context.sender, p, c, result: 'loss', bet: context.attachedDeposit })
    return 'you lost'
}

export function getHistory(): Array<Entry> {
    return history.values()
}
