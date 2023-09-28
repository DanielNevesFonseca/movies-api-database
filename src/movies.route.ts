import { Router } from "express";
import {
  createMovie,
  deleteMovieById,
  readAllMovies,
  readMovieById,
  updatePartialMovie,
} from "./logic";
import { hasCategoryQuery, hasValidId, hasValidName } from "./middlewares";

export const moviesRoute = Router();

moviesRoute.get("/", hasCategoryQuery, readAllMovies);

moviesRoute.get("/:id", hasValidId, readMovieById);

moviesRoute.post("/", hasValidName, createMovie);

moviesRoute.patch("/:id", hasValidId, hasValidName, updatePartialMovie);

moviesRoute.delete("/:id", hasValidId, deleteMovieById);
