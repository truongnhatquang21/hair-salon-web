"use server";

import { fetcher } from "..";

export const uploadFileAPI = async (files: FormData) => {
  console.log(files, "files");
  console.log("kut");
  return fetcher("file/upload", {
    method: "POST",
    body: files,
    headers: {
      contentType: "multipart/form-data",
    },
  });
};

export const uploadImagesAPI = async (files: FormData) => {
  return fetcher("file/upload-images", {
    method: "POST",
    body: files,
    headers: {
      contentType: "multipart/form-data",
    },
  });
};
