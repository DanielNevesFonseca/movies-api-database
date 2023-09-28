interface IMovie {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
}

export type TMovieUpdateBody = Partial<
  Pick<IMovie, "name" | "category" | "price" | "duration">
>;
