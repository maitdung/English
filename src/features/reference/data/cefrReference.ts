export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type GrammarCefrLevel = Extract<CefrLevel, "A1" | "A2" | "B1" | "B2">;

export type VocabularyReference = {
  id: string;
  headword: string;
  partOfSpeech: string;
  level: CefrLevel;
  source: "CEFR-J 1.5" | "Octanove C1/C2";
  notes: string;
};

export type GrammarReference = {
  id: string;
  code: string;
  item: string;
  sentenceType: string;
  level: GrammarCefrLevel | null;
  profileLevel: string;
  coreInventory: string;
  englishGrammarProfile: string;
  globalScaleOfEnglish: string;
  notes: string;
};

export type CefrReferenceData = {
  vocabulary: VocabularyReference[];
  grammar: GrammarReference[];
  vocabularyByLevel: Record<CefrLevel, number>;
  grammarByLevel: Record<GrammarCefrLevel, number>;
  grammarUnlabeledCount: number;
};

const CEFR_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const GRAMMAR_CEFR_LEVELS: GrammarCefrLevel[] = ["A1", "A2", "B1", "B2"];

const EMPTY_LEVEL_COUNTS: Record<CefrLevel, number> = {
  A1: 0,
  A2: 0,
  B1: 0,
  B2: 0,
  C1: 0,
  C2: 0,
};

const EMPTY_GRAMMAR_LEVEL_COUNTS: Record<GrammarCefrLevel, number> = {
  A1: 0,
  A2: 0,
  B1: 0,
  B2: 0,
};

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (inQuotes) {
      if (character === '"' && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      inQuotes = true;
    } else if (character === ",") {
      row.push(field.trim());
      field = "";
    } else if (character === "\n") {
      row.push(field.trim());
      field = "";
      if (row.some(Boolean)) {
        rows.push(row);
      }
      row = [];
    } else if (character !== "\r") {
      field += character;
    }
  }

  if (field || row.length > 0) {
    row.push(field.trim());
    if (row.some(Boolean)) {
      rows.push(row);
    }
  }

  return rows;
}

function normalizeLevel(value: string): CefrLevel | null {
  const match = value.toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match && CEFR_LEVELS.includes(match[1] as CefrLevel)
    ? (match[1] as CefrLevel)
    : null;
}

function normalizeGrammarLevel(value: string): GrammarCefrLevel | null {
  const level = normalizeLevel(value);

  return level && GRAMMAR_CEFR_LEVELS.includes(level as GrammarCefrLevel)
    ? (level as GrammarCefrLevel)
    : null;
}

function rowsToRecords(rows: string[][]): Array<Record<string, string>> {
  const [headers = [], ...dataRows] = rows;

  return dataRows.map((values) =>
    headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = values[index] ?? "";
      return record;
    }, {}),
  );
}

function parseVocabulary(
  csv: string,
  source: VocabularyReference["source"],
): VocabularyReference[] {
  return rowsToRecords(parseCsv(csv)).flatMap((record, index) => {
    const headword = record.headword?.trim();
    const level = normalizeLevel(record.CEFR ?? "");

    if (!headword || !level) {
      return [];
    }

    return [
      {
        id: `${source === "CEFR-J 1.5" ? "cefrj" : "octanove"}-${index}-${headword}`,
        headword,
        partOfSpeech: record.pos || "other",
        level,
        source,
        notes: record.notes || "",
      },
    ];
  });
}

function parseGrammar(csv: string): GrammarReference[] {
  return rowsToRecords(parseCsv(csv)).flatMap((record, index) => {
    const item = record["Grammatical Item"]?.trim();
    if (!item) {
      return [];
    }

    const profileLevel = record["CEFR-J Level"] || "";

    return [
      {
        id: `grammar-${record.ID || index}`,
        code: record["Shorthand Code"] || "",
        item,
        sentenceType: record["Sentence Type"] || "",
        level: normalizeGrammarLevel(profileLevel),
        profileLevel,
        coreInventory: record["Core Inventory"] || "",
        englishGrammarProfile: record.EGP || "",
        globalScaleOfEnglish: record.GSELO || "",
        notes: record.Notes || "",
      },
    ];
  });
}

function countLevels<T>(
  entries: T[],
  getLevel: (entry: T) => CefrLevel | null,
): Record<CefrLevel, number> {
  const counts = { ...EMPTY_LEVEL_COUNTS };

  for (const entry of entries) {
    const level = getLevel(entry);
    if (level) {
      counts[level] += 1;
    }
  }

  return counts;
}

function countGrammarLevels(
  entries: GrammarReference[],
): Record<GrammarCefrLevel, number> {
  const counts = { ...EMPTY_GRAMMAR_LEVEL_COUNTS };

  for (const entry of entries) {
    if (entry.level) {
      counts[entry.level] += 1;
    }
  }

  return counts;
}

async function fetchText(path: string): Promise<string> {
  const response = await fetch(path, {
    headers: { Accept: "text/csv" },
  });

  if (!response.ok) {
    throw new Error(`Không tải được dữ liệu tham chiếu (${response.status}).`);
  }

  return response.text();
}

let referenceDataPromise: Promise<CefrReferenceData> | null = null;

export function loadCefrReferenceData(): Promise<CefrReferenceData> {
  if (!referenceDataPromise) {
    referenceDataPromise = Promise.all([
      fetchText("/data/cefrj/cefrj-vocabulary-profile-1.5.csv"),
      fetchText("/data/cefrj/octanove-vocabulary-profile-c1c2-1.0.csv"),
      fetchText("/data/cefrj/cefrj-grammar-profile-20180315.csv"),
    ])
      .then(([cefrVocabularyCsv, advancedVocabularyCsv, grammarCsv]) => {
        const vocabulary = [
          ...parseVocabulary(cefrVocabularyCsv, "CEFR-J 1.5"),
          ...parseVocabulary(advancedVocabularyCsv, "Octanove C1/C2"),
        ];
        const grammar = parseGrammar(grammarCsv);

        return {
          vocabulary,
          grammar,
          vocabularyByLevel: countLevels(vocabulary, (entry) => entry.level),
          grammarByLevel: countGrammarLevels(grammar),
          grammarUnlabeledCount: grammar.filter((entry) => !entry.level).length,
        };
      })
      .catch((error) => {
        referenceDataPromise = null;
        throw error;
      });
  }

  return referenceDataPromise;
}

export const cefrLevels = CEFR_LEVELS;
export const grammarCefrLevels = GRAMMAR_CEFR_LEVELS;
