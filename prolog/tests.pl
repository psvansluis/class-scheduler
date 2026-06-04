:- use_module(library(plunit)).

:- dynamic teacher_skill/2.
:- dynamic course_requires/2.

% Explicitly scrub the global user namespace clean
clear_db :-
    retractall(user:teacher_skill(_, _)),
    retractall(user:course_requires(_, _)).

% The macro helper - now automatically forces a clear_db before injecting new facts!
given(Facts) :-
    clear_db,
    inject_facts(Facts).

inject_facts([]) :- !.
inject_facts([Fact|Facts]) :-
    asserta(user:Fact),
    inject_facts(Facts).

% No more attributes on the block header—keeping it completely vanilla
:- begin_tests(scheduling_domain_tests).

test(empty_database_returns_false, [fail]) :-
    given([]),
    can_teach(_, _).

test(skills_match, [true(Teacher == mr_jansen)]) :-
    given([
        teacher_skill(mr_jansen, math),
        course_requires(algebra, math)
    ]),
    can_teach(Teacher, algebra).

test(skills_mismatch, [fail]) :-
    given([
        teacher_skill(mr_jansen, math),
        course_requires(lab_chemistry, chemistry)
    ]),
    can_teach(mr_jansen, lab_chemistry).

:- end_tests(scheduling_domain_tests).