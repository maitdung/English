import type { LessonSection } from "../types/learning";

type LessonNavigatorProps = {
  sections: LessonSection[];
  activeSectionId: string;
  completedSectionIds: string[];
  onSelectSection: (sectionId: string) => void;
};

function LessonNavigator({
  sections,
  activeSectionId,
  completedSectionIds,
  onSelectSection,
}: LessonNavigatorProps) {
  return (
    <aside className="h-fit rounded-3xl border border-white/10 bg-slate-900/60 p-5 xl:sticky xl:top-24">
      <h2 className="text-lg font-black">Nội dung bài học</h2>

      <p className="mt-2 text-sm text-slate-500">
        {completedSectionIds.length}/{sections.length} phần hoàn thành
      </p>

      <div className="mt-5 space-y-2">
        {sections.map((section, index) => {
          const isActive = activeSectionId === section.id;
          const isCompleted = completedSectionIds.includes(section.id);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelectSection(section.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                isActive
                  ? "border-cyan-400/40 bg-cyan-400/[0.08]"
                  : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                  isCompleted
                    ? "bg-emerald-400/10 text-emerald-300"
                    : isActive
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-white/5 text-slate-500"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </span>

              <span
                className={`text-sm font-bold ${
                  isActive ? "text-white" : "text-slate-400"
                }`}
              >
                {section.title}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default LessonNavigator;