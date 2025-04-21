import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Uploader, UploaderButton, UploaderDropzone, UploaderOverlay } from "./uploader";

const meta: Meta<typeof Uploader> = {
  title: "UI/Uploader",
  component: Uploader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "File uploader component with drag and drop support."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Uploader>;

const mockUploadFile = async (file: File): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Uploaded file: ${file.name}`);
      resolve();
    }, 2000);
  });
};

export const Default: Story = {
  render: () => (
    <Uploader onUpload={mockUploadFile}>
      <div className="space-y-4 flex flex-col items-center">
        <UploaderDropzone className="w-full max-w-md" />
        <p className="text-center text-muted-foreground">or</p>
        <div className="flex justify-center">
          <UploaderButton type="button">Select Files</UploaderButton>
        </div>
      </div>
      <UploaderOverlay />
    </Uploader>
  ),
};

export const WithCustomDropzone: Story = {
  render: () => (
    <Uploader onUpload={mockUploadFile}>
      <div className="space-y-4 flex flex-col items-center">
        <UploaderDropzone 
          className="w-full max-w-md bg-muted/50" 
          activeText="Drop files to upload!"
          defaultText="Drag files here or click to browse"
        />
        <div className="flex justify-center">
          <UploaderButton type="button" variant="outline">Browse Files</UploaderButton>
        </div>
      </div>
      <UploaderOverlay activeText="Release to upload files!" />
    </Uploader>
  ),
};
