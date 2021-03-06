const mysql = require('../database/mysql');

module.exports.activateUser = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.render('activate', {
      successful: false
    });
  }

  const connection = await mysql.getConnection();

  const [
    codeQueryResult
  ] = await connection.execute(
    'SELECT * FROM `activation_codes` where `activation_code` = ?',
    [code]
  );

  if (codeQueryResult.length === 0) {
    return res.render('activate', {
      successful: false
    });
  }

  const userID = codeQueryResult[0].user_id;

  await connection.execute(
    'UPDATE `rng_users` SET  `verified` = ? WHERE `user_id`= ? ',
    [true, userID]
  );

  return res.render('activate', {
    successful: true
  });
};