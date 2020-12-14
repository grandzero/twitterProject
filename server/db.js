const Pool = require('pg').Pool;
/**'SELECT * FROM daily_user_data ORDER BY likes DESC LIMIT 30' */
const pool = new Pool({
    user:"username",
    password:"password",
    host:"<hostIP>",
    database:"dbname",
    port:"5432"
});

module.exports = pool;