:- module(scheduler_domain,
	[ can_teach/2,
	  replace_facts/1,
	  solve_schedule/1
	]).

:- use_module(library(clpfd)).

:- dynamic teacher_skill/2.
:- dynamic course_requires/2.
:- dynamic course_classes/2.
:- dynamic course_constraint/2.
:- dynamic teacher_available/2.

% Replace the current dynamic database with validated domain facts.
replace_facts(Facts) :-
	clear_form,
	maplist(assert_domain_fact, Facts).

clear_form :-
	retractall(teacher_skill(_, _)),
	retractall(course_requires(_, _)),
	retractall(course_classes(_, _)),
	retractall(course_constraint(_, _)),
	retractall(teacher_available(_, _)).

assert_domain_fact(teacher_skill(Teacher, Skill)) :-
	assertz(teacher_skill(Teacher, Skill)).
assert_domain_fact(course_requires(Course, Skill)) :-
	assertz(course_requires(Course, Skill)).
assert_domain_fact(course_classes(Course, Count)) :-
	assertz(course_classes(Course, Count)).
assert_domain_fact(course_constraint(Course, Constraint)) :-
	assertz(course_constraint(Course, Constraint)).
assert_domain_fact(teacher_available(Teacher, Slot)) :-
	assertz(teacher_available(Teacher, Slot)).

% can_teach(?Teacher, ?Course)
% Matches a teacher to a course based on shared skills.
can_teach(Teacher, Course) :-
	teacher_skill(Teacher, Skill),
	course_requires(Course, Skill).

% solve_schedule(-Schedule)
% Solves the timetable CSP returning class/4 terms.
solve_schedule(Schedule) :-
	collect_courses(Courses),
	generate_classes(Courses, Schedule, ClassSlots, TeacherClassesMap),
	enforce_teacher_availability(TeacherClassesMap),
	enforce_course_constraints(Schedule),
	extract_vars(ClassSlots, Vars),
	labeling([ff], Vars).

% Collect all unique courses and class counts from course_classes/2 facts.
collect_courses(Courses) :-
	findall(Course - Count,
		course_classes(Course, Count),
		Pairs),
	sort(Pairs, Courses).

% For each course, choose a qualified teacher and generate its classes.
generate_classes([], [], [], []).
generate_classes([Course-Count|RestCourses], Schedule, ClassSlots, [Teacher-TeacherSlots|RestMap]) :-
	can_teach(Teacher, Course),
	course_class_indices(Count, Indices),
	generate_course_classes(Indices, Course, Teacher, Classes, TeacherSlots),
	generate_classes(RestCourses, RestSchedule, RestClassSlots, RestMapRaw),
	append(Classes, RestSchedule, Schedule),
	append(TeacherSlots, RestClassSlots, ClassSlots),
	merge_teacher_slots(Teacher - TeacherSlots, RestMapRaw, RestMap).

course_class_indices(Count, Indices) :-
	(Count =< 0 ->
	Indices = [];
	numlist(1, Count, Indices)).

generate_course_classes([], _Course, _Teacher, [], []).
generate_course_classes([Idx|RestIdx], Course, Teacher, [class(Course, Idx, Teacher, slot(Day, Period))|RestClasses], [slot_ref(SlotIndex, Day, Period)|RestSlots]) :-
	Day in 1..5,
	Period in 1..8,
	SlotIndex #= (Day - 1)*8 + Period,
	generate_course_classes(RestIdx, Course, Teacher, RestClasses, RestSlots).

merge_teacher_slots(Teacher-Slots, MapIn, MapOut) :-
	(select(Teacher - ExistingSlots, MapIn, RestMap) ->
	append(Slots, ExistingSlots, Combined),
		MapOut = [Teacher - Combined|RestMap];
	MapOut = [Teacher - Slots|MapIn]).

% Enforce teacher availability and prevent double booking.
enforce_teacher_availability([]).
enforce_teacher_availability([Teacher-SlotRefs|Rest]) :-
	SlotRefs \== [],
	!,
	findall(Idx,
		(teacher_available(Teacher,
				slot(D, P)),
			integer(D),
			integer(P),
			D >= 1,
			D =< 5,
			P >= 1,
			P =< 8,
			Idx is (D - 1)*8 + P),
		RawIndices),
	sort(RawIndices, AllowedIndices),
	AllowedIndices \== [],
	list_to_fdset(AllowedIndices, FdSet),
	constrain_teacher_slots(SlotRefs, FdSet, SlotIndexVars),
	all_distinct(SlotIndexVars),
	enforce_teacher_availability(Rest).
enforce_teacher_availability([_Teacher-[]|Rest]) :-
	enforce_teacher_availability(Rest).

constrain_teacher_slots([], _FdSet, []).
constrain_teacher_slots([slot_ref(SlotIndex, _Day, _Period)|RestRefs], FdSet, [SlotIndex|RestVars]) :-
	in_set(SlotIndex, FdSet),
	constrain_teacher_slots(RestRefs, FdSet, RestVars).

% Enforce declared course constraints (successive, min_day_gap).
enforce_course_constraints(Schedule) :-
	findall(Course - Constraint,
		course_constraint(Course, Constraint),
		Constraints),
	apply_constraints(Constraints, Schedule).

apply_constraints([], _Schedule).
apply_constraints([Course-Constraint|Rest], Schedule) :-
	apply_constraint(Constraint, Course, Schedule),
	apply_constraints(Rest, Schedule).

apply_constraint(successive(A, B), Course, Schedule) :-
	member(class(Course,
			A,
			_,
			slot(DayA, PeriodA)),
		Schedule),
	member(class(Course,
			B,
			_,
			slot(DayB, PeriodB)),
		Schedule),
	DayB #= DayA,
	PeriodB #= PeriodA + 1.
apply_constraint(min_day_gap(A, B, Gap), Course, Schedule) :-
	member(class(Course,
			A,
			_,
			slot(DayA, _)),
		Schedule),
	member(class(Course,
			B,
			_,
			slot(DayB, _)),
		Schedule),
	DayB - DayA #> Gap.

% Extract all Day and Period variables to be labeled.
extract_vars([], []).
extract_vars([slot_ref(_SlotIndex, Day, Period)|Rest], [Day, Period|RestVars]) :-
	extract_vars(Rest, RestVars).
