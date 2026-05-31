spec(
    skills_match,
    "VALID MATCH: Mr. Jansen has the required math skill for Algebra",
    [
        teacher_skill(mr_jansen, math),
        course_requires(algebra, math)
    ],
    -can_teach(mr_jansen, algebra),
    true
).

spec(
    skills_mismatch,
    "MISMATCH: Mr. Jansen lacks the chemistry skill for Lab work",
    [
        teacher_skill(mr_jansen, math),
        course_requires(lab_chemistry, chemistry)
    ],
    -can_teach(mr_jansen, lab_chemistry),
    false
).