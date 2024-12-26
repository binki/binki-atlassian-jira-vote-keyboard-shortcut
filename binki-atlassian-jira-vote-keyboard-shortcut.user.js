// ==UserScript==
// @name binki-atlassian-jira-vote-keyboard-shortcut
// @homepageURL https://github.com/binki/binki-atlassian-jira-vote-keyboard-shortcut
// @version 1.0.0
// @match https://*.atlassian.net/*
// @require https://github.com/binki/binki-userscript-when-element-query-selector-async/raw/0a9c204bdc304a9e82f1c31d090fdfdf7b554930/binki-userscript-when-element-query-selector-async.js
// ==/UserScript==

document.body.addEventListener('keyup', e => {
  // Ignore already-handled.
  if (e.defaultPrevented) return;
  
  // Ignore composition
	if (e.isComposing || e.keyCode === 229) return;
  
  // Only match v (and as a result require shift+v when capslock is on I guess).
  if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey || e.key !== 'v') return;

  const issueVoteOptionsButtonElement = document.querySelector('[data-testid="issue-field-voters.ui.button.styled-button"]');
  // Only if we are in an issue view screen.
  if (!issueVoteOptionsButtonElement) return;
  (async () => {
    issueVoteOptionsButtonElement.click();
  
    // Click the vote button to expand the dialog.
    (await whenElementQuerySelectorAsync(document, '[data-testid="issue-field-voters.ui.vote-toggle.tooltip--container"] button')).click();
  })();
});
