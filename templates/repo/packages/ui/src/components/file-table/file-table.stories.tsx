import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { FileTable, type FileTableDataDocument } from "./file-table";
import { AlertProvider } from "../../providers/alert-provider";

type FileType = "pdf" | "data" | "image" | "text" | "all";

interface MockDocument {
  id: string;
  name: string;
  fileType: FileType;
  size: number;
  createdAt: string;
  updatedAt: Date;
  url: string;
  type?: string;
  status?: string | null;
  error?: string | null;
  ragieStatus?: string | null;
  ragieError?: string | null;
}

const meta: Meta<typeof FileTable> = {
  title: "UI/FileTable",
  component: FileTable,
  tags: ["autodocs"],
  decorators: [(Story) => (
    <AlertProvider>
      <Story />
    </AlertProvider>
  )],
};

export default meta;
type Story = StoryObj<typeof FileTable>;

const mockFiles: MockDocument[] = [
  {
    id: "1",
    name: "document1.pdf",
    fileType: "pdf",
    size: 1024 * 1024 * 2, // 2MB
    createdAt: new Date().toISOString(),
    updatedAt: new Date(),
    url: "#",
  },
  {
    id: "2",
    name: "spreadsheet.xlsx",
    fileType: "data",
    size: 1024 * 512, // 512KB
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000),
    url: "#",
  },
  {
    id: "3",
    name: "image.jpg",
    fileType: "image",
    size: 1024 * 1024 * 5, // 5MB
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000),
    url: "#",
  },
  {
    id: "4",
    name: "notes.txt",
    fileType: "text",
    size: 1024 * 10, // 10KB
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 259200000),
    url: "#",
  },
];

const mockFetcher = async ({ fileType, search }: { fileType?: string; search?: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  let filteredFiles = [...mockFiles];
  
  if (fileType) {
    filteredFiles = filteredFiles.filter(file => file.fileType === fileType as FileType);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredFiles = filteredFiles.filter(file => 
      file.name.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredFiles.map(file => ({
    id: file.id,
    name: file.name,
    type: file.type || file.fileType,
    size: file.size,
    updatedAt: file.updatedAt,
    status: file.status || "ready",
    error: file.error || null,
    ragieStatus: file.ragieStatus || null,
    ragieError: file.ragieError || null
  })) as FileTableDataDocument[];
};

export const Default: Story = {
  render: () => (
    <FileTable 
      fetcher={mockFetcher}
      mutateKey="files"
      onClick={(file) => console.log("Clicked file:", file)}
      onDelete={(ids) => console.log("Delete files:", ids)}
      onRefresh={(ids) => console.log("Refresh files:", ids)}
    />
  ),
};

export const NoActions: Story = {
  render: () => (
    <FileTable 
      fetcher={mockFetcher}
      mutateKey="files-no-actions"
    />
  ),
};

export const WithOnlyDeleteAction: Story = {
  render: () => (
    <FileTable 
      fetcher={mockFetcher}
      mutateKey="files-delete-only"
      onDelete={(ids) => console.log("Delete files:", ids)}
    />
  ),
};
