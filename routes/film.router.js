const Router = require("express");
const router = new Router();
const filmController = require("../controller/film.controller");
const ratingController = require("../controller/rating.controller");

router.post("/create", filmController.createFilm);
router.get("/all", filmController.getFilms);
router.get("/one/:id", filmController.getFilm);
router.put('/edit', filmController.editFilm);
router.delete('/delete/:id', filmController.deleteFilm);
router.post("/add/:id/:rating", ratingController.addRatingToFilmById);
router.get("/tags/:tags", filmController.searchFilmByTag);


module.exports = router;