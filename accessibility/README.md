# Inclusive-design skills in this project

These skills guide future design and review work on Tagging The Tower Archives Explorer. They help reviewers consider how people find posts, understand analysis and use the site with different access needs. Installing them does not establish that the website is accessible or that a review has been completed.

## Source and installation

Ian G. Williams requested this integration. The source is [Owl-Listener/inclusive-design-skills](https://github.com/Owl-Listener/inclusive-design-skills), pinned to commit [`6e0740f04b2130af60bc57abe3401b91e460e70d`](https://github.com/Owl-Listener/inclusive-design-skills/tree/6e0740f04b2130af60bc57abe3401b91e460e70d), retrieved November 3, 2026. The upstream MIT notice names **MC Dean**; the [complete license](INCLUSIVE_DESIGN_LICENSE.txt) is preserved. That is source attribution, not evidence of participation in this project, manual production or contributor approval.

The Codex skill-installer helper installed the skills into this repository’s `.agents/skills` folder. They are project-local, not installed across Ian’s account. The installer’s direct download failed certificate verification; its Git method succeeded without disabling certificate checks. The files are unchanged from the pinned upstream revision.

The repository advertises 40 knowledge skills and 18 workflow prompts. This project enables **39 unique skills** across all six categories. One upstream knowledge directory, `adaptive-personalisation`, has the same discovery name and bytes as `contextual-help-design`; it is preserved under `upstream_reference/` outside skill discovery. The 18 workflow prompts remain available from the pinned upstream source; their generic command names are not installed. There is no new standalone personalisation skill in this snapshot.

The [manifest](skills_manifest.json) lists every enabled skill, its upstream URL, installation path and SHA-256 hash. A checksum records which bytes were installed; it does not prove that a recommendation is accurate. Later updates require reviewing the upstream changes, refreshing the manifest and notices, checking discovery names and recording the revision in the work log. Do not automatically follow upstream `main`.

## Apply only the skills needed for the task

Read the selected `SKILL.md` files before applying them. Keep the assignment’s permitted scope: a review produces findings; a revision implements only the authorized changes. These skills do not authorize additional agents, participant recruitment, external messages, publication, new tracking, data changes or feature removal. Existing project instructions and Ian’s decisions still apply.

| Project task | Relevant installed skills | What a reviewer should check |
| --- | --- | --- |
| Search and browse the archive | wayfinding-navigation; form-labelling; keyboard-navigation; feedback-and-status; error-prevention-recovery | Labels explain filters; active filters and result counts are visible; empty results offer a clear reset; focus and return routes remain usable. |
| Random post discovery | memory-load-reduction; focus-attention-design; keyboard-navigation | The new title and context are clear; a reader can return to the previous location; no unrequested automatic advance interrupts reading. |
| Public orientation and synthesis | plain-language-design; readable-content; heading-structure; link-text-design | Explain the Graduate Center and Digital Fellows on first use. Separate original authors’ statements from machine-assisted synthesis and uncertainty. Simplify explanations without altering source quotations or evidence. |
| Topic, theme and author-network views | colour-independence; table-accessibility; feedback-and-status; contextual-help-design | Supply meaningful text/table alternatives, clear units and denominators, keyboard access to details and labels that distinguish saved topics, keyword signals and interpretation. Describe author/year edges as publication credits, not appointments or productivity. |
| Optional design-history exhibit | user-preference-respect; motion-sensitivity; flexible-typography; responsive-accessibility | Keep the exhibit available while respecting reduced motion, zoom and system colour/contrast settings. Test combinations with each historical appearance; selecting a design year must not silently filter publication years. |
| Simplification proposals | cognitive-load-assessment; information-density; simplified-views; tradeoff-analysis | Reduce unnecessary decisions while preserving search, random discovery, source access and uncertainty. Keep proposed backlog items proposed until authorized. |
| Future audience research | disability-inclusive-personas; assistive-technology-scenarios; inclusive-user-stories; situational-impairment-mapping | Include varied access needs and contexts without inventing participant evidence or treating one persona as representative of all disabled people. Label AI scenarios as hypotheses. |
| Reviews and handoffs | decision-documentation; accessibility-debt-tracking; accessibility-testing-strategy; stakeholder-communication | Record artifact/revision, task, barrier, evidence, impact, recommendation, owner, checks performed and remaining uncertainty. Separate automated, agent/manual-browser and actual participant evidence. |

The remaining installed skills are available when their stated scope matches a task. Their presence does not require adding voice input, multimedia, new preference controls or other features to this archive.

## Interpret upstream guidance carefully

Upstream checklists are design guidance, not project findings or a conformance certificate. Some contain categorical wording, numerical heuristics or uncited estimates. For example, the testing-strategy skill’s approximate 30/50/20 percentages are not measured coverage for this website; do not repeat them as such. Click-count rules and reading-level targets require context. Preserve precise research counts and source wording where precision matters.

Before making a standards-based claim, verify the applicable primary source and record the actual criterion and result. Start with [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/), [W3C cognitive accessibility guidance](https://www.w3.org/TR/coga-usable/) and [WAI testing with users](https://www.w3.org/WAI/test-evaluate/involving-users/). A recommended pattern or numeric threshold from a skill must not be represented as a mandatory WCAG requirement without that verification. This integration does not claim a fresh audit of every upstream citation.

## Review record for the next authorized revision

Use this short record alongside the existing work log:

1. **Scope:** which revision, page, flow and user task were inspected? Which skills were actually read?
2. **Observation:** where is the barrier, and what action reproduces it? Separate inspected behavior from a hypothesis.
3. **Impact:** who could be excluded or delayed? State the basis and severity without inventing user testimony.
4. **Proposed change:** what improves, what might be lost and which evidence must remain? Link any existing SIM backlog item.
5. **Checks:** identify automation, keyboard/browser checks, assistive technology and real participant work separately; mark unperformed checks as untested.
6. **Attribution and decision:** record Ian’s actual direction and any other documented human contributions using CRediT; record delegated AI tasks using the saved GAIDeT mappings. Name the decision-maker and record approval only when supplied.

No whole-site accessibility assessment, participant study, redesign, source-author change or model refit was performed during this installation. The active simplification backlog and isolated prototype retain their existing status.
