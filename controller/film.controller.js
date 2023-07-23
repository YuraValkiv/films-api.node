const db = require("../db");
const TagChecker = require("../utils/Util");

class FilmController {

    async createFilm(req, res) {        
        //film create
        const { name, description, tags } = req.body;
        const newFilm = await db.query(`INSERT INTO film (name, description) VALUES ($1, $2) RETURNING id`, [name, description]);
        const film_id = newFilm.rows[0].id;

        //tags bind 
        if (tags && Array.isArray(tags)) {
            for (const tag of tags) {
                console.log(tag);
                const tag_id = await TagChecker.getOrCreateTag(tag);
                
                await db.query("INSERT INTO film_tags (film_id, tag_id) VALUES ($1, $2)", [film_id, tag_id]);
            }
        }

        res.json({
            "film": newFilm,
            "tags": tags
        });
    }

    async searchFilmByTag(req, res) {
        const {tags} = req.body;
        for (let tag of tags) {

        }


        res.json();
    }

    async getFilms(req, res) {
        const films = await db.query("SELECT * FROM film");
        res.json(films.rows);
    }
    async getFilm(req,res) {
        const id = req.params.id;
        const film = await db.query("SELECT * FROM film where id = $1", [id]);
        res.json(film.rows[0]);
    }
    async editFilm(req, res) {
        const {id, name, description} = req.body;
        const film = await db.query("UPDATE film set name = $1, description = $2 where id = $3 RETURNING *", [name, description, id]);
        res.json(film.rows[0]);
    }
    async deleteFilm(req, res) {
        const id = req.params.id;
        const film = await db.query("DELETE FROM film where id = $1", [id]);
        res.json(film.rows[0]);
    }
}

module.exports = new FilmController;