import type {
  CourseDetail,
  CourseLevel,
  CourseListResponse,
  LessonDetail,
} from "../../features/courses/types/course";
import { apiRequest } from "./api-client";

export type GetCoursesParams = {
  search?: string;
  level?: CourseLevel;
  page?: number;
  limit?: number;
};

function createQueryString(params: GetCoursesParams): string {
  const searchParams = new URLSearchParams();

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.level) {
    searchParams.set("level", params.level);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export function getCoursesRequest(
  params: GetCoursesParams = {},
): Promise<CourseListResponse> {
  return apiRequest<CourseListResponse>(
    `/courses${createQueryString(params)}`,
    {
      method: "GET",
    },
  );
}

export function getCourseDetailRequest(
  courseSlug: string,
): Promise<CourseDetail> {
  return apiRequest<CourseDetail>(
    `/courses/${encodeURIComponent(courseSlug)}`,
    {
      method: "GET",
    },
  );
}

export function getLessonDetailRequest(
  courseSlug: string,
  lessonSlug: string,
): Promise<LessonDetail> {
  return apiRequest<LessonDetail>(
    `/courses/${encodeURIComponent(
      courseSlug,
    )}/lessons/${encodeURIComponent(lessonSlug)}`,
    {
      method: "GET",
    },
  );
}