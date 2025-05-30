// features/corporate/store/corporate-slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { isStudent, type StudentUser } from "@/types/user.types"; // Use StudentUser type
import { get, post, put, del } from "@/lib/api-client"; // Import CRUD methods

// --- State Definition ---
interface CorporateState {
	managedStudents: StudentUser[]; // List of students managed by the current manager
	currentManagedStudent: StudentUser | null; // For viewing/editing a specific student
	status: "idle" | "loading" | "succeeded" | "failed"; // Status for fetching lists
	operationStatus: "idle" | "loading" | "succeeded" | "failed"; // Status for CUD operations on students
	error: string | null; // General fetch/operation error
	pagination: {
		// Optional pagination for student list
		currentPage: number;
		totalPages: number;
		totalStudents: number;
		limit: number;
	} | null;
}

// --- Initial State ---
const initialState: CorporateState = {
	managedStudents: [],
	currentManagedStudent: null,
	status: "idle",
	operationStatus: "idle",
	error: null,
	pagination: null,
};

// --- Payload Types ---
interface FetchManagedStudentsParams {
	corporateId: string;
	page?: number;
	limit?: number;
	search?: string; // Optional search filter
}
interface FetchManagedStudentsResult {
	students: StudentUser[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
// Type for creating (Manager provides Name/Email, Backend adds corporateId etc.)
export type CreateManagedStudentPayload = {
	name: string;
	email: string /* initial password optional */;
};
// Type for updating (Manager can likely only update Name, Status?)
export type UpdateManagedStudentPayload = {
	id: string;
	name?: string;
	isActive?: boolean /* other allowed fields */;
};

// --- Thunks ---

export const fetchManagedStudents = createAsyncThunk<
	FetchManagedStudentsResult,
	FetchManagedStudentsParams,
	{ rejectValue: string }
>("corporate/fetchManagedStudents", async (params, { rejectWithValue }) => {
	try {
		const { corporateId, page = 1, limit = 10, search = "" } = params;

		// Construct query parameters
		const queryParams = new URLSearchParams();
		if (page) queryParams.append("page", page.toString());
		if (limit) queryParams.append("limit", limit.toString());
		if (search) queryParams.append("search", search);

		// API Call using the API client
		const result = await get<FetchManagedStudentsResult>(
			`/corporate/${corporateId}/students?${queryParams.toString()}`
		);
		return result;
	} catch (error: any) {
		return rejectWithValue(error.message || "Failed to fetch managed students");
	}
});

// Thunk for *Manager* creating a student. Assumes backend handles corporateId linking & slot check.
// Uses the standard '/users' or a specific '/corporate/students' endpoint. Let's use '/users' for now.
export const createManagedStudent = createAsyncThunk<
	StudentUser, // Returns the newly created student user object
	CreateManagedStudentPayload & { corporateId: string }, // Manager provides name/email, thunk adds corporateId
	{ rejectValue: string }
>("corporate/createManagedStudent", async (payload, { rejectWithValue }) => {
	try {
		console.log("Dispatching createManagedStudent:", payload);
		// The backend's POST /users needs to handle the corporate context
		// It receives name, email, (maybe password), and the *manager's* corporateId
		// It should check slots for that corporateId before creating.
		const response = await post<StudentUser>("/users", payload); // Backend assigns role, corpId, etc.
		return response;
	} catch (error: any) {
		return rejectWithValue(error.message || "Failed to create student");
	}
});

// Thunk for *Manager* updating a student they manage.
// Uses the standard '/users/:id' endpoint, but backend must verify manager's permission.
export const updateManagedStudent = createAsyncThunk<
	StudentUser,
	UpdateManagedStudentPayload,
	{ rejectValue: string }
>(
	"corporate/updateManagedStudent",
	async ({ id, ...updateData }, { rejectWithValue }) => {
		try {
			console.log(`Dispatching updateManagedStudent for ${id}:`, updateData);
			// Backend PUT /users/:id needs to verify the requesting user (manager) has rights over student 'id'
			const response = await put<StudentUser>(`/users/${id}`, updateData); // Send only allowed fields
			return response;
		} catch (error: any) {
			return rejectWithValue(error.message || "Failed to update student");
		}
	}
);

// Thunk for *Manager* deleting/removing a student they manage.
// Uses standard '/users/:id', backend must verify permission & handle slot freeing.
export const deleteManagedStudent = createAsyncThunk<
	string, // Return deleted student ID
	{ studentId: string; corporateId: string }, // Need studentId to delete, corporateId for context/logging?
	{ rejectValue: string }
>(
	"corporate/deleteManagedStudent",
	async ({ studentId, corporateId }, { rejectWithValue }) => {
		try {
			console.log(`Dispatching deleteManagedStudent for ${studentId}`);

			// For corporate context, we can use a more specific endpoint
			// This could be either:
			// 1. DELETE /users/{studentId} (standard user deletion)
			// 2. DELETE /corporate/students/{studentId} (corporate-specific endpoint)
			// 3. DELETE /corporate/{corporateId}/students/{studentId} (fully qualified path)

			// Option 1: Standard user deletion
			// await del(`/users/${studentId}`);

			// Option 2: Corporate-specific endpoint (uncomment if your API uses this)
			await del(`/corporate/students/${studentId}`);

			// Option 3: Fully qualified path (uncomment if your API uses this)
			// await del(`/corporate/${corporateId}/students/${studentId}`);

			return studentId;
		} catch (error: any) {
			return rejectWithValue(error.message || "Failed to remove student");
		}
	}
);

// NEW THUNK: Find student in existing auth.users list and set as current
export const findAndSetCurrentManagedStudent = createAsyncThunk<
	StudentUser | null, // Returns the found StudentUser or null
	string, // Takes the studentId to find
	{ state: RootState; rejectValue: string } // Access full state, define rejection payload
>(
	"corporate/findAndSetCurrentManagedStudent",
	async (studentId, { getState, rejectWithValue }) => {
		console.log(`THUNK: Attempting to find student ${studentId} in auth.users`);
		const state = getState();
		const allUsers = state.auth.users; // Access the users list from the auth slice
		const manager = state.auth.user as StudentUser; // Get the logged-in manager for permission check

		if (!manager || !manager.isCorporateManager) {
			// Should ideally not happen if page guards work, but good to check
			return rejectWithValue("Action requires a corporate manager.");
		}

		if (!allUsers || allUsers.length === 0) {
			console.warn("THUNK: auth.users list is empty. Cannot find student.");
			// This indicates the user list wasn't loaded before this action was dispatched.
			// Returning null might be acceptable, or rejecting. Let's reject for clarity.
			return rejectWithValue("User list not available.");
		}

		const foundUser = allUsers.find((user) => user.id === studentId);

		if (!foundUser) {
			console.log(`THUNK: Student ${studentId} not found in auth.users.`);
			return null; // Or rejectWithValue("Student not found in the list.");
		}

		// --- Permission & Type Check ---
		// 1. Is the found user actually a student?
		if (!isStudent(foundUser)) {
			console.warn(
				`THUNK: User ${studentId} found, but is not a student (role: ${foundUser.role}).`
			);
			return rejectWithValue("User found is not a student.");
		}

		// 2. Does the found student belong to the current manager?
		if (foundUser.corporateId !== manager.corporateId) {
			console.warn(
				`THUNK: Manager ${manager.id} (Corp ${manager.corporateId}) does not manage student ${foundUser.id} (Corp ${foundUser.corporateId}).`
			);
			return rejectWithValue("Access denied: You do not manage this student.");
		}

		// If all checks pass, return the found student
		console.log(`THUNK: Student ${studentId} found and validated:`, foundUser);
		return foundUser; // Return the specific StudentUser object
	}
);

// Optional: Add a thunk to fetch a single managed student by ID
export const fetchManagedStudentById = createAsyncThunk<
	StudentUser,
	{ studentId: string; corporateId: string },
	{ rejectValue: string }
>(
	"corporate/fetchManagedStudentById",
	async ({ studentId, corporateId }, { rejectWithValue }) => {
		try {
			// API Call to get a specific student
			const student = await get<StudentUser>(
				`/corporate/${corporateId}/students/${studentId}`
			);
			return student;
		} catch (error: any) {
			return rejectWithValue(
				error.message || "Failed to fetch student details"
			);
		}
	}
);

// --- Slice Definition ---
const corporateSlice = createSlice({
	name: "corporate",
	initialState,
	reducers: {
		clearCorporateError: (state) => {
			state.error = null;
		},
		resetOperationStatus: (state) => {
			state.operationStatus = "idle";
			state.error = null;
		},
		clearCurrentManagedStudent: (state) => {
			state.currentManagedStudent = null;
		},
	},
	extraReducers: (builder) => {
		// Fetch Managed Students
		builder
			.addCase(fetchManagedStudents.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(fetchManagedStudents.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.managedStudents = action.payload.students;
				state.pagination = {
					currentPage: action.payload.page,
					limit: action.payload.limit,
					totalStudents: action.payload.total,
					totalPages: action.payload.totalPages,
				};
			})
			.addCase(fetchManagedStudents.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Failed loading students";
			});

		// Create Managed Student
		builder
			.addCase(createManagedStudent.pending, (state) => {
				state.operationStatus = "loading";
				state.error = null;
			})
			.addCase(createManagedStudent.fulfilled, (state, action) => {
				state.operationStatus = "succeeded";
				state.managedStudents.unshift(action.payload); // Add to list
				// Optionally update pagination total
				if (state.pagination) state.pagination.totalStudents++;
			})
			.addCase(createManagedStudent.rejected, (state, action) => {
				state.operationStatus = "failed";
				state.error = action.payload ?? "Failed to create student";
			});

		// Update Managed Student
		builder
			.addCase(updateManagedStudent.pending, (state) => {
				state.operationStatus = "loading";
				state.error = null;
			})
			.addCase(updateManagedStudent.fulfilled, (state, action) => {
				state.operationStatus = "succeeded";
				const index = state.managedStudents.findIndex(
					(s) => s.id === action.payload.id
				);
				if (index !== -1) state.managedStudents[index] = action.payload;
				if (state.currentManagedStudent?.id === action.payload.id)
					state.currentManagedStudent = action.payload;
			})
			.addCase(updateManagedStudent.rejected, (state, action) => {
				state.operationStatus = "failed";
				state.error = action.payload ?? "Failed to update student";
			});

		// Delete Managed Student
		builder
			.addCase(deleteManagedStudent.pending, (state) => {
				state.operationStatus = "loading";
				state.error = null;
			})
			.addCase(deleteManagedStudent.fulfilled, (state, action) => {
				state.operationStatus = "succeeded";
				state.managedStudents = state.managedStudents.filter(
					(s) => s.id !== action.payload
				);
				// Optionally update pagination total
				if (state.pagination) state.pagination.totalStudents--;
				if (state.currentManagedStudent?.id === action.payload)
					state.currentManagedStudent = null;
			})
			.addCase(deleteManagedStudent.rejected, (state, action) => {
				state.operationStatus = "failed";
				state.error = action.payload ?? "Failed to remove student";
			});

		// --- Add Reducers for findAndSetCurrentManagedStudent ---
		builder
			.addCase(findAndSetCurrentManagedStudent.pending, (state) => {
				state.status = "loading"; // Use the main status
				state.currentManagedStudent = null;
				state.error = null;
			})
			.addCase(findAndSetCurrentManagedStudent.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.currentManagedStudent = action.payload; // Payload is StudentUser | null
				state.error = null;
				if (!action.payload) {
					// Optional: Set a specific message if find returned null
					// state.error = "Student details could not be found in the loaded list.";
				}
			})
			.addCase(findAndSetCurrentManagedStudent.rejected, (state, action) => {
				state.status = "failed";
				state.currentManagedStudent = null;
				state.error =
					action.payload ?? "Failed to get student details from list.";
			});

		// Optional: Add cases for fetchManagedStudentById if implemented
		builder
			.addCase(fetchManagedStudentById.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(fetchManagedStudentById.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.currentManagedStudent = action.payload;
				// Also update in the list if present
				const index = state.managedStudents.findIndex(
					(s) => s.id === action.payload.id
				);
				if (index !== -1) state.managedStudents[index] = action.payload;
			})
			.addCase(fetchManagedStudentById.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Failed to fetch student details";
			});
	},
});

// --- Actions & Selectors ---
export const {
	clearCorporateError,
	resetOperationStatus,
	clearCurrentManagedStudent,
} = corporateSlice.actions;

export const selectManagedStudents = (state: RootState) =>
	state.corporate.managedStudents;
export const selectCurrentManagedStudent = (state: RootState) =>
	state.corporate.currentManagedStudent;
export const selectCorporateStatus = (state: RootState) =>
	state.corporate.status;
export const selectCorporateOperationStatus = (state: RootState) =>
	state.corporate.operationStatus;
export const selectCorporateError = (state: RootState) => state.corporate.error;
export const selectCorporatePagination = (state: RootState) =>
	state.corporate.pagination;

export default corporateSlice.reducer;
