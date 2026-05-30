% A teacher can teach a class if they possess the required skill
can_teach(Teacher, Course) :-
    teacher_skill(Teacher, Skill),
    course_requires(Course, Skill).