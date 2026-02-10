// In-memory store (Global singleton in dev/prod for this specific runtime)

export type User = {
    id: string;
    email: string;
    password: string;
    role: 'student' | 'lecturer' | 'staff' | 'school-admin';
    profile: {
        firstName: string;
        lastName: string;
        phone?: string;
        avatarUrl?: string | null;
        matricNo?: string;
        program?: string;
        level?: string;
        semester?: string;
        department?: string; // For lecturers
    };
};

export type Course = {
    id: string;
    code: string;
    title: string;
    description: string;
    semester: string;
    lecturerId: string;
    studentCount: number;
};

export type Assignment = {
    id: string;
    courseId: string;
    lecturerId: string;
    title: string;
    type: 'assignment' | 'quiz';
    dueDate: string;
};

export type Result = {
    id: string;
    courseId: string;
    studentId: string;
    studentName: string; // denormalized for ease
    score: number;
    total: number;
    type: 'assignment' | 'quiz' | 'exam';
};

export type ForumPost = {
    id: string;
    courseId: string;
    authorId: string;
    authorName: string;
    title: string;
    content: string;
    date: string;
};

export type Submission = {
    id: string;
    type: 'assignment' | 'quiz';
    relatedId: string; // assignmentId
    studentId: string;
    studentName: string;
    content?: string; // For text submission or File URL
    grade?: number | null;
    status: 'submitted' | 'graded';
    submittedAt: string;
};

export type ForumComment = {
    id: string;
    postId: string;
    authorId: string;
    authorName: string;
    authorRole: 'student' | 'lecturer' | 'admin';
    content: string;
    createdAt: string;
};

export type Enrollment = {
    id: string;
    studentId: string;
    courseId: string;
    semester: string;
    enrolledAt: string;
};

// Staff Interfaces
export type StaffTask = {
    id: string;
    staffId: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
};

export type StaffReport = {
    id: string;
    staffId: string;
    type: 'incident' | 'maintenance' | 'operational';
    title: string;
    description: string;
    date: string;
    status: 'submitted' | 'reviewer' | 'resolved';
};

export type LeaveRequest = {
    id: string;
    staffId: string;
    type: 'sick' | 'casual' | 'vacation';
    startDate: string;
    endDate: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
};

export type InternalAnnouncement = {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
};

// Initial Mock Data
const INITIAL_USERS: User[] = [
    {
        id: 'student-1',
        email: 'student@test.com',
        password: 'password123',
        role: 'student',
        profile: {
            firstName: 'Yakubu',
            lastName: 'Joy',
            matricNo: 'CSC2024105',
            program: 'B.Sc Computer Science',
            level: '300',
            semester: 'Second',
            avatarUrl: null
        }
    },
    {
        id: 'lecturer-1',
        email: 'lecturer@test.com',
        password: 'password123',
        role: 'lecturer',
        profile: {
            firstName: 'Dr. Amina',
            lastName: 'Bello',
            department: 'Computer Science',
            phone: '08099999999'
        }
    },
    {
        id: 'admin-1',
        email: 'admin@test.com',
        password: 'password123',
        role: 'school-admin',
        profile: { firstName: 'Admin', lastName: 'User' }
    }
];

class MockDB {
    private users: User[] = [...INITIAL_USERS];
    private studentData: Record<string, any> = {};

    // Lecturer Data Stores
    private courses: Course[] = [
        { id: 'c1', code: 'COSC 301', title: 'Software Engineering I', description: 'Intro to SE', semester: 'Second', lecturerId: 'lecturer-1', studentCount: 45 },
        { id: 'c2', code: 'COSC 303', title: 'Database Management', description: 'SQL and NoSQL', semester: 'Second', lecturerId: 'lecturer-1', studentCount: 50 },
    ];
    private assignments: Assignment[] = [];
    private results: Result[] = [];
    private forumPosts: ForumPost[] = [];

    // Staff Data Stores
    private staffTasks: StaffTask[] = [
        { id: 't1', staffId: 'staff-1', title: 'Inspect Generator', description: 'Check fuel levels and oil.', status: 'pending', dueDate: '2026-02-05', priority: 'high' }
    ];
    private staffReports: StaffReport[] = [];
    private leaveRequests: LeaveRequest[] = [];
    private announcements: InternalAnnouncement[] = [
        { id: 'an1', title: 'Staff Meeting', content: 'General staff meeting on Friday at 9 AM.', date: '2026-02-01', author: 'HR' }
    ];

    private studentAnnouncements: any[] = [
        { id: 'sa1', title: 'Welcome to the New Semester', content: 'Classes begin on Monday. Check your timetable.', date: '2026-02-01', author: 'Dean of Students', courseId: null },
        { id: 'sa2', title: 'Course Registration Deadline', content: 'Deadline for course add/drop is next Friday.', date: '2026-02-05', author: 'Registrar', courseId: null }
    ];

    // ... existing methods ...

