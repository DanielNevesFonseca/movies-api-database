import { Request, Response } from "express";
import { client } from "./database";
import { QueryConfig } from "pg";
import format from "pg-format";
import { TMovieUpdateBody } from "./interfaces";

export const readAllMovies = async (req: Request, res: Response) => {
  const queryString = `
  SELECT * FROM movies;
  `;

  const query = await client.query(queryString);
  return res.status(200).json(query.rows);
};

export const readMovieById = async (req: Request, res: Response) => {
  return res.status(200).json(res.locals.movieData);
};

export const createMovie = async (req: Request, res: Response) => {
  const queryString = `
  INSERT INTO movies (name, category, duration, price)
  VALUES ( $1, $2, $3, $4)
  RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [
      req.body.name,
      req.body.category,
      req.body.duration,
      req.body.price,
    ],
  };

  const query = await client.query(queryConfig);

  return res.status(201).json(query.rows[0]);
};

export const deleteMovieById = async (req: Request, res: Response) => {
  const queryString = `
  DELETE FROM movies WHERE id = $1
  RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [req.params.id],
  };

  await client.query(queryConfig);

  return res.status(204).json();
};

export const updatePartialMovie = async (req: Request, res: Response) => {
  let objectData: TMovieUpdateBody = {};

  Object.entries(req.body).forEach(([key, value]) => {
    if (key === "name" || key === "category") {
      if (typeof value === "string") {
        objectData[key] = value;
      }
    } else if (key === "price" || key === "duration") {
      if (typeof value === "number") {
        objectData[key] = value;
      }
    }
  });

  const queryString = format(
    `
    UPDATE movies SET (%I) = ROW (%L) WHERE id = %L RETURNING *;
  `,
    Object.keys(objectData),
    Object.values(objectData),
    req.params.id
  );

  const query = await client.query(queryString);

  const updatedMovieObject = query.rows[0];

  return res.status(200).json(updatedMovieObject);
};
