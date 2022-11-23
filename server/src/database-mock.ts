import connect, {sql} from '@databases/sqlite';

export {sql};

const db = connect(); // in memory db
export default db;