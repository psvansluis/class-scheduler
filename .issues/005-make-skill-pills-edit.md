---
id: 005
title: Make Skill Pills editable in the form input
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: []
created: 2026-09-14
---

# 005 - Make Skill Pills editable in the form input

It is quite easy to make a typo when creating a skill, adding the skill elsewhere, and then notice the typo. Let's make such mistakes easy to correct.

## Description

A skill pill in the skill input form should have the option to edit it. There are two UI options for this:

- Clicking text on the pill makes it into a textbox
- There is an edit button that turns the text into a textbox

I lean towards the second because it is the most obvious, and probably easiest to maintain.

Skill names are strictly unique. A clash with an existing skill name must be disallowed. If skills need to be mergeable, that can be its own ticket down the line.

## Acceptance Criteria

- [ ] The name of a skill is editable
- [ ] The UI should make it clear that this is possible
- [ ] Edits to a skill are propagated to where the skill is referenced (e.g. in the teacher input)
