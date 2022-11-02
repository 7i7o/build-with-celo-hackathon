import { FaMagic } from 'react-icons/fa';
import React, { useState } from 'react';
import { Text, Heading, Button } from '@chakra-ui/react';
import { useSession, signIn, getSession, signOut } from "next-auth/react";
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ConnectButton} from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import styles from '../../styles/home.module.scss';
import '@rainbow-me/rainbowkit/styles.css';

import connectMongo from '../../utils/connectMongo';
import Sacuda from '../../models/sacudaModel';

const walletConnect = () => {
  const router = useRouter();
  const { isConnected, address } = useAccount()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
     signIn(); //What to show to unathenticated users
    }
  })
  const [userMail, setUserMail] = useState('');

  const writeProfileBasics = async () => {
    const res = await fetch('/api/handler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet: `${address}`,
        email: `${session.user.email}`,
      }),
    });
    const data = await res.json();
  };

  const getUserEmail = async () => {
    const res = await fetch('/api/userByEmail/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session.user.email),
    });
    const data = await res.json();
    setUserMail(data.email)
  };  

  const mainRedirect = () => {
    router.push('/selection') }

  if (status === "loading") {
    return "Loading..."
  }

    if (isConnected) {
      getUserEmail()
        if (userMail===session.user.email) {
        mainRedirect();
      }
          else
            if (userMail===null) {
            console.log('Writing profile for:'+session.user.email)
            writeProfileBasics()
            }
              else {
                signOut()
              }
  }
    else

  return(
    <>
    <main className={styles.container}>
        <Head>
        <title>Sacuda | Connect your wallet</title>
        </Head>
        <Heading as={'h1'}>
            Just one more step!
        </Heading>
        <Text 
            as={'h2'}
            marginTop='1%'
            marginBottom='1%'
        >
            Now you must connect your favourite Celo compatible web3 wallet in order to fully enjoy the Sacuda experience!
        </Text>
            <ConnectButton />
        </main>
    </>
  )
}

export default walletConnect;