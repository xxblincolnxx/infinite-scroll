import { Movie } from '../types';

type Props = {
  movie: Movie;
  ref?: React.Ref<HTMLDivElement>;
};

const ScrollItem = ({ movie, ref }: Props) => {
  return (
    <div ref={ref} className='container p-4 rounded bg-sky-200 m-2'>
      <h1 className='font-bold'>{movie.title}</h1>
      <p>{movie.release_date}</p>
      <p>{movie.overview}</p>
    </div>
  );
};

export default ScrollItem;
