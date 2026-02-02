
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import fs from 'fs';
import path from 'path';

async function main() {
    const p = path.join(process.cwd(), '../.env.local');
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8').trim();
        const wallet = await generateWallet({
            secretKey: content,
            password: 'password'
        });
        const address = getStxAddress({ account: wallet.accounts[0] });
        console.log(`Wallet Address: ${address}`);
    } else {
        console.log("No .env.local found");
    }
}

main();
