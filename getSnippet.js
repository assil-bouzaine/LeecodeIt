import LeetCode from 'leetcode-query';

export async function getSnippet(problemSlug, langSlug) {
  const lc = new LeetCode();

  // Fetch problem details
  const problem = await lc.problem(problemSlug);

  // Find the Python snippet
  const lang_snippet = problem.codeSnippets.find(
    (snippet) => snippet.langSlug === langSlug
  );

  return lang_snippet ? lang_snippet.code : null;
}


