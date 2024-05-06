"use client";

import { PaginationPage } from "@/components/common/pagination";
import { User } from "@/components/dashboard/user-card";
import { LabReportUpload } from "@/components/dashboard/view";
import {
  Button,
  CircularProgress,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { useSession } from "next-auth/react";
import FormDialog from "@/components/dashboard/search";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data: session } = useSession();

  const [postsPerPage, setPostsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const userType = searchParams.type as string;

  const query = queryString.stringify(searchParams);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
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

  const handlePatientClick = () => {
    setOpen(true);
  };

  return (
    <div>
      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
          <Grid container spacing={2} direction="row">
            {isLoading && (
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <CircularProgress />
              </Grid>
            )}
            <Grid item xs={12} sm={12} md={12} textAlign={"center"}>
              <Button variant="contained" onClick={handlePatientClick}>
                Search Patient
              </Button>
            </Grid>
            <FormDialog open={open} setOpen={setOpen} type={userType} />
            {currentPosts.map((result, index) => (
              <Grid key={index} item xs={12}>
                <User results={result} role={userType} />
              </Grid>
            ))}
            {!isLoading && searchResults.length === 0 && (
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Typography variant="h6">No results found</Typography>
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
