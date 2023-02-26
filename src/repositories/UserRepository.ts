const db = require('../config/database');

interface User {
  id: string,
  name: string,
  email: string,
  password: string,
  active: boolean
}

class UserRepository {

  async findById(id: string) {
    const [row] = await db.query('SELECT * FROM users WHERE id = $1', [id]);

    return row as User;
  }

  async findByEmail(email: string) {
    const [row] = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    return row as User;
  }

  async activate(userId: string) {
    await db.query(`
        UPDATE users
        SET active = true
        WHERE id = $1;
    `, [userId]);
  }

  async create({
    name,
    email,
    password
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const [row] = await db.query(`
        INSERT INTO users(name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *
    `, [name, email, password]);

    return row as User;
  }
}

export default new UserRepository();
