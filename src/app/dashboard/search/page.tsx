"use client";

import { PaginationPage } from "@/components/common/pagination";
import { User } from "@/components/dashboard/user-card";
import { LabReportUpload } from "@/components/dashboard/view";
import { Button, Grid, Pagination } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import queryString from "query-string";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const query = queryString.stringify(searchParams);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        new URL(
          `/api/search-patient?${query}`,
          process.env.NEXT_PUBLIC_API_URL as string
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      const data = await res.json();
      setSearchResults(data.data);
    };
    fetchData();
  }, [query]);
  console.log(searchResults);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchResults.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => {
    console.log(currentPosts);
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
          <Grid container spacing={2} direction="row">
            {currentPosts.map((result, index) => (
              <Grid key={index} item xs={12}>
                <User results={result} />
              </Grid>
            ))}
            {searchResults.length === 0 && (
              <Grid item xs={12}>
                <h2>No Results Found</h2>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <PaginationPage
            postsPerPage={postsPerPage}
            totalPosts={searchResults.length}
            paginate={paginate}
          />
        </Grid>
      </Grid>
    </div>
  );
}
