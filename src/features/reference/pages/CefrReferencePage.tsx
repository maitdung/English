import { useDeferredValue, useEffect, useMemo, useState } from "react";

import {
  cefrLevels,
  grammarCefrLevels,
  loadCefrReferenceData,
  type CefrLevel,
  type CefrReferenceData,
  type GrammarCefrLevel,
} from "../data/cefrReference";

type ReferenceTab = "vocabulary" | "grammar";
type LevelFilter = "ALL" | "UNLABELED" | CefrLevel;

const levelStyles: Record<CefrLevel, string> = {
  A1: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  A2: "border-sky-300/25 bg-sky-300/10 text-sky-200",
  B1: "border-blue-300/25 bg-blue-300/10 text-blue-200",
  B2: "border-violet-300/25 bg-violet-300/10 text-violet-200",
  C1: "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-200",
  C2: "border-amber-300/25 bg-amber-300/10 text-amber-200",
};

const unlabeledStyle = "border-slate-300/15 bg-slate-300/5 text-slate-300";

function CefrReferencePage() {
  const [data, setData] = useState<CefrReferenceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<ReferenceTab>("vocabulary");
  const [level, setLevel] = useState<LevelFilter>("ALL");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  const searchIsPending = deferredQuery !== query;

  useEffect(() => {
    let active = true;

    void loadCefrReferenceData()
      .then((referenceData) => {
        if (active) {
          setData(referenceData);
          setError(null);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không tải được dữ liệu tham chiếu.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [level, query, tab]);

  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase();

  const filteredVocabulary = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.vocabulary.filter((entry) => {
      const matchesLevel =
        level === "ALL" || (level !== "UNLABELED" && entry.level === level);
      const matchesQuery =
        !normalizedQuery ||
        `${entry.headword} ${entry.partOfSpeech} ${entry.notes}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      return matchesLevel && matchesQuery;
    });
  }, [data, level, normalizedQuery]);

  const filteredGrammar = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.grammar.filter((entry) => {
      const matchesLevel =
        level === "ALL" ||
        (level === "UNLABELED" ? !entry.level : entry.level === level);
      const matchesQuery =
        !normalizedQuery ||
        `${entry.item} ${entry.code} ${entry.sentenceType} ${entry.profileLevel} ${entry.coreInventory} ${entry.englishGrammarProfile} ${entry.globalScaleOfEnglish} ${entry.notes}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      return matchesLevel && matchesQuery;
    });
  }, [data, level, normalizedQuery]);

  const activeEntries =
    tab === "vocabulary" ? filteredVocabulary : filteredGrammar;
  const pageSize = 24;
  const totalPages = Math.max(1, Math.ceil(activeEntries.length / pageSize));
  const visibleEntries = activeEntries.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const activeCefrLevels =
    tab === "vocabulary" ? cefrLevels : grammarCefrLevels;
  const labeledGrammarCount = data
    ? data.grammar.length - data.grammarUnlabeledCount
    : 0;

  function changeTab(nextTab: ReferenceTab) {
    setTab(nextTab);
    setLevel("ALL");
  }

  function getLevelCount(cefrLevel: CefrLevel): number {
    if (!data) {
      return 0;
    }

    return tab === "vocabulary"
      ? data.vocabularyByLevel[cefrLevel]
      : data.grammarByLevel[cefrLevel as GrammarCefrLevel];
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-7 lg:px-10 lg:py-12">
      <section className="reveal-up overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/65 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
              CEFR Knowledge Atlas
            </span>
            <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Từ vựng A1–C2, hồ sơ ngữ pháp A1–B2
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Kho từ vựng phủ nhãn A1–C2 từ CEFR-J và Octanove. Hồ sơ ngữ pháp
              có 500 mục, nhưng nguồn chỉ gắn nhãn A1–B2 cho 170 mục; 330 mục
              còn lại chưa có nhãn CEFR-J. Đây là dữ liệu tham chiếu, không phải
              một giáo trình ngữ pháp C1/C2 hoàn chỉnh hay bài kiểm tra năng
              lực.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
              <p className="text-2xl font-black text-cyan-300">
                {data ? data.vocabulary.length.toLocaleString("vi-VN") : "…"}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                mục từ vựng A1–C2
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
              <p className="text-2xl font-black text-violet-300">
                {data ? data.grammar.length.toLocaleString("vi-VN") : "…"}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                mẫu ngữ pháp
              </p>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                {data
                  ? `${labeledGrammarCount} có nhãn A1–B2 · ${data.grammarUnlabeledCount} chưa gắn nhãn`
                  : "Nhãn cấp độ được giữ nguyên từ nguồn"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 rounded-[1.75rem] border border-white/10 bg-slate-900/55 p-5 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div
            role="tablist"
            aria-label="Loại dữ liệu CEFR"
            className="flex rounded-2xl border border-white/10 bg-slate-950/70 p-1"
          >
            {(
              [
                ["vocabulary", "Từ vựng"],
                ["grammar", "Ngữ pháp"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                id={`reference-tab-${value}`}
                aria-selected={tab === value}
                aria-controls="cefr-reference-results"
                onClick={() => changeTab(value)}
                className={`flex-1 rounded-xl px-5 py-3 text-sm font-black transition sm:flex-none ${
                  tab === value
                    ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 shadow-lg shadow-cyan-950/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="relative block min-w-0 flex-1 xl:max-w-md">
            <span className="sr-only">Tìm trong kho kiến thức</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              ⌕
            </span>
            <input
              type="search"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                tab === "vocabulary"
                  ? "Tìm headword hoặc từ loại…"
                  : "Tìm cấu trúc hoặc mã ngữ pháp…"
              }
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
            />
          </label>
        </div>

        <div
          role="note"
          className="mt-5 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-xs leading-6 text-slate-400"
        >
          {tab === "vocabulary" ? (
            <>
              <strong className="text-slate-200">Phạm vi từ vựng:</strong>{" "}
              CEFR-J A1–B2 kết hợp phần mở rộng Octanove C1/C2.
            </>
          ) : (
            <>
              <strong className="text-slate-200">Phạm vi ngữ pháp:</strong> chỉ
              lọc cấp độ A1–B2 theo nhãn có sẵn trong nguồn. “Chưa gắn nhãn”
              không đồng nghĩa với C1 hoặc C2.
            </>
          )}
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            aria-pressed={level === "ALL"}
            onClick={() => setLevel("ALL")}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
              level === "ALL"
                ? "border-white/30 bg-white text-slate-950"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Tất cả
          </button>
          {activeCefrLevels.map((cefrLevel) => (
            <button
              key={cefrLevel}
              type="button"
              aria-pressed={level === cefrLevel}
              onClick={() => setLevel(cefrLevel)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
                level === cefrLevel
                  ? levelStyles[cefrLevel]
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {cefrLevel}
              {data ? ` · ${getLevelCount(cefrLevel)}` : ""}
            </button>
          ))}
          {tab === "grammar" && (
            <button
              type="button"
              aria-pressed={level === "UNLABELED"}
              onClick={() => setLevel("UNLABELED")}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
                level === "UNLABELED"
                  ? unlabeledStyle
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Chưa gắn nhãn
              {data ? ` · ${data.grammarUnlabeledCount}` : ""}
            </button>
          )}
        </div>
      </section>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm font-bold text-slate-400">
          {data
            ? `${activeEntries.length.toLocaleString("vi-VN")} kết quả${searchIsPending ? " · đang lọc…" : ""}`
            : "Đang đọc kho kiến thức…"}
        </p>
        <p className="hidden text-xs text-slate-500 sm:block">
          Nguồn: CEFR-J 1.5 · Octanove C1/C2
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-5 text-sm text-rose-100">
          {error} Hãy tải lại trang để thử lại.
        </div>
      )}

      {!data && !error && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-3xl border border-white/5 bg-white/[0.04]"
            />
          ))}
        </div>
      )}

      {data && (
        <div
          id="cefr-reference-results"
          role="tabpanel"
          aria-labelledby={`reference-tab-${tab}`}
          aria-busy={searchIsPending}
          className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {tab === "vocabulary"
            ? filteredVocabulary
                .slice((page - 1) * pageSize, page * pageSize)
                .map((entry) => (
                  <article
                    key={entry.id}
                    className="premium-surface rounded-3xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="break-words text-xl font-black text-white">
                          {entry.headword}
                        </h2>
                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                          {entry.partOfSpeech}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${levelStyles[entry.level]}`}
                      >
                        {entry.level}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-500">
                      <span>{entry.source}</span>
                      <span>CEFR reference</span>
                    </div>
                    {entry.notes && (
                      <details className="mt-4 rounded-2xl border border-white/5 bg-slate-950/45 px-4 py-3 text-xs text-slate-400">
                        <summary className="cursor-pointer font-bold text-slate-300 outline-none marker:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/50">
                          Ghi chú từ nguồn
                        </summary>
                        <p className="mt-3 break-words leading-6">
                          {entry.notes}
                        </p>
                      </details>
                    )}
                  </article>
                ))
            : filteredGrammar
                .slice((page - 1) * pageSize, page * pageSize)
                .map((entry) => (
                  <article
                    key={entry.id}
                    className="premium-surface rounded-3xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <code className="break-all text-xs font-bold text-cyan-300">
                        {entry.code || "Không có mã"}
                      </code>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${
                          entry.level
                            ? levelStyles[entry.level]
                            : unlabeledStyle
                        }`}
                      >
                        {entry.level
                          ? entry.profileLevel || entry.level
                          : "Chưa gắn nhãn"}
                      </span>
                    </div>
                    <h2 className="mt-4 text-base font-black leading-6 text-white">
                      {entry.item}
                    </h2>
                    {entry.sentenceType && (
                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                        {entry.sentenceType}
                      </p>
                    )}
                    {(entry.coreInventory ||
                      entry.englishGrammarProfile ||
                      entry.globalScaleOfEnglish) && (
                      <dl className="mt-5 grid gap-2 border-t border-white/5 pt-4 text-xs text-slate-400">
                        {entry.coreInventory && (
                          <div className="grid grid-cols-[7.5rem_1fr] gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                            <dt className="font-bold text-slate-500">
                              Core Inventory
                            </dt>
                            <dd className="break-words text-slate-300">
                              {entry.coreInventory}
                            </dd>
                          </div>
                        )}
                        {entry.englishGrammarProfile && (
                          <div className="grid grid-cols-[7.5rem_1fr] gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                            <dt className="font-bold text-slate-500">EGP</dt>
                            <dd className="break-words text-slate-300">
                              {entry.englishGrammarProfile}
                            </dd>
                          </div>
                        )}
                        {entry.globalScaleOfEnglish && (
                          <div className="grid grid-cols-[7.5rem_1fr] gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                            <dt className="font-bold text-slate-500">GSE</dt>
                            <dd className="break-words text-slate-300">
                              {entry.globalScaleOfEnglish}
                            </dd>
                          </div>
                        )}
                      </dl>
                    )}
                    {entry.notes && (
                      <details className="mt-4 rounded-2xl border border-white/5 bg-slate-950/45 px-4 py-3 text-xs text-slate-400">
                        <summary className="cursor-pointer font-bold text-slate-300 outline-none marker:text-violet-300 focus-visible:ring-2 focus-visible:ring-violet-300/50">
                          Ghi chú từ hồ sơ
                        </summary>
                        <p className="mt-3 whitespace-pre-wrap break-words leading-6">
                          {entry.notes}
                        </p>
                      </details>
                    )}
                  </article>
                ))}
        </div>
      )}

      {data && visibleEntries.length === 0 && (
        <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center text-sm text-slate-400">
          Không tìm thấy nội dung phù hợp. Thử từ khóa hoặc cấp độ khác nhé.
        </div>
      )}

      {data && totalPages > 1 && (
        <nav
          aria-label="Phân trang kho kiến thức"
          className="mt-8 flex items-center justify-center gap-3"
        >
          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage((currentPage) => Math.max(1, currentPage - 1))
            }
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Trước
          </button>
          <span className="text-sm font-bold text-slate-400">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() =>
              setPage((currentPage) => Math.min(totalPages, currentPage + 1))
            }
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Sau
          </button>
        </nav>
      )}

      <footer className="mt-10 rounded-2xl border border-white/5 bg-slate-950/40 p-5 text-xs leading-6 text-slate-500">
        <a
          href="https://github.com/openlanguageprofiles/olp-en-cefrj"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-slate-300 underline decoration-white/20 underline-offset-4 transition hover:text-cyan-200"
        >
          CEFR-J Vocabulary Profile 1.5 và Grammar Profile
        </a>{" "}
        thuộc Tono Laboratory, TUFS. Hồ sơ C1/C2 của Octanove được cung cấp theo{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-slate-300 underline decoration-white/20 underline-offset-4 transition hover:text-cyan-200"
        >
          CC BY-SA 4.0
        </a>
        . Dữ liệu được phân phối nguyên bản; nhãn cấp độ chỉ dùng để tham chiếu
        nội dung và có thể khác giữa các framework. Hồ sơ ngữ pháp hiện chỉ có
        nhãn A1–B2 cho 170/500 mục; 330 mục không có nhãn cấp độ trong file
        nguồn và không được suy diễn thành C1/C2.
      </footer>
    </div>
  );
}

export default CefrReferencePage;