    // Staff Methods
    getStaffTasks(staffId: string) {
        return this.staffTasks.filter(t => t.staffId === staffId);
    }

    addStaffTask(task: StaffTask) {
        this.staffTasks.push(task);
        return task;
    }

    updateStaffTask(id: string, updates: Partial<StaffTask>) {
        const task = this.staffTasks.find(t => t.id === id);
        if (task) Object.assign(task, updates);
        return task;
    }

    getStaffReports(staffId: string) {
        return this.staffReports.filter(r => r.staffId === staffId);
    }

    addStaffReport(report: StaffReport) {
        this.staffReports.push(report);
        return report;
    }

    getLeaveRequests(staffId: string) {
        return this.leaveRequests.filter(l => l.staffId === staffId);
    }

    addLeaveRequest(request: LeaveRequest) {
        this.leaveRequests.push(request);
        return request;
    }

    getAnnouncements() {
        return this.announcements;
    }

    getStudentAnnouncements() {
        return this.studentAnnouncements;
    }

    addStudentAnnouncement(announcement: any) {
        this.studentAnnouncements.push(announcement);
        return announcement;
    }

    deleteStudentAnnouncement(id: string) {
        this.studentAnnouncements = this.studentAnnouncements.filter(a => a.id !== id);
    }


    // Lecturer Methods
    getCourses(lecturerId: string) {
        return this.courses.filter(c => c.lecturerId === lecturerId);
    }

    addCourse(course: Course) {
        this.courses.push(course);
        return course;
    }

    deleteCourse(id: string) {
        this.courses = this.courses.filter(c => c.id !== id);
    }

    getAllCourses() {
        return this.courses;
    }

    getAssignments(lecturerId: string) {
        return this.assignments.filter(a => a.lecturerId === lecturerId);
    }

    addAssignment(assignment: Assignment) {
        this.assignments.push(assignment);
        return assignment;
    }

    getAllAssignments() {
        return this.assignments;
    }

    getResults(courseId: string) {
        return this.results.filter(r => r.courseId === courseId);
    }

    addResult(result: Result) {
        this.results.push(result);
        return result;
    }

    getForumPosts(lecturerId: string) {
        // Get posts for all courses taught by this lecturer
        const myCourseIds = this.courses.filter(c => c.lecturerId === lecturerId).map(c => c.id);
        return this.forumPosts.filter(p => myCourseIds.includes(p.courseId));
    }

    addForumPost(post: ForumPost) {
        this.forumPosts.push(post);
        return post;
    }

    getAllForumPosts() {
        return this.forumPosts;
    }

    getCourseAssignments(courseId: string) {
        return this.assignments.filter(a => a.courseId === courseId);
    }

    deleteAssignment(id: string) {
        this.assignments = this.assignments.filter(a => a.id !== id);
    }

    getCourseForumPosts(courseId: string) {
        return this.forumPosts.filter(p => p.courseId === courseId);
    }

    deleteForumPost(id: string) {
        this.forumPosts = this.forumPosts.filter(p => p.id !== id);
    }

    private submissions: Submission[] = [];
    private forumComments: ForumComment[] = [];

    // Submission Methods
    addSubmission(submission: Submission) {
        // Check if exists
        const existing = this.submissions.find(s => s.relatedId === submission.relatedId && s.studentId === submission.studentId);
        if (existing) {
            Object.assign(existing, submission);
            return existing;
        }
        this.submissions.push(submission);
        return submission;
    }

    getSubmissions(assignmentId: string) {
        return this.submissions.filter(s => s.relatedId === assignmentId);
    }

    getStudentSubmission(assignmentId: string, studentId: string) {
        return this.submissions.find(s => s.relatedId === assignmentId && s.studentId === studentId);
    }

    gradeSubmission(id: string, grade: number) {
        const sub = this.submissions.find(s => s.id === id);
        if (sub) {
            sub.grade = grade;
            sub.status = 'graded';
        }
        return sub;
    }

    // Forum Comment Methods
    addForumComment(comment: ForumComment) {
        this.forumComments.push(comment);
        return comment;
    }

    getForumComments(postId: string) {
        return this.forumComments.filter(c => c.postId === postId);
    }

