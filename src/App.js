import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { createClient } from 'urql'
import { login, logout as destroy, accountBalance } from "./utils/near";
import Wallet from "./components/Wallet";
import { Notification } from "./components/utils/Notifications";
import Play from "./components/rock-paper-scissors/Play"
import Cover from "./components/utils/Cover";
import coverImg from "./assets/img/sandwich.jpg";
import "./App.css";

const client = createClient({ url: 'https://api.thegraph.com/subgraphs/id/QmTkwkWEjEksXyF8KNqANr1WsV9TpsFo4houc3SyojuoEp' })

const App = function AppWrapper() {
  const account = window.walletConnection.account();

  const [games, setGames] = useState([]);
  const [balance, setBalance] = useState("0");

  const getGames = async () => {
    const { data } = await client.query(`
      {
        games(orderBy: timestamp, orderDirection: desc) {
          id
          from {
            id
          }
          played
          result
          bet
          timestamp
        }
      }
    `).toPromise()
    window.games = data.games
    setGames(window.games)
  }

  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());
    }
  });

  useEffect(() => {
    getGames()
    getBalance();
  }, [getBalance]);

  return (
    <>
      <Notification />
      <Container fluid="md">
        <Nav className="justify-content-end pt-3 pb-5">
          <Nav.Item>
            <Wallet
              address={account.accountId}
              amount={balance}
              symbol="NEAR"
              login={login}
              destroy={destroy}
            />
          </Nav.Item>
        </Nav>
        <main>
          <Play games={games} login={!account.accountId && login} />
        </main>
      </Container>
    </>
  );
};

export default App;
