import { Pagination } from "@mui/material";

type Props = {
  postsPerPage: number;
  totalPosts: number;
  paginate: (number: number) => void;
};

export const PaginationPage = ({
  postsPerPage,
  totalPosts,
  paginate,
}: Props) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  return (
    <Pagination
      count={pageNumbers.length}
      onChange={(event, value) => paginate(value)}
    />
  );
};
