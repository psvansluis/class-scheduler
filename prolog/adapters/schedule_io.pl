:- module(schedule_io,
	[ load_form/1,
	  solve_schedule_rows/1
	]).

:- use_module('../domain/scheduler_domain',
	[ replace_facts/1,
	  solve_schedule/1
	]).

% load_form(+Rows)
% Converts tagged JavaScript rows to domain facts and replaces the database.
load_form(Rows) :-
	maplist(form_row_to_fact, Rows, Facts),
	replace_facts(Facts).

form_row_to_fact([teacher_skill, Teacher, Skill],
	teacher_skill(Teacher, Skill)).
form_row_to_fact([teacher_available, Teacher, Day, Period],
	teacher_available(Teacher, slot(Day, Period))).
form_row_to_fact([course_requires, Course, Skill],
	course_requires(Course, Skill)).
form_row_to_fact([course_classes, Course, Count],
	course_classes(Course, Count)).
form_row_to_fact([course_constraint, Course, successive, A, B],
	course_constraint(Course, successive(A, B))).
form_row_to_fact([course_constraint, Course, min_day_gap, A, B, Gap],
	course_constraint(Course, min_day_gap(A, B, Gap))).

% solve_schedule_rows(-Rows)
% Exports each class as a flat row for the JavaScript boundary.
solve_schedule_rows(Rows) :-
	solve_schedule(Schedule),
	maplist(class_row, Schedule, Rows).

class_row(class(Course, Index, Teacher, slot(Day, Period)),
	[Course, Index, Teacher, Day, Period]).
