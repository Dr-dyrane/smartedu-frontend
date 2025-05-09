// src/config/course-form-config.ts

import type {
	CourseFormValues,
	LessonFormValues,
    ModuleFormValues,
} from "@/lib/schemas/course.schema";

export const CATEGORIES = [
	"Web Development",
	"Mobile Development",
	"Data Science",
	"Machine Learning",
	"DevOps",
	"Cloud Computing",
	"Cybersecurity",
	"Blockchain",
	"Project Management",
	"Business",
	"Design",
	"Marketing",
];

export const LEVELS: CourseFormValues["level"][] = [
	"Beginner",
	"Intermediate",
	"Advanced",
	"All Levels",
];
export const LANGUAGES = [
	"English",
	"Spanish",
	"French",
	"German",
	"Chinese",
	"Japanese",
	"Arabic",
];
export const ACCESS_TYPES: CourseFormValues["accessType"][] = [
	"Lifetime",
	"Limited",
];
export const SUPPORT_TYPES: CourseFormValues["supportType"][] = [
	"Instructor",
	"Community",
	"Both",
	"None",
];
export const LESSON_TYPES: LessonFormValues["type"][] = [
	"video",
	"quiz",
	"assignment",
	"text",
	"download",
];

// Default empty values for lessons/modules when adding new ones
export const defaultLessonValues: Omit<LessonFormValues, "id"> = {
	title: "",
	type: "video",
	duration: "", // e.g., "00:10:00" or "10" for minutes
	description: "",
};

export const defaultModuleValues: Omit<ModuleFormValues, "id"> = {
	title: "Module 1",
	description: "",
	lessons: [{ ...defaultLessonValues, title: "Lesson 1" }], // Start with one lesson
};
