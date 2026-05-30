% Setup temporary test data manually since we don't have asserta/retract helper blocks
test_data(teacher_skill(test_teacher, math)).
test_data(course_requires(test_course, math)).

test_data_mismatch(teacher_skill(test_teacher, math)).
test_data_mismatch(course_requires(test_course, history)).

% Test Case 1: Should Succeed
test_valid_skill_match :-
    test_data(teacher_skill(T, S)),
    test_data(course_requires(C, S)),
    can_teach(T, C).

% Test Case 2: Should Fail (We check failure in the JS runner)
test_invalid_skill_mismatch :-
    test_data_mismatch(teacher_skill(T, S1)),
    test_data_mismatch(course_requires(C, S2)),
    can_teach(T, C).