    getStudentData(userId: string) {
        // Dynamic Calculation from Real Data
        const enrollments = this.getStudentEnrollments(userId);
        const enrolledCourseIds = enrollments.map(e => e.courseId);

        // Filter derived data
        const myCourses = this.courses.filter(c => enrolledCourseIds.includes(c.id));
        const myAssignments = this.assignments.filter(a => enrolledCourseIds.includes(a.courseId));
        // Simple logic: If deadline > now, it's upcoming? Or isOverdue check.
        // For simplicity in mock, let's just show all assignments as 'pending' or 'upcoming' if we don't have submissions yet.

        const myForumPosts = this.forumPosts.filter(p => enrolledCourseIds.includes(p.courseId));

        return {
            summary: {
                activeCourses: myCourses.length,
                activeGroupings: Math.floor(myCourses.length / 2),
                tutorGroupings: 1, // Placeholder
                pendingAssignments: myAssignments.length, // All assigned are pending for now
                upcomingQuizzes: myAssignments.filter(a => a.type === 'quiz').length
            },
            progress: myCourses.map(c => {
                const cAssignments = myAssignments.filter(a => a.courseId === c.id);
                return {
                    id: c.id,
                    code: c.code,
                    title: c.title,
                    assignmentCompletion: `0 out of ${cAssignments.filter(a => a.type === 'assignment').length}`,
                    quizCompletion: `0 out of ${cAssignments.filter(a => a.type === 'quiz').length}`,
                    forumParticipation: '0 posts',
                    progress: 0 // Start at 0
                };
            }),
            deadlines: {
                quizzes: myAssignments.filter(a => a.type === 'quiz').map((q, i) => ({
                    id: q.id,
                    course: this.courses.find(c => c.id === q.courseId)?.code || 'Unknown',
                    title: q.title,
                    date: q.dueDate,
                    isOverdue: false // Default false for now
                })),
                assignments: myAssignments.filter(a => a.type === 'assignment').map((a, i) => ({
                    id: a.id,
                    course: this.courses.find(c => c.id === a.courseId)?.code || 'Unknown',
                    title: a.title,
                    date: a.dueDate,
                    isOverdue: false
                }))
            },
            forumActivity: myForumPosts.map(p => ({
                id: p.id,
                course: this.courses.find(c => c.id === p.courseId)?.code || 'Unknown',
                topic: p.title,
                author: p.authorName,
                date: p.date,
                content: p.content
            })),
            classes: [
                // Mock live class for demo if enrolled in at least one course
                ...(myCourses.length > 0 ? [{ id: 1, course: myCourses[0].code, title: 'Weekly Lecture', time: '10:00 AM', link: '#', status: 'Scheduled' }] : [])
            ]
        };
    }

    findUserByEmail(email: string) {
        return this.users.find(u => u.email === email);
    }

    findUserById(id: string) {
        return this.users.find(u => u.id === id);
    }

    createUser(user: User) {
        this.users.push(user);
        return user;
    }

    getUsersByRole(role: string) {
        return this.users.filter(u => u.role === role);
    }

    updateUser(id: string, updates: any) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            // Distinctly separate top-level keys vs profile keys
            const topLevelKeys = ['email', 'password', 'role'];

            // Apply top level updates
            topLevelKeys.forEach(key => {
                if (key in updates) {
                    (this.users[index] as any)[key] = updates[key];
                }
            });

            // Apply profile updates
            const profileUpdates: any = {};
            Object.keys(updates).forEach(key => {
                if (!topLevelKeys.includes(key) && key !== 'id') {
                    profileUpdates[key] = updates[key];
                }
            });

            if (Object.keys(profileUpdates).length > 0) {
                this.users[index].profile = { ...this.users[index].profile, ...profileUpdates };
            }

            return this.users[index];
        }
        return null;
    }
    // ... inside MockDB class ...
    private enrollments: Enrollment[] = [];

    // Enrollment Methods
    enrollStudent(studentId: string, courseId: string, semester: string) {
        // Check if already enrolled
        const existing = this.enrollments.find(e => e.studentId === studentId && e.courseId === courseId);
        if (existing) return existing;

        const enrollment: Enrollment = {
            id: `enr-${Math.random().toString(36).substring(2, 9)}`,
            studentId,
            courseId,
            semester,
            enrolledAt: new Date().toISOString()
        };
        this.enrollments.push(enrollment);

        // Update course count
        const course = this.courses.find(c => c.id === courseId);
        if (course) course.studentCount++;

        return enrollment;
    }

    getStudentEnrollments(studentId: string) {
        return this.enrollments.filter(e => e.studentId === studentId);
    }

    getCourseStudents(courseId: string) {
        return this.enrollments.filter(e => e.courseId === courseId);
    }

    // Helper to get full course details for a student
    getStudentCourses(studentId: string) {
        const myEnrollments = this.getStudentEnrollments(studentId);
        return myEnrollments.map(e => {
            const course = this.courses.find(c => c.id === e.courseId);
            if (!course) return null;

            const lecturer = this.users.find(u => u.id === course.lecturerId);
            return {
                ...course,
                lecturerName: lecturer ? `${lecturer.profile.firstName} ${lecturer.profile.lastName}` : 'Unknown'
            };
        }).filter(Boolean);
    }
    deleteUser(id: string) {
        this.users = this.users.filter(u => u.id !== id);
        // Also cleanup their pointers
        if (id.startsWith('student')) {
            this.enrollments = this.enrollments.filter(e => e.studentId !== id);
            this.results = this.results.filter(r => r.studentId !== id);
        }
        if (id.startsWith('lecturer')) {
            // Unassign courses? Or keep them but with no lecturer?
            // For now, keep courses but set lecturerId to null or leave as is (will default to unknown)
        }
        return true;
    }
}

// Singleton instance
export const mockDB = new MockDB();
