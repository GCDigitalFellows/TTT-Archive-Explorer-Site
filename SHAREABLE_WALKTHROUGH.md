# From blog posts to patterns: a short, shareable walkthrough

This walkthrough explains how we analyzed Tagging the Tower without requiring an audience to learn NLTK, MALLET, or advanced Python. The small examples can be used in a talk or workshop. The analysis report contains the full findings and qualifications.

## First decide what we are counting

The export contains posts, drafts, images, revisions, and other records. We first identify published posts in the relevant category and distinguish original/local writing from curated material. We also distinguish the person whose account posted an item from the person credited with writing it.

For the topic-modeling analysis, 299 posts remain after excluding curated items, recurring welcome messages, and very short texts. Those are research choices. The full inventory preserves what was excluded and why.

This real example reads the inclusion ledger. It does not fit a model, change any files, or need an NLP package. Run it from the project folder containing `analysis`.

```python
import csv
from collections import Counter
from pathlib import Path

ledger = Path("analysis/nlp/corpus_manifest.csv")
with ledger.open() as file:
    posts = list(csv.DictReader(file))

decisions = Counter()
for post in posts:
    reason = post["exclusion"] or "included"
    decisions[reason] += 1

for reason, count in decisions.items():
    print(count, reason)
```

The current ledger accounts for 299 included posts, 96 curated/source-linked items, 18 welcome messages, and 8 items with fewer than 30 cleaned tokens. This is the model's corpus, not the complete history of fellows' work.

## Cleaning makes counting easier and reading harder

Web formatting is not part of an article's argument. We remove common markup, then make two versions of the text: a readable extraction for interpretation and a filtered word list for counting and modeling.

Consider this invented teaching sentence, not a quotation from the corpus:

“We do not need a new tool. We need time and support.”

The following is the word-selection function used in the actual pipeline. It receives words that have already been normalized, plus the documented stoplist. A stopword is a word we have chosen not to count in this stage.

```python
def select_content_words(words, stop_words):
    selected_words = []
    for word in words:
        if word in stop_words:
            continue
        if len(word) < 3 and word not in ("ai", "r"):
            continue
        selected_words.append(word)
    return selected_words
```

In ordinary language: examine each word, skip words on the stoplist, skip very short words except AI and R, and retain everything else. No theme names are supplied here.

Using this study's stoplist, the invented sentence becomes:

```text
need new tool need time support
```

The word “not” has disappeared. The remaining words cannot tell us whether the writer wants another tool. That is why the readable version remains essential. This demonstration shows word selection only; the full pipeline also separates sentences, guesses grammatical roles, and reduces word forms such as “workers” to “worker.”

## A frequent phrase can still be a small conversation

NLTK helps count words and identify associated phrases. We report both how often a phrase appears and how many posts contain it. “AI literacy,” for example, appears 37 times across six modeled posts; “open source” appears 117 times across 60.

Those are different kinds of prominence. Repetition within a few texts is not the same as discussion across a wide community. Phrase scores help locate passages to read; they do not establish the importance or truth of an argument.

## MALLET groups words; people interpret the groups

MALLET's topic model finds recurring word distributions. A topic containing words about websites, WordPress, pages, and servers is recognizable as web publishing. A person supplies that label after inspecting the words and representative posts.

Each post receives a mixture of topics. The mixture describes a pattern in this particular model. It is not a verdict on the post's meaning, a measure of quality, or a confidence score that the human label is correct.

We run multiple model sizes and starting seeds because the groupings can change. The eight-topic model combines AI with access, power, and community; the ten-topic model separates AI research from civic/community technology more clearly. That difference is part of the evidence, not an inconvenience to hide.

## A chart average is another decision

Here is a real example that reads saved model results. It needs only ordinary Python and does not rerun MALLET.

```python
import csv
from statistics import mean

with open("analysis/nlp/document_topic_weights.csv") as file:
    posts = list(csv.DictReader(file))

selected_year = []
for post in posts:
    if post["academic_year"] == "2024–2025":
        selected_year.append(float(post["topic_1"]))

print(f"Mean topic weight: {mean(selected_year):.1%}")
```

The output for the saved eight-topic, seed-42 model is **29.2%**. Here Topic 1 has the human label “AI, access & sociotechnical power.” That topic number and label must not be transferred to a different model run.

The average gives each included post equal influence. It does not mean exactly 29.2% of posts are exclusively about AI or that each writer endorses it. A long essay and a short announcement can affect the model and the yearly average differently. The report shows alternative aggregations and author/cohort checks.

## Keep the chain of evidence visible

A useful explanation can move from a chart to its table, from a table row to a post ID, and from that post to its readable text and attribution evidence. The saved files make those steps inspectable.

The code can reliably count the words it was told to count. People still have to examine exclusions, missing evidence, author concentration, genre, and the arguments in context. The goal is an analysis whose choices can be discussed and challenged.

For a live demonstration, run `.venv-nlp/bin/python analysis/explain_analysis.py`. It prints the invented cleaning example and a clearly distinguished actual saved post result. It does not train a model or rewrite the corpus.
