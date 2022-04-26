import React, { useState, useEffect } from 'react'
import { parseNearAmount, formatNearAmount } from "near-api-js/lib/utils/format";

const Play = () => {
  const [p, setP] = useState(null)
  const [bet, setBet] = useState('0.1')
  const [history, setHistory] = useState([])
  useEffect(() => {
    window.contract.getHistory().then(setHistory)
  }, [])
  return (
    <>
      <h2 className='ms-2 text-warning mb-3'>Rock / paper / scissors</h2>
      <form className='d-flex pb-3' onSubmit={e => {
        e.preventDefault()
        window.contract.play({ p }, undefined, parseNearAmount(bet))
      }}>
        <div class='ms-2 btn-group'>
          <button onClick={() => setP(0)} className={`btn ${p === null ? 'btn-outline-light' : p === 0 ? 'btn-light' : 'opacity-25'}`} type='button'>🤛</button>
          <button onClick={() => setP(1)} className={`btn ${p === null ? 'btn-outline-light' : p === 1 ? 'btn-light' : 'opacity-25'}`} type='button'>🖐</button>
          <button onClick={() => setP(2)} className={`btn ${p === null ? 'btn-outline-light' : p === 2 ? 'btn-light' : 'opacity-25'}`} type='button'>✌️</button>
        </div>
        <select value={bet} onChange={e => setBet(e.target.value)} className='ms-2 form-select form-select-sm w-auto'>
          <option value='0.1' label='0.1 NEAR' />
          <option value='0.2' label='0.2 NEAR' />
          <option value='0.3' label='0.3 NEAR' />
        </select>
        <button className='ms-2 btn btn-warning' type='submit' disabled={p === null}>play</button>
      </form>
      <ul className='mt-3'>
        {[...history].reverse().map(entry => (
          <li className='lh-sm mb-2'>
            {{
              tie: '😬', win: '🥳', loss: '😢'
            }[entry.result]}&nbsp; <a href={`https://explorer.testnet.near.org/accounts/${entry.p1}`} target='_blank' rel='noreferrer'>{entry.p1 || 'somebody'}</a> {{
              tie: 'bet', win: 'won', loss: 'lost'
            }[entry.result]} <code>{formatNearAmount(entry.bet)} NEAR</code>&nbsp; playing {[
              '🤛', '🖐', '✌️'
            ][entry.p]}&nbsp; against {[
              '🤛', '🖐', '✌️'
            ][entry.c]}
          </li>
        ))}
      </ul>
    </>
  )
}

export default Play