// ==UserScript==
// @name binki-atlassian-jira-vote-keyboard-shortcut
// @homepageURL https://github.com/binki/binki-atlassian-jira-vote-keyboard-shortcut
// @version 1.0.0
// @match https://*.atlassian.net/*
// @require https://github.com/binki/binki-userscript-when-element-query-selector-async/raw/0a9c204bdc304a9e82f1c31d090fdfdf7b554930/binki-userscript-when-element-query-selector-async.js
// ==/UserScript==

let triggering = false;

document.body.addEventListener('beforeinput', e => {
  // We received an event indicating that the character would be used for input, so cancel any speculative handling.
  triggering = false;
});

document.body.addEventListener('keydown', e => {
  // Ignore already-handled.
  if (e.defaultPrevented) return;

  // Ignore composition
	if (e.isComposing || e.keyCode === 229) return;

  // Ignore repeats because it is confusing if the vote flips back and forth while the key is held and may actually cause problems with consuming Jira’s API.
  if (e.repeat) return;

  // Only match v (and as a result require shift+v when capslock is on I guess).
  if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey || e.key !== 'v') return;

  // Ignore the key when the target is a select. Specifically test for select so
  // that we don’t interfere with the user typing to choose a different select option
  // (since the beforeinput guard doesn’t apply to select elements).
  if (e.target.closest('input, select')) return;

  // Since it is hard to test for whether or not the default action will actually
  // cause input, wait for that default action to occur and see if we get a beforeinput
  // for it.
  triggering = true;
  Promise.resolve().then(() => {
    // Skip because a beforeinput event was fired, meaning that the key was used as input to a textbox or contenteditable.
    if (!triggering) return;

    const issueVoteOptionsButtonElement = document.querySelector('[data-testid="issue-field-voters.ui.button.styled-button"]');
    // Only if we are in an issue view screen.
    if (!issueVoteOptionsButtonElement) return;
    (async () => {
      // Click the vote button to expand the dialog.
      issueVoteOptionsButtonElement.click();

      // Click the vote button in the expanded dialog.
      (await whenElementQuerySelectorAsync(document, '[data-testid="issue-field-voters.ui.vote-toggle.tooltip--container"] button')).click();
    })();
  });
});
