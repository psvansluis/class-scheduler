:- module(rules, [can_teach/2]).
:- dynamic teacher_skill/2.
:- dynamic course_requires/2.

can_teach(Teacher, Course) :-
    teacher_skill(Teacher, Skill),
    course_requires(Course, Skill).