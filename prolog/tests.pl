:- use_module(library(plunit)).
:- use_module('/rules.pl').

% Clean up the targeted module space explicitly
cleanup_db :-
    retractall(rules:teacher_skill(_, _)),
    retractall(rules:course_requires(_, _)).

:- begin_tests(scheduling_domain_tests, [cleanup(cleanup_db)]).

test(skills_match, [true(Teacher == mr_jansen)]) :-
    % Force facts directly into the rules module scope
    asserta(rules:teacher_skill(mr_jansen, math)),
    asserta(rules:course_requires(algebra, math)),
    can_teach(Teacher, algebra).

test(skills_mismatch, [fail]) :-
    asserta(rules:teacher_skill(mr_jansen, math)),
    asserta(rules:course_requires(lab_chemistry, chemistry)),
    can_teach(mr_jansen, lab_chemistry).

:- end_tests(scheduling_domain_tests).