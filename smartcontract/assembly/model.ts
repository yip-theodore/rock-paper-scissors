import { PersistentUnorderedMap, u128 } from 'near-sdk-as'

@nearBindgen
export class Entry {
    p1: string
    p: u32
    c: u32
    result: string
    bet: u128
}

export const history = new PersistentUnorderedMap<i32, Entry>('h')
