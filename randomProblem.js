import { renderProblemDescription } from './render.js';
import { getEasyProblems } from './getProblems.js';
import chalk from 'chalk';
import { listSolvedProblems } from './solvedProblems.js';
import LeetCode from 'leetcode-query';

export async function getRandomProblem() {
  const allEasyProblems = await getEasyProblems();
  const solvedProblems = await listSolvedProblems();

  // Create a set of solved titles for quick lookup
  const solvedSet = new Set(solvedProblems);

  // Filter unsolved problems (by title)
  const unsolvedProblems = allEasyProblems.filter(p => !solvedSet.has(p.title));

  if (unsolvedProblems.length === 0) {
    throw new Error("You have solved all easy problems!");
  }

  // Pick a random unsolved problem object
  const randomIndex = Math.floor(Math.random() * unsolvedProblems.length);
  const randomProblem = unsolvedProblems[randomIndex];

  // Create LeetCode client
  const lc = new LeetCode();

  // Fetch full problem details by slug
  const problemDetails = await lc.problem(randomProblem.slug);

  return problemDetails;
}
//getRandomProblem()
// .then(problem => {
//  console.log(chalk.bold.underline(problem.titleSlug));
// console.log(renderProblemDescription(problem.content));
//  })
// .catch(console.error)
