:- use_module(library(plunit)).
:- use_module('../domain/scheduler_domain',
	[ can_teach/2,
	  replace_facts/1,
	  solve_schedule/1
	]).

given(Facts) :-
	replace_facts(Facts).

:- begin_tests(domain_tests).

test(skills_match, [true(Teacher==mr_jansen)]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math)]),
	can_teach(Teacher, algebra).

test(skills_mismatch, [fail]) :-
	given([teacher_skill(mr_jansen, math), course_requires(lab_chemistry, chemistry)]),
	can_teach(mr_jansen, lab_chemistry).

test(empty_database_returns_empty_schedule, [true(Schedule==[])]) :-
	given([]),
	solve_schedule(Schedule).

test(single_class_scheduled, [true(Schedule==[class(algebra, 1, mr_jansen, slot(1, 1))])]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_classes(algebra, 1), teacher_available(mr_jansen, slot(1, 1))]),
	solve_schedule(Schedule).

test(teacher_assigned_to_all_course_classes, [true(Teachers==[mr_jansen, mr_jansen]), nondet]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_classes(algebra, 2), teacher_available(mr_jansen, slot(1, 1)), teacher_available(mr_jansen, slot(1, 2))]),
	solve_schedule(Schedule),
	findall(T,
		member(class(algebra, _, T, _),
			Schedule),
		Teachers).

test(availability_adherence, [true(Slot==slot(2, 4))]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_classes(algebra, 1), teacher_available(mr_jansen, slot(2, 4))]),
	solve_schedule([class(algebra, 1, mr_jansen, Slot)]).

test(insufficient_availability_fails, [fail]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_classes(algebra, 2), teacher_available(mr_jansen, slot(1, 1))]),
	solve_schedule(_).

test(no_double_booking_fails_when_same_slot, [fail]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_requires(geometry, math), course_classes(algebra, 1), course_classes(geometry, 1), teacher_available(mr_jansen, slot(1, 1))]),
	solve_schedule(_).

test(no_double_booking_succeeds_with_distinct_slots, [nondet]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_requires(geometry, math), course_classes(algebra, 1), course_classes(geometry, 1), teacher_available(mr_jansen, slot(1, 1)), teacher_available(mr_jansen, slot(1, 2))]),
	solve_schedule(Schedule),
	member(class(algebra, 1, mr_jansen, SlotA),
		Schedule),
	member(class(geometry, 1, mr_jansen, SlotB),
		Schedule),
	SlotA \== SlotB.

test(successive_slot_constraint_satisfied, [true([SlotA, SlotB]==[slot(1, 3), slot(1, 4)]), nondet]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_classes(algebra, 2), course_constraint(algebra, successive(1, 2)), teacher_available(mr_jansen, slot(1, 3)), teacher_available(mr_jansen, slot(1, 4))]),
	solve_schedule(Schedule),
	member(class(algebra, 1, _, SlotA),
		Schedule),
	member(class(algebra, 2, _, SlotB),
		Schedule).

test(successive_slot_constraint_fails_if_non_consecutive, [fail]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_classes(algebra, 2), course_constraint(algebra, successive(1, 2)), teacher_available(mr_jansen, slot(1, 3)), teacher_available(mr_jansen, slot(1, 5))]),
	solve_schedule(_).

test(min_day_gap_constraint_satisfied, [nondet]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_classes(algebra, 2), course_constraint(algebra, min_day_gap(1, 2, 1)), teacher_available(mr_jansen, slot(1, 1)), teacher_available(mr_jansen, slot(3, 1))]),
	solve_schedule(Schedule),
	member(class(algebra,
			1,
			_,
			slot(DayA, _)),
		Schedule),
	member(class(algebra,
			2,
			_,
			slot(DayB, _)),
		Schedule),
	DayB - DayA >= 2.

test(min_day_gap_constraint_fails_if_insufficient_gap, [fail]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_classes(algebra, 2), course_constraint(algebra, min_day_gap(1, 2, 1)), teacher_available(mr_jansen, slot(1, 1)), teacher_available(mr_jansen, slot(2, 1))]),
	solve_schedule(_).

test(conflicting_constraints_fail_cleanly, [fail]) :-
	given([teacher_skill(mr_jansen, math), course_requires(algebra, math), course_classes(algebra, 2), course_constraint(algebra, successive(1, 2)), course_constraint(algebra, min_day_gap(1, 2, 1)), teacher_available(mr_jansen, slot(1, 1)), teacher_available(mr_jansen, slot(1, 2)), teacher_available(mr_jansen, slot(3, 1))]),
	solve_schedule(_).

test(multiple_courses_and_teachers, [nondet]) :-
	given([teacher_skill(mr_jansen, math), teacher_skill(ms_smith, english), course_requires(algebra, math), course_requires(literature, english), course_classes(algebra, 1), course_classes(literature, 1), teacher_available(mr_jansen, slot(1, 1)), teacher_available(ms_smith, slot(1, 1))]),
	solve_schedule(Schedule),
	member(class(algebra,
			1,
			mr_jansen,
			slot(1, 1)),
		Schedule),
	member(class(literature,
			1,
			ms_smith,
			slot(1, 1)),
		Schedule).

:- end_tests(domain_tests).
