"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import type { Accept } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UploadedFilesCard } from "@/_components/uploaded-files-card";
import { uploadFileAPI } from "@/apiCallers/file";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@/components/UploadImage/file-uploader";
import { useUploadFile } from "@/hooks/use-upload-file";

import SpinnerIcon from "../SpinnerIcon";
import { useToast } from "../ui/use-toast";

const schema = z.object({
  images: z.any(),
});

type Schema = z.infer<typeof schema>;
type Props = {
  label: string;
  isRequired: boolean;
  field: any;
  accetp?: Accept;
  defaultValue?: File[] | string[];
};

const FileUploadModal = ({
  field,
  isRequired,
  label,
  accetp,
  defaultValue,
}: Props) => {
  const [loading, setLoading] = React.useState(false);
  const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] }
  );

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    values: { images: field.value ? field.value : defaultValue },
    mode: "onChange",
  });

  console.log;

  const { toast } = useToast();
  const { isPending: isUploadingFile, mutateAsync: triggerUploadfile } =
    useMutation({
      mutationFn: async (files: File[]) => {
        const formData = new FormData();

        for (const file of files) {
          formData.append("files", file, file.name);
        }
        return uploadFileAPI(formData);
      },
      onSuccess: (data) => {
        console.log(data, "data");
        if (!data.ok) {
          if (data.error) {
            //   const errs = data.error as { [key: string]: { message: string } };
            //   Object.entries(errs).forEach(([key, value]) => {
            //     setError(key as keyof PackageCourtSchemaType, {
            //       type: "manual",
            //       message: value.message,
            //     });
            //   });
            // }
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: data.message || data.statusText,
            });

            throw new Error(data.message || data.statusText);
          }
          return toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: data.message || data.statusText,
          });
        }
        if (data.message) {
          return toast({
            variant: "default",
            className: "bg-green-600 text-white",
            title: "Message from system",
            description: data.message,
          });
        }

        return toast({
          variant: "default",
          title: "Submitted successfully",
          description: "You can do something else now",
        });
      },
      onError: (error) => {
        console.error("Error while posting branch", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Error while posting branch",
        });
      },
    });

  const uploadFileChange = async (data: string | File[]) => {
    console.log(data, "odo");

    if (Array.isArray(data)) {
      await Promise.all(
        data.map(async (file) => {
          if (typeof file === "string") return file;
          if (file instanceof File) {
            return triggerUploadfile([file]);
          }
          return file;
        })
      ).then((res) => {
        const imagesData = res.map((image) => {
          if (typeof image === "string") return image;
          if (image?.data) return image.data[0];
          return undefined;
        });
        field.onChange(imagesData.filter((data) => data !== undefined));
      });

      return;
    }
    field.onChange([]);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="my-1">Upload</Button>
      </DialogTrigger>
      <DialogContent className="w-[600px] ">
        <Form {...form}>
          <form className="flex w-full flex-col gap-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field: fieldForm }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>
                      {label}{" "}
                      {isRequired && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="relative size-full ">
                        {isUploadingFile && (
                          <div className="absolute inset-0 z-10 flex size-full items-center justify-center">
                            <SpinnerIcon />
                          </div>
                        )}
                        <FileUploader
                          accept={accetp}
                          value={fieldForm.value}
                          onValueChange={uploadFileChange}
                          maxFiles={10}
                          maxSize={4 * 1024 * 1024}
                          progresses={progresses}
                          // pass the onUpload function here for direct upload
                          // onUpload={uploadFiles}
                          disabled={isUploadingFile}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  {uploadedFiles.length > 0 ? (
                    <UploadedFilesCard uploadedFiles={uploadedFiles} />
                  ) : null}
                </div>
              )}
            />
            {/* <Button className="w-fit" disabled={loading}>
          Save
        </Button> */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
