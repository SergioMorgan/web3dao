import { Button, Paper, Stack, Typography } from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

export default function MetaConnect () {
    const [errorMessage, setErrorMessage] = useState(null);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    // When the component first renders, set up event listeners for accountsChanged and 
    // chainChanged. The arguments are functions that will be explained further down.
    // [] ->  loading once with the component
    useEffect(() => {
        if (window.ethereum) {
            console.log("Window ethereum: ", window.ethereum);
            window.ethereum.on("accountsChanged", accountsChanged);
            window.ethereum.on("chainChanged", chainChanged);
        }
    }, []);


    // When MetaMask is installed, the window object has an ethereum property to
    // interact with. When you call "window.ethereum.request", your MetaMask
    // extension should open and ask what account you would like to connect to.

    const connectHandler = async () => {
        if (window.ethereum) {
            try {

                // This is the function that makes the initial connection MetaMask.
                const res = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                await accountsChanged(res[0]);
            } catch (err) {
                console.error(err);
                setErrorMessage("There was a problem connecting to MetaMask");
            }
        } else {
            setErrorMessage("Install MetaMask");
        }
    };


    // Helper function that handles new accounts. It sets the new account
    // value in the state "setAccount", then gets and formats the balance of
    // the account. The balance is requested using an ethereum JSON-RPC method
    const accountsChanged = async (newAccount) => {
        setAccount(newAccount);
        console.log("newAccount: ", newAccount);
        console.log("Account: ", account);
        try {
            const balance = await window.ethereum.request({
                method: "eth_getBalance",
                params: [newAccount.toString(), "latest"],
            });
            setBalance(ethers.utils.formatEther(balance));
        } catch (err) {
            console.error(err);
            setErrorMessage("There was a problem connecting to MetaMask");
        }
    };

    // It does a connection reset when you change chains
    const chainChanged = () => {
        setErrorMessage(null);
        setAccount(null);
        setBalance(null);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6"> Account: {account} </Typography>
                <Typography variant="h6">
                    Balance: {balance} {balance ? "ETH" : null}
                </Typography>
                <Button onClick={connectHandler}>Connect Account</Button>
                {errorMessage ? (
                    <Typography variant="body1" color="red">
                        Error: {errorMessage}
                    </Typography>
                ) : null}
            </Stack>
        </Paper>
    );
};

// export default WalletCard;
