:- use_module(library(plunit)).
:- use_module('../rules', [load_form/1, solve_schedule_rows/1]).

:- begin_tests(boundary_tests).

test(tagged_rows_load_and_export_schedule_rows, [true(Rows==[[algebra, 1, mr_jansen, 1, 1]])]) :-
	load_form([[teacher_skill, mr_jansen, math], [teacher_available, mr_jansen, 1, 1], [course_requires, algebra, math], [course_classes, algebra, 1]]),
	solve_schedule_rows(Rows).

test(tagged_constraint_rows_reach_domain_solver, [true(Rows==[[algebra, 1, mr_jansen, 1, 3], [algebra, 2, mr_jansen, 1, 4]])]) :-
	load_form([[teacher_skill, mr_jansen, math], [teacher_available, mr_jansen, 1, 3], [teacher_available, mr_jansen, 1, 4], [course_requires, algebra, math], [course_classes, algebra, 2], [course_constraint, algebra, successive, 1, 2]]),
	solve_schedule_rows(Rows).

test(loading_a_new_form_clears_old_facts, [true(Rows==[])]) :-
	load_form([[teacher_skill, mr_jansen, math], [course_requires, algebra, math], [course_classes, algebra, 1]]),
	load_form([]),
	solve_schedule_rows(Rows).

:- end_tests(boundary_tests).
