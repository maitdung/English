import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import LessonArticle from "../components/LessonArticle";
import LessonNavigator from "../components/LessonNavigator";
import { getLessonById } from "../data/lessonCatalog";
import useLearningProgress from "../hooks/useLearningProgress";

function LessonPlayerPage() {
  const { lessonId = "" } = useParams();
  const navigate = useNavigate();
  const lesson = getLessonById(lessonId);
  const { progress, completeLesson } = useLearningProgress();

  const [activeSectionId, setActiveSectionId] = useState(
    lesson?.sections[0]?.id ?? "",
  );

  const [completedSectionIds, setCompletedSectionIds] = useState<
    string[]
  >([]);

  const activeSectionIndex = useMemo(() => {
    if (!lesson) {
      return -1;
    }

    return lesson.sections.findIndex(
      (section) => section.id === activeSectionId,
    );
  }, [activeSectionId, lesson]);

  if (!lesson) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center">
          <div className="text-6xl">📭</div>

          <h1 className="mt-6 text-3xl font-black">
            Không tìm thấy bài học
          </h1>

          <Link
            to="/dashboard/learning"
            className="mt-7 inline-flex rounded-2xl bg-cyan-400 px-6 py-3.5 font-black text-slate-950"
          >
            Quay lại lộ trình
          </Link>
        </div>
      </div>
    );
  }

  const activeSection =
    lesson.sections[activeSectionIndex] ?? lesson.sections[0];

  const isLastSection =
    activeSectionIndex === lesson.sections.length - 1;

  const isLessonCompleted =
    progress.completedLessonIds.includes(lesson.id);

  const handleCompleteSection = () => {
    setCompletedSectionIds((currentIds) => {
      if (currentIds.includes(activeSection.id)) {
        return currentIds;
      }

      return [...currentIds, activeSection.id];
    });

    if (isLastSection) {
      completeLesson(lesson.id);
      navigate("/dashboard/quiz");
      return;
    }

    const nextSection = lesson.sections[activeSectionIndex + 1];

    if (nextSection) {
      setActiveSectionId(nextSection.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const progressPercent = Math.round(
    (completedSectionIds.length / lesson.sections.length) * 100,
  );

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <Link
        to="/dashboard/learning"
        className="text-sm font-bold text-slate-400 transition hover:text-cyan-300"
      >
        ← Quay lại lộ trình
      </Link>

      <section className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-violet-500/10 p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-black text-cyan-300">
                {lesson.category}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300">
                {lesson.level}
              </span>

              {isLessonCompleted && (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">
                  Đã hoàn thành
                </span>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-black sm:text-4xl">
              {lesson.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              {lesson.description}
            </p>
          </div>

          <div className="shrink-0 xl:w-72">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">
                Tiến độ bài học
              </span>

              <span className="font-black text-cyan-300">
                {progressPercent}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              ⏱️ Khoảng {lesson.duration} phút
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[300px_1fr]">
        <LessonNavigator
          sections={lesson.sections}
          activeSectionId={activeSection.id}
          completedSectionIds={completedSectionIds}
          onSelectSection={setActiveSectionId}
        />

        <LessonArticle
          section={activeSection}
          isLastSection={isLastSection}
          onComplete={handleCompleteSection}
        />
      </section>
    </div>
  );
}

export default LessonPlayerPage;