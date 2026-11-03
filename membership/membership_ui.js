/* Read-only exploration of saved directory evidence. No network or model fitting.
 * Source strings become text nodes. Role counts are independent of article counts.
 */
'use strict';
(() => {
  const data = JSON.parse(document.getElementById('directory-data').textContent);
  const byId = id => document.getElementById(id);
  const node = (tag, text = '') => {
    const result = document.createElement(tag);
    result.textContent = text;
    return result;
  };
  function options(id, values) {
    byId(id).replaceChildren(...values.map(([value, label]) => {
      const option = node('option', label);
      option.value = value;
      return option;
    }));
  }
  function renderMatrix() {
    const table = node('table');
    table.append(node('caption', 'Directory name/role counts; select a cell for source evidence'));
    const head = node('tr');
    head.append(node('th', 'Academic year'));
    for (const label of Object.values(data.roles)) head.append(node('th', label));
    const thead = node('thead'); thead.append(head); table.append(thead);
    const body = node('tbody');
    const maximum = Math.max(1, ...data.counts.flatMap(row => Object.keys(data.roles).map(role => row[role])));
    for (const row of data.counts) {
      const line = node('tr'); line.append(node('th', row.academic_year));
      for (const [role, label] of Object.entries(data.roles)) {
        const cell = node('td');
        const button = node('button', String(row[role]));
        button.type = 'button';
        button.style.setProperty('--strength', row[role] / maximum);
        button.setAttribute('aria-label', `${row.academic_year}, ${label}: ${row[role]} recorded names`);
        button.addEventListener('click', () => {
          byId('directory-year').value = row.academic_year;
          byId('directory-role').value = role;
          renderMembers();
        });
        cell.append(button); line.append(cell);
      }
      body.append(line);
    }
    table.append(body); byId('directory-matrix').replaceChildren(table);
  }
  function renderMembers() {
    const year = byId('directory-year').value;
    const role = byId('directory-role').value;
    const selected = data.annual.filter(row =>
      (year === 'all' || row.academic_year === year) &&
      (role === 'all' || row.role_family === role));
    byId('directory-selection').textContent = `${selected.length} name/role/year entries in this selection; repeated names across years and roles are retained.`;
    const cards = selected.slice(0, 80).map(row => {
      const card = node('article');
      card.append(node('h3', `${row.source_names.join(' / ')} · ${row.academic_year}`));
      card.append(node('p', `${data.roles[row.role_family]} · eligible semester labels: ${row.semesters.join(', ')} · archive grouping label: ${row.name}`));
      const details = node('details'); details.append(node('summary', 'Inspect the original role claim'));
      for (const id of row.claim_ids) {
        const claim = data.claims.find(c => c.id === id);
        details.append(node('blockquote', claim.raw_source_line), node('p', claim.note));
      }
      const source = node('a', 'Read the GCDI source'); source.href = data.source.source_url + '#alum';
      details.append(source); card.append(details);
      const posts = data.posts.filter(post => post.year === row.academic_year && post.authors.includes(row.name) && post.membership.dated_roles.some(r => r.role_family === row.role_family && r.name === row.name));
      card.append(node('p', `${posts.length} published archive record(s) carry a matching credit. This is not verified personal production.`));
      if (posts.length) {
        const list = node('ul');
        for (const post of posts) {
          const item = node('li'); const link = node('a', post.title);
          link.href = post.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
          item.append(link, node('span', ` · ${post.authorshipTier}`)); list.append(item);
        }
        card.append(list);
      }
      return card;
    });
    if (selected.length > 80) cards.push(node('p', 'Showing the first 80 entries. Choose a year or role to narrow the display; the downloadable table retains every row.'));
    if (!selected.length) cards.push(node('p', 'No dated claim matches this selection; absence from this table does not establish nonmembership.'));
    byId('directory-members').replaceChildren(...cards);
  }
  function renderContext() {
    const audit = data.audit;
    byId('directory-summary').textContent = `${audit.alumni_source_rows} alumni source rows · ${audit.dated_role_claims} dated role claims · ${audit.undated_alumni_role_claims} undated alumni role claims · ${audit.current_role_names} current role labels without inferred appointment years.`;
    byId('directory-current').replaceChildren(...data.current_snapshot.sections.map(section => {
      const card = node('article'); card.append(node('h3', section.role_heading), node('p', section.names.join('; '))); return card;
    }));
    const table = node('table');
    const head = node('tr');
    for (const label of ['Evidence basis', 'Matching local records (of 325)', 'Matching modeled posts (of 299)']) head.append(node('th', label));
    table.append(head);
    for (const [basis, label] of Object.entries(data.bases)) {
      const row = node('tr');
      for (const value of [label, audit.local_post_matches_by_basis[basis], audit.modeled_post_matches_by_basis[basis]]) row.append(node('td', String(value)));
      table.append(row);
    }
    byId('directory-bases').replaceChildren(table);
  }
  options('directory-year', [['all', 'All dated academic years'], ...data.counts.map(row => [row.academic_year, row.academic_year])]);
  options('directory-role', [['all', 'All dated roles'], ...Object.entries(data.roles)]);
  byId('directory-year').addEventListener('change', renderMembers);
  byId('directory-role').addEventListener('change', renderMembers);
  byId('directory-reset').addEventListener('click', () => {
    byId('directory-year').value = 'all'; byId('directory-role').value = 'all'; renderMembers();
  });
  renderMatrix(); renderContext(); renderMembers();
})();
