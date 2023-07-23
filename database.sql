CREATE table film
(
    id          SERIAL PRIMARY KEY,
    name        varchar(255),
    description text,
    rating      int CHECK (rating >= 0 AND rating <= 5) default 0
);

CREATE table tags
(
    id SERIAL PRIMARY KEY,
    film_id int references film (id),
    tag_name varchar(255)
);

CREATE table ratingss
(
    id      SERIAL PRIMARY KEY,
    film_id int references film (id),
    rating  int CHECK (rating >= 0 AND rating <= 5)
);