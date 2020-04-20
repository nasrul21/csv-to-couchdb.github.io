import PouchDB from 'pouchdb';

export default class DB {
    private db : PouchDB.Database<{}>

    constructor(url: string) {
        this.db = new PouchDB(url);
    }

    public testConncetion() {
        return this.db.info();
    }

    public insert(data: {}[]) {
        return this.db.bulkDocs(data);
    }
}