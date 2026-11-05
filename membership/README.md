# Historical Fellows and GCDI roles

This extension uses the [GCDI People directory](https://gcdi.commons.gc.cuny.edu/people/), accessed November 2, 2026, to contextualize the Tagging The Tower archive. Open [the interactive history](../FELLOWS_HISTORY.html) for a year-by-role matrix and the original statements behind each entry.

## What the evidence means

Ian G. Williams supplied this source and confirmed that its ranges follow an academic calendar. We interpret 2012–2015 as 2012–2013, 2013–2014 and 2014–2015. These are annual interval claims, not precise appointment dates. A fall-only entry stays fall-only; summer post matches are not inferred. Current roles without explicit academic-year confirmation remain a separate snapshot, never extrapolated backward. The seven Digital Fellows were subsequently confirmed by Ian as the 2026–2027 roster, as documented below.

The extraction preserves all 94 alumni rows, including duplicate statements, and separates nine role families. Multiple claims about the same reviewed person, role and year produce one matrix cell with all supporting claim identifiers retained. A person may occupy several roles; sums across role columns are not distinct-person totals. A missing claim is not proof of nonmembership. Combined Fellow/coordinator labels do not establish coordinator-specific dates.

## Names and article credits

The original directory spellings are retained. `review.json` documents each membership-only crosswalk and its evidence. Ian explicitly confirmed Margaret Schreiner / Maggie Schreiner and Anna Schlenz / Anna Corbett. Existing archive labels remain the display names; no preferred current name is inferred. The [Barnard institutional profile](https://digitalhumanities.barnard.edu/profiles/al-mcmichael) explicitly connects A.L. McMichael with Alice Lynn McMichael. Other crosswalks have evidence-supported status rather than personal confirmation.

An initial-only or first-name signed credit is resolved only when the dated role context supplies one candidate, or a separately reviewed contemporaneous name mapping supplies the missing identity. Two spring-2018 Patrick entries remain ambiguous. A current-directory name can resolve the identity in a dated signed list without supplying historical appointment dates itself.

A directory match never supplies an article byline. The active article-match register covers the 421 published records. The source inventory retains its original statuses. Matching a provisional account credit to a historical Fellow does not make that article source-supported. Keep the source-supported authorship filter separate from the membership filter.

## Guest authors and participants

The archive also includes guest-authored posts by students who were not Fellows at publication, including participants in the Graduate Center Digital Research Institute (GCDRI). Ian supplied this contextual clarification. Guest authorship is an authorship relationship; participation and fellowship appointments are separate roles. Assess fellowship status at the post date, rather than treating it as a lifetime identity. A missing directory match alone establishes neither guest status nor nonmembership. Participant reflections remain in the full archive and its applicable analytical populations; a Fellow-only filter intentionally selects a narrower population.

## Comparison choices

- **Original signed teams:** the unchanged semester-level baseline.
- **Resolved signed teams:** the baseline plus reviewed name resolutions.
- **Dated Digital Fellow intervals:** the directory's GC Digital Fellow role only.
- **Any dated GCDI role:** broader institutional context, with role families retained.
- **Combined:** resolved signed teams or a dated Digital Fellow interval.

A collective post qualifies when at least one recorded credit matches. This is a post-level inclusion rule; it does not assign every coauthor that role. Topic averages use the same fitted weights for the same 299 modeled posts. No new NLTK cleaning or MALLET fitting occurred. Differences show sensitivity to population definitions, not causal fellowship effects. The original signed-only topic table is independently checked against its saved values. The index (including its author/year credit network) and thematic charts also offer these optional membership filters; the network still counts publication credits rather than appointments.

## Files and reproduction

`people_page_text.txt` preserves the rendered page; `alumni_text.txt` preserves its alumni section; `current_roles_snapshot.json` preserves separately labelled current names. `role_claims.csv` records every extracted claim. `annual_memberships.csv` contains deduplicated annual cells. `signed_name_resolutions.csv` documents resolutions and ambiguities. `post_membership_matches.csv` covers 421 published records. `topic_means_by_membership_basis.csv` supplies alternative topic summaries. `audit.json` reports counts and boundaries.

From the project root, run `python3 analysis/build_interactive.py`. The annotated standard-library builder in `membership/build_membership.py` reads the saved evidence, checks its fingerprint, expands dates, matches existing credits, checks the original topic baseline and writes the evidence and views. It fails rather than silently ignoring unfamiliar role labels or date strings. It does not retrieve a fresh directory automatically; source changes require a new documented review.

The independent [2012 GC announcement](https://www.gc.cuny.edu/news/digital-gc-expands-new-initiatives) supports the six-person founding Digital Fellow roster. [Jeffrey M. Binder's professional CV](https://jeffreymbinder.net/wp-content/uploads/2025/10/Academic-CV-Jeffrey-M.-Binder.pdf?attachment_id=534) supports the 2015–2016 Digital Fellow role used in the Jeff/Jeffrey membership crosswalk. These checks do not establish comprehensive directory accuracy.

## Contribution and rights

Ian supplied the directory, academic-calendar interpretation and two identity confirmations (CRediT: Data curation, Investigation and Methodology). Codex performed extraction, crosswalk documentation, matching, calculations, visualization, software changes and validation; these are agent-assisted tasks, not human-executed work. The project-wide CRediT/GAIDeT disclosure and work log record this extension. No complete human verification of the directory or archive authorship is claimed.

The source page displays CC BY-NC-SA 4.0; its rights remain separate from the newly created code and analysis, whose licenses await Ian's specification.


## License update · November 3, 2026

Ian selected MIT for original project code, documentation and analysis, to the extent project rights permit. This supersedes earlier pending-license statements. Source posts and media retain separate terms; consult the project LICENSE, NOTICE.md and source-rights ledger. Never apply MIT to source works or infer a CC version from an unversioned field.


## November 4, 2026: confirmed 2026–2027 Digital Fellow roster

Ian G. Williams explicitly confirmed that the saved current Digital Fellows section is the **2026–2027 roster**: Sophie Bala, Peyton Cordero, Sara Feinstein, Meha Gupta, Zhilang Liu, Shokraan Rahiminezhad and Ian G. Williams (source name Ian Williams). This supersedes the unavailable/undated treatment for these seven people in current annual team views. See the [recorded confirmation](roster_confirmations.json), [annual membership register](annual_memberships.csv), and [annual role counts](annual_role_counts.csv). Blank counts indicate missing annual evidence for the role. On November 5 Ian assigned the full snapshot to 2026–2027. The original 52-name/122-cell dated Digital Fellow directory evidence is preserved; the additional seven confirmed annual cells yield 15 teams, 129 person/year cells and 58 distinct names. This adds an explicit human-confirmed evidence basis rather than inventing dates from a snapshot. It does not assert exact appointment days, semester attendance, prior publication-date membership or article authorship. Saved model/post membership filters are unchanged.

The annual register now incorporates the full November 2026 snapshot under 2026–2027. It lists seven Digital Fellows, six Social Media Fellows, three Manifold Fellows, three Advising Fellows, and one Coordinator. Each entry carries its role and confirmation. The source snapshot remains available in the private evidence files.
