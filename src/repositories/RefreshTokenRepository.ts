const db = require('../database');

interface Payload {
  token: string;
  userId: string;
}

class RefreshTokenRepository {

  async findOne({
    token,
    userId
  }: Payload) {
    const [row] = await db.query(`
      SELECT *
      FROM refresh_tokens
      WHERE refresh_tokens.refresh_token = $1
        AND refresh_tokens.user_id = $2
    `, [token, userId]);

    return row;
  }

  async create({
    token,
    userId
  }: Payload) {
    const [row] = await db.query(`
      INSERT INTO refresh_tokens(refresh_token, user_id)
      VALUES ($1, $2) RETURNING *
    `, [token, userId]);

    return row;
  }

  async delete(userId: string) {
    const [row] = await db.query(`
      DELETE
      FROM refresh_tokens
      WHERE refresh_tokens.user_id = $1
    `, [userId]);

    return row;
  }
}

export default new RefreshTokenRepository();
