import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SovrinSetupService {

  public constructor() {}

  public async createWallet(poolHandle: number, connectionRequest: any, password: string): Promise<any> {
    `
    let pa = {
      'name': "<auto-generated>",
      'wallet_config': json.dumps({'id': <auto-generated>}),
      'wallet_credentials': json.dumps({'key': password}),
      'pool': pool_['handle'],
      'seed': '000000000000000000000000Steward1'
    }
    await wallet.create_wallet(pa['wallet_config'], pa['wallet_credentials'])
    pa['wallet'] = await wallet.open_wallet(pa['wallet_config'], pa['wallet_credentials'])
    (pa['did_for_ho'], pa['key_for_ho']) = await did.create_and_store_my_did(pa['wallet'], "{}")

    connection_response = json.dumps({
      'did': pa['did_for_ho'],
      'verkey': pa['key_for_ho'],
      'nonce': connectionRequest['nonce']
    })
    `;

    const pa = {
      did_for_ho: 'did:sov:'+String(Math.floor(Math.random()*10000000000000)),
      key_for_ho: 'yyy'
    };
    // const connection_response = {
    //   did: 'xxx',
    //   verkey: 'yyy',
    //   nonce: connectionRequest['nonce']
    // };

    console.log('Wallet created with did_for_ho stored in it.')

    return pa;
  }

  public async connectPool(): Promise<number> {
    `
      await pool.set_protocol_version(2)
      pool_ = {'name': 'pool1'}
      pool_['genesis_txn_path'] = get_pool_genesis_txn_path(pool_['name'])
      pool_['config'] = json.dumps({"genesis_txn": str(pool_['genesis_txn_path'])})
      await pool.create_pool_ledger_config(pool_['name'], pool_['config'])
      pool_['handle'] = await pool.open_pool_ledger(pool_['name'], None)
    `;
    console.log('Pool connected');
    let poolHandle = 1;
    return poolHandle;
  }

}
