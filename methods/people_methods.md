# Meet the people: writer, fellowship and academic-affiliation counts

**Version 1.0 · November 4, 2026.** This adds evidence-linked counts and annual composition views to the Welcoming pathways interface, approved for public promotion November 4, 2026. The previous interface is archived privately.

## Inputs and provenance

- [Source-author register](../credits/credits_and_process.json): existing reviewed identity groups, raw credit strings, evidence tiers and record IDs. It includes source writers rather than automatically crediting them for this website’s code or new interpretations.
- [Saved GCDI directory data](../membership/directory_data.json), [claim ledger](../membership/role_claims.csv), [annual cells](../membership/annual_memberships.csv) and [directory methods](../membership/README.md): the People page observed **November 2, 2026**. The live [GCDI People page](https://gcdi.commons.gc.cuny.edu/people/) can subsequently differ.
- [Current-team snapshot](../membership/current_roles_snapshot.json) and saved rendered `people_page_text.txt`: source names, role headings and academic labels, without appointment intervals. The current academic-label extraction is new in this display builder; historical claims and appointment definitions are unchanged.
- The **November 1, 2026** WordPress snapshot: 421 published category records, including curated/source-linked works; nine drafts remain outside these writer counts.

`build_people.py` joins these saved inputs. It imports the existing reviewed identity mapping and membership-only source crosswalks; it performs no fuzzy name matching or new person merge. Existing Margaret/Maggie Schreiner and Anna Schlenz/Anna Corbett confirmations remain as recorded. No source post, author disposition, raw roster, appointment interval or NLP/model output is changed.

## Headline counts and controls

The default is **local/unflagged posts**, with **named credits: checked or declared**. Organization labels, anonymous/unresolved labels and identities appearing solely as posting accounts are excluded. A person with one qualifying entry counts once, including across coauthored posts and multiple years. “Unflagged” means no external-curation marker was detected, not an independently certified originality judgment.

| Count | Default local/named value | Meaning |
| --- | ---: | --- |
| Named local-post writers | **52** | Distinct reviewed personal-name labels with a published local source-supported or declared writing credit. Identity verification is incomplete. |
| Documented GC Digital Fellow writers | **31** | Of those 52, **28** match a dated GC Digital Fellow history and **3** have an explicit current GC Digital Fellow role only, without historical appointment dates. Those three are Ian G. Williams, Meha Gupta and Sophie Bala in the saved snapshot. |
| Dated Digital Fellow matches at a credited publication | **28** | The stored post-membership join matches those writers to a dated GC Digital Fellow interval at at least one qualifying publication. Summer matches are not invented. This narrower count is shown separately from undated current roles. |
| Writers across broader GCDI Fellow families | **35** | People with a recorded digital, social-media, Manifold, advising, scholarship-center, postdoctoral or videography Fellow role, from dated history or the current snapshot. Includes the Digital Fellows above; do not add the two headcounts. Coordinator/assistant-only records do not establish a Fellow role. |
| Documented academic program/discipline labels | **20** | Display groupings observed for **36 of the 52** writers. The other **16** lack affiliation evidence in these saved directory inputs. This is not the unknown complete number of formal programs or standardized disciplines. |
| GCDI role families represented | **6** | Advising, coordinator, digital, Manifold, scholarship-center and social-media labels among the default selected writers. This is a separate dimension from academic programs. Coordinator is a role family, not automatically a fellowship. |

Two selectors expose the denominator rather than hiding it:

- **All published records** includes credited source writers of curated external works. It yields **144 named writers represented**, including the 52 with local-post credits; they are not 144 original Tagging the Tower local authors. It yields 36 documented Digital Fellow writers (33 dated plus three current-only), 41 across broader Fellow families, and 23 academic labels documented for 42 of 144 names.
- **Source-supported only** restricts the writing evidence, yielding 48 names, 28 documented Digital Fellow writers (26 dated plus two current-only), 32 broader Fellow writers and 18 academic labels for 33 names. The checked local/all totals coincide in this snapshot; the controls do not fabricate differences.

Across all published records, **13 additional personal-name labels appear only as unresolved posting accounts**. They remain in the archive accounting but are not silently promoted to article writers. Missing source evidence is not proof that these people did not write; the named counts are incomplete evidence-bounded totals rather than a comprehensive human-certified census. Declared credits are not equivalent to checked credits, and passing automated tests does not prove all identities or bylines.

## Academic affiliations and programs

The original directory’s `department` field mixes academic programs, disciplines, specializations and occasional joint affiliations. The UI deliberately calls these **documented academic labels**, rather than claiming a precise formal-program or disciplinary-taxonomy census.

Display-only grouping resolves cosmetic differences:

- Earth & Environmental Science / Sciences / Earth and Environmental Sciences → **Earth and Environmental Sciences**.
- Theater / Theatre / Theatre & Performance / Theatre and Performance → **Theatre and Performance**.
- The source typo **Criminal Justive** → **Criminal Justice**.
- **LAILAC** → **Latin American, Iberian, and Latino Cultures**, as an expanded display label.

Every original string, source passage and claim ID remains inspectable. No broader collapse is made between Psychology and its subfields, Anthropology and Cultural Anthropology, or Business Information Systems and Information Systems. Joint labels are not split into invented program memberships, and no degree level or university enrollment history is inferred. A person can carry labels from more than one source or time; a current label must not be assigned retroactively to historical years.

Current academic text is read from the first saved block after each exact current-team name. Role headings, website labels and following names are boundaries; wrapped Speech-Language-Hearing / Sciences is joined as one label. Existing name crosswalks are reused. Staff job titles are not turned into degree programs. This extends affiliation coverage for named writers but does not add dates to their current roles.

## Annual team and composition views

The annual chart uses the **245 saved deduplicated person/role/year cells**, which preserve underlying claim IDs. There are **52 distinct Digital Fellow names in the dated directory overall**, not all of whom have qualifying named writing credits. This number differs from 52 named local writers: they are different sets that happen to have equal totals in this snapshot.

- **Team scope:** all documented members, or only the people meeting the two writing controls.
- **Role scope:** GC Digital Fellows only, or all dated GCDI role families. Families stay separate; people holding multiple roles are counted once in annual overall headcounts.
- **Composition:** academic-affiliation labels, or GCDI role families. Each matrix cell counts distinct names for that year and label. Claims may overlap across fields/roles, so cell totals need not sum to the overall headcount.

The bars use a common within-view count scale, not article counts or a productivity measure. Colour intensity in the matrix is scaled from zero to the largest annual distinct-person headcount in the chosen view; numeric cell values and named buttons retain the information without colour. The matrix scrolls within a labelled keyboard-focusable region on small screens. Selecting a bar or cell opens names and literal directory statements; names lead to affiliations, dated-role evidence and their credited posts under the current writing controls. Reading a post returns to its originating People evidence control.

Academic years follow the project’s saved **August–July** convention. A source range 2012–2015 expands to 2012–2013, 2013–2014 and 2014–2015. A fall-only claim stays limited by its saved semester metadata. These are annual interval claims, not exact appointment days, first recruitment/intake cohorts, or proof of activity throughout summer. A bar reports recorded annual matches, not an independently certified complete cohort.

The dated directory covers **2012–2013 through 2025–2026**. The 2026–2027 column is **unavailable (—)**, not a zero-sized team. The 20-name current-team snapshot is shown separately and never added to a year. A numeric zero elsewhere means no recorded matches under the controls, not proof of no real-world appointments or absence of a discipline. Guest writers and institute participants remain eligible writers even without a Fellow/directory match; nonmembership and guest status cannot be inferred from a missing match alone.

## Validation and attribution

`test_people.py` independently reconciles scope/evidence name sets against the source-author register, dated/current Fellow sets, annual claims and coverage, raw academic strings and wrapped labels. `people_validation.json` records checks actually run and browser observations. Existing corpus, model, credit and coverage checks remain required. No new NLTK cleaning, MALLET fit, user study or source-author reassignment is performed.

**Human — Ian G. Williams:** requested writer/Fellow headcounts, program/discipline representation and cohort-composition views. He previously supplied the People directory, academic-calendar interpretation and two identity confirmations. CRediT for this task: Conceptualization; Project administration. Computational execution, complete source verification and approval of each display grouping are not inferred from the request.

**AI — OpenAI Codex:** wrote annotated saved-evidence joins and current-affiliation extraction; chose/disclosed counting boundaries and cosmetic display mappings; built count cards, controls, annual bars, composition matrices, evidence drill-down and reading return paths; drafted methods and ran recorded checks. Exact underlying model/build unknown/not recorded. GAIDeT saved task IDs: Code generation `0000017`; Data curation and organization `0000025`; Data analysis `0000026`; Visualization `0000027`; Validation `0000023`; Text generation `0000030`; Identification of limitations `0000046`. Python computes counts; browser controls select saved evidence. AI is not a human author or independent human reviewer. Source writers retain their source-text credit without implied endorsement of this website.

The installed colour-independence, table-accessibility and plain-language-design skills informed this revision. Automated and agent browser checks do not establish accessibility conformance, participant evaluation, comprehensive identity accuracy or a complete disciplinary census.
