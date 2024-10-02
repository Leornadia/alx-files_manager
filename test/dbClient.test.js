import { expect } from 'chai';
import dbClient from '../utils/db';

describe('dbClient', () => {
  it('should connect to MongoDB', async () => {
    const isConnected = await dbClient.isAlive();
    expect(isConnected).to.be.true;
  });

  it('should return the number of users in the DB', async () => {
    const numOfUsers = await dbClient.nbUsers();
    expect(numOfUsers).to.be.a('number');
  });

  it('should return the number of files in the DB', async () => {
    const numOfFiles = await dbClient.nbFiles();
    expect(numOfFiles).to.be.a('number');
  });
});

