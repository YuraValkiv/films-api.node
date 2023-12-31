const db = require("../db");
const multer = require("multer");
const url = require("url");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

class FilmController {

    async createFilm(req, res) {
        //film create
        const {name, description, url, tags} = req.body;
        const newFilm = await db.query(`INSERT INTO film (name, description, url)
                                        VALUES ($1, $2, $3) RETURNING id`, [name, description, url]);
        const film_id = newFilm.rows[0].id;

        //tags bind
        if (tags && Array.isArray(tags)) {
            for (const tag of tags) {
                console.log(tag);
                const tag_id = await getOrCreateTag(tag);

                await db.query("INSERT INTO film_tags (film_id, tag_id) VALUES ($1, $2)", [film_id, tag_id]);
            }
        }

        res.json({
            "film": newFilm,
            "tags": tags
        });
    }

    async searchFilmByTag(req, res) {
        //parse req
        const tags = req.params.tags;
        const arrTags = tags.split(",");
        const len = arrTags.length;

        // finding sql query
        const filmsByTags = await db.query(`
            SELECT film.*
            FROM film
                     JOIN film_tags ON film.id = film_tags.film_id
                     JOIN tags ON film_tags.tag_id = tags.id
            WHERE tags.name = ANY ($1::text[])
            GROUP BY film.id
            HAVING COUNT(DISTINCT tags.id) = $2;
        `, [arrTags, len]);

        res.json(filmsByTags.rows);
        }

    async getFilms(req, res) {
        const films = await db.query("SELECT * FROM film");
        res.json(films.rows);
    }

    async getFilm(req,res) {
        const id = req.params.id;
        const film = await db.query("SELECT * FROM film where id = $1", [id]);
        console.log(film);
        res.json(film.rows[0]);
    }

    async editFilm(req, res) {
        const {id, name, description, tags} = req.body;
        //update fields film
        const film = await db.query("UPDATE film set name = $1, description = $2 where id = $3 RETURNING *", [name, description, id]);

        //remove old tags
        await db.query("DELETE FROM film_tags WHERE film_id = $1", [id]);
    
        // add new tags
        if (tags && Array.isArray(tags)) {
            for (const tag of tags) {
                console.log(tag);
                const tag_id = await getOrCreateTag(tag);
                await db.query("INSERT INTO film_tags (film_id, tag_id) VALUES ($1, $2)", [id, tag_id]);
            }
        }

        res.json(film.rows[0]);
    }

    async deleteFilm(req, res) {
        const id = req.params.id;
        const film = await db.query("DELETE FROM film where id = $1", [id]);
        res.json(film.rows[0]);
    }
}

const getOrCreateTag = async (tag) => {
    const existingTag = await db.query(`SELECT * FROM tags WHERE name = $1`, [tag]);
    if (existingTag.rows.length > 0) {
        return existingTag.rows[0].id; 
    } else {
        const newTag = await db.query(`INSERT INTO tags (name) VALUES ($1) RETURNING id`, [tag]);
        return newTag.rows[0].id;
    }
}

module.exports = new FilmController;