export async function urlToFile(url: string, filename: string): Promise<File> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error("Error converting URL to file:", error);
    throw error;
  }
}

export async function urlsToFiles(urls: string[]): Promise<File[]> {
  const files: File[] = [];

  for (const url of urls) {
    try {
      const filename = url.substring(url.lastIndexOf("/") + 1);
      const file = await urlToFile(url, filename);
      files.push(file);
    } catch (error) {
      console.error(`Error converting URL to file: ${url}`, error);
    }
  }

  return files;
}
