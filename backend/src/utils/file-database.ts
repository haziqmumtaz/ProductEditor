import fs from "fs";
import path from "path";

const DB_PATH = path.join(__dirname, "../../data");

export function readDataFromFile(fileName: string): any {
  const data = fs.readFileSync(path.join(DB_PATH, fileName), "utf8");
  const parsed = JSON.parse(data);
  return parsed.products || [];
}

export async function writeDataToFile(fileName: string, db: any) {
  const dataToWrite = { products: db };
  await fs.writeFileSync(
    path.join(DB_PATH, fileName),
    JSON.stringify(dataToWrite, null, 2),
    "utf8"
  );
}
