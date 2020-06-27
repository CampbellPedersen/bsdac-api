export interface FileUploadService {
  (key: string, contents: any): Promise<void>
}

export const inMemoryFileUploadService = (
  onUpload?: (key: string, contents: any) => void
): FileUploadService =>
  async (key: string, contents: any) => {
    if (onUpload) onUpload(key, contents);
  };
