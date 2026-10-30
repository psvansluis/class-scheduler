:- module(rules,
	[ load_form/1,
	  solve_schedule/1,
	  solve_schedule_rows/1
	]).

:- use_module(domain/scheduler_domain, [solve_schedule/1]).
:- use_module(adapters/schedule_io, [load_form/1, solve_schedule_rows/1]).
