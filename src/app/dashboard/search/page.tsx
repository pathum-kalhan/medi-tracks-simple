"use client";

import { PaginationPage } from "@/components/common/pagination";
import { User } from "@/components/dashboard/user-card";
import { ViewPatient } from "@/components/dashboard/view";
import { Button, Grid, Pagination } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const searchResults = new Array(20).fill(0).map((_, index) => {
    return {
      name: `John Doe ${index}`,
      gender: index % 2 === 0 ? "Male" : "Female",
      age: index + 20,
    };
  });

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
                <User setOpen={setOpen} results={result} />
              </Grid>
            ))}
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
      <ViewPatient open={open} setOpen={setOpen} />
    </div>
  );
}
