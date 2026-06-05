can_teach(Teacher, Course) :-
	teacher_skill(Teacher, Skill),
	course_requires(Course, Skill).