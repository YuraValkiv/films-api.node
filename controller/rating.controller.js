const db = require("../db");

class RatingController {

    async addRatingToFilmById(req, res) {
        const film_id = req.params.id;
        const rating = req.params.rating;
        await db.query("INSERT INTO ratingss (film_id, rating) values ($1, $2)", [film_id, rating]);
        
        //setAverageAuto
        const allRatingFilm = (await db.query("SELECT * FROM ratingss where film_id = $1", [1])).rows; 
        let avg = 0;
        let i = allRatingFilm.length;
        for (let rat of allRatingFilm) {
            avg += rat.rating;
        }
        const averageRating = (avg/i).toFixed(0);
        await db.query("UPDATE film SET rating = $1 WHERE id = $2", [averageRating, film_id])
        
        res.json({
            "avg": averageRating,
            "allRatingList": allRatingFilm
        });
    }
}


module.exports = new RatingController;