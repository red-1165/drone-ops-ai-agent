import fs from "fs";
import path from "path";
import Papa from "papaparse";

export function loadCSV(name: string) {
  const file = fs.readFileSync(
    path.join(process.cwd(), "data", name),
    "utf8"
  );

  return Papa.parse(file, { header: true }).data;
}
