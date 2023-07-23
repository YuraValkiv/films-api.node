const { getOrCreateTag } = require("../controller/film.controller");
const db = require("../db");

class Tager {
    async getOrCreateTag(tag) {
        const existingTag = await db.query(`SELECT * FROM tags WHERE name = $1`, [tag]);
        if (existingTag.rows.length > 0) {
            return existingTag.rows[0].id; 
        } else {
            const newTag = await db.query(`INSERT INTO tags (name) VALUES ($1) RETURNING id`, [tag]);
            return newTag.rows[0].id;
        }
    }
}

module.exports = new Tager;