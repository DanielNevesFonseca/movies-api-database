import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";

export const hasValidId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryString = `SELECT * FROM movies WHERE id = $1`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [req.params.id],
  };

  const query = await client.query(queryConfig);

  if (query.rowCount === 0) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  res.locals.movieData = query.rows[0];

  return next();
};

export const hasValidName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryString = `SELECT FROM movies WHERE name ILIKE $1;`;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [req.body.name],
  };

  const query = await client.query(queryConfig);
  if (query.rowCount !== 0) {
    return res.status(409).json({ message: "Movie name already exists!" });
  }

  return next();
};

export const hasCategoryQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.query.category) {
    const queryString = `
      SELECT * FROM movies WHERE category = $1;
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [req.query.category],
    };

    const query = await client.query(queryConfig);

    if (query.rowCount !== 0) {
      return res.status(200).json(query.rows);
    }
  }

  return next();
};
