const db = require('../database');

interface Payload {
  token: string;
  userId: string;
}

class ConfirmationTokenRepository {

  async findOne({
    token,
    userId
  }: Payload) {
    const [row] = await db.query(`
      SELECT *
      FROM confirmation_tokens
      WHERE confirmation_tokens.confirmation_token = $1
        AND confirmation_tokens.user_id = $2
    `, [token, userId]);

    return row;
  }

  async create({
    token,
    userId
  }: Payload) {
    const [row] = await db.query(`
      INSERT INTO confirmation_tokens(confirmation_token, user_id)
      VALUES ($1, $2) RETURNING *
    `, [token, userId]);

    return row;
  }

  async delete(userId: string) {
    const [row] = await db.query(`
      DELETE
      FROM confirmation_tokens
      WHERE confirmation_tokens.user_id = $1
    `, [userId]);

    return row;
  }
}

export default new ConfirmationTokenRepository();